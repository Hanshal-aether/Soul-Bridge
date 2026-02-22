'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { supabase } from '@/lib/supabase';
import { auditBill } from '@/lib/ai-audit';
import { connectMetaMask, sendUSDCPayment, isMetaMaskInstalled } from '@/lib/metamask';
import toast from 'react-hot-toast';
import { FiUpload, FiArrowLeft, FiCheck, FiDollarSign } from 'react-icons/fi';
import Link from 'next/link';

interface AuditResult {
  isValid: boolean;
  originalAmount: number;
  auditedAmount: number;
  negotiableAmount: number;
  confidence: number;
  reasoning: string;
  recommendations: string[];
  flaggedItems?: string[];
}

export default function UploadBillPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    hospitalName: '',
    billAmount: '',
    description: '',
    procedures: '',
  });
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<'audited' | 'negotiable'>('audited');
  const [metaMaskConnected, setMetaMaskConnected] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAudit = async () => {
    if (!formData.billAmount || !formData.hospitalName) {
      toast.error('Please fill in hospital name and bill amount');
      return;
    }

    setIsAuditing(true);
    try {
      console.log('[UPLOAD BILL] Starting audit for amount:', formData.billAmount);
      const result = await auditBill({
        billAmount: parseFloat(formData.billAmount),
        hospitalName: formData.hospitalName,
        billDescription: formData.description,
        procedures: formData.procedures ? formData.procedures.split(',').map((p) => p.trim()) : [],
        billImage: preview,
      });

      console.log('[UPLOAD BILL] Audit result received:', result);
      setAuditResult(result);
      toast.success('Bill audit completed!');
    } catch (error) {
      console.error('[UPLOAD BILL] Audit error:', error);
      toast.error('Failed to audit bill');
    } finally {
      setIsAuditing(false);
    }
  };

  const handleConnectMetaMask = async () => {
    try {
      if (!isMetaMaskInstalled()) {
        toast.error('Please install MetaMask extension');
        return;
      }

      await connectMetaMask();
      setMetaMaskConnected(true);
      toast.success('MetaMask connected!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect MetaMask');
    }
  };

  const handlePayment = async () => {
    if (!auditResult || !metaMaskConnected) {
      toast.error('Please connect MetaMask first');
      return;
    }

    const amount = selectedAmount === 'audited' ? auditResult.auditedAmount : auditResult.negotiableAmount;

    // Check limit (10 lakh = 1,000,000)
    if (amount > 1000000) {
      toast.error('Amount exceeds maximum transfer limit of 10 lakh');
      return;
    }

    // Check monthly limit
    try {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const { data: monthlyTransactions, error } = await supabase
        .from('transactions')
        .select('healthcoin_amount')
        .eq('user_id', user?.uid)
        .eq('status', 'confirmed')
        .gte('created_at', monthStart.toISOString());

      if (error) {
        console.warn('Could not check monthly limit:', error);
      }

      const monthlyTotal = (monthlyTransactions || []).reduce((sum, tx) => sum + (tx.healthcoin_amount || 0), 0);
      const newTotal = monthlyTotal + amount;

      if (newTotal > 1000000) {
        const remaining = Math.max(0, 1000000 - monthlyTotal);
        toast.error(`Monthly limit exceeded. You can transfer up to $${remaining.toFixed(2)} more this month.`);
        return;
      }

      console.log('[UPLOAD BILL] Monthly limit check passed. Current: $' + monthlyTotal + ', New total: $' + newTotal);
    } catch (err) {
      console.warn('Monthly limit check failed:', err);
      // Continue anyway
    }

    setIsProcessingPayment(true);
    try {
      console.log('[UPLOAD BILL] Processing payment of $' + amount);
      const result = await sendUSDCPayment('0x0000000000000000000000000000000000000000', amount);

      if (result.success) {
        // Save transaction to Supabase
        const { error } = await supabase.from('transactions').insert({
          user_id: user?.uid,
          hospital_id: null,
          amount: auditResult.originalAmount,
          healthcoin_amount: amount,
          status: 'confirmed',
          tx_hash: result.txHash,
          bill_url: file?.name || null,
          audited_amount: auditResult.auditedAmount,
          negotiable_amount: auditResult.negotiableAmount,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (error) {
          console.warn('Could not save transaction:', error);
        }

        toast.success(`Payment of ${amount} HealthCoin sent!`);
        router.push('/dashboard/transactions');
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Payment failed');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.billAmount || !formData.hospitalName) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!auditResult) {
      toast.error('Please run AI audit first');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from('transactions').insert({
        user_id: user?.uid,
        hospital_id: null,
        amount: parseFloat(formData.billAmount),
        healthcoin_amount: auditResult.auditedAmount,
        status: 'pending',
        bill_url: file?.name || null,
        audited_amount: auditResult.auditedAmount,
        negotiable_amount: auditResult.negotiableAmount,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.warn('Could not save transaction:', error);
      }

      toast.success('Bill submitted for processing!');
      router.push('/dashboard/pending-bills');
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Failed to submit bill');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <FiArrowLeft size={20} />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold">Upload Medical Bill</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Submit your hospital bill for AI-powered audit and blockchain payment</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload & Form Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upload Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6">Bill Document</h2>

              <label className="block mb-6">
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {preview ? (
                    <div className="space-y-3">
                      <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">{file?.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FiUpload className="text-3xl text-slate-400 mx-auto" />
                      <p className="font-medium text-slate-700 dark:text-slate-300">Click to upload</p>
                      <p className="text-sm text-slate-500">PNG, JPG, or PDF (max 10MB)</p>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* Form Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6">Bill Details</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Hospital Name *</label>
                  <input
                    type="text"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hospital name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bill Amount ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.billAmount}
                    onChange={(e) => setFormData({ ...formData, billAmount: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Bill description"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Procedures (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.procedures}
                    onChange={(e) => setFormData({ ...formData, procedures: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., CT Scan, Blood Test"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAudit}
                  disabled={isAuditing || !formData.billAmount}
                  className="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {isAuditing ? 'Auditing...' : 'Run AI Audit'}
                </button>

                <button
                  type="submit"
                  disabled={isLoading || !auditResult}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FiCheck size={20} />
                  {isLoading ? 'Submitting...' : 'Submit Bill'}
                </button>
              </form>
            </div>
          </div>

          {/* Audit Result Sidebar */}
          {auditResult && (
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Audit Result</h2>

                <div className="space-y-4 mb-6">
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Original Amount</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">${auditResult.originalAmount.toFixed(2)}</p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Audited Amount</p>
                    <p className="text-2xl font-bold text-green-600">${auditResult.auditedAmount.toFixed(2)}</p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Negotiable Amount</p>
                    <p className="text-2xl font-bold text-blue-600">${auditResult.negotiableAmount.toFixed(2)}</p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Confidence</p>
                    <p className="text-2xl font-bold text-purple-600">{auditResult.confidence}%</p>
                  </div>
                </div>

                {/* Amount Selection */}
                <div className="mb-6 space-y-2">
                  <label className="flex items-center p-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-green-500" style={{
                    borderColor: selectedAmount === 'audited' ? '#10b981' : undefined,
                    backgroundColor: selectedAmount === 'audited' ? 'rgba(16, 185, 129, 0.05)' : undefined,
                  }}>
                    <input
                      type="radio"
                      name="amount"
                      value="audited"
                      checked={selectedAmount === 'audited'}
                      onChange={(e) => setSelectedAmount(e.target.value as 'audited' | 'negotiable')}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 flex-1">
                      <span className="font-medium">Audited</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">${auditResult.auditedAmount.toFixed(2)}</p>
                    </span>
                  </label>

                  <label className="flex items-center p-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-blue-500" style={{
                    borderColor: selectedAmount === 'negotiable' ? '#3b82f6' : undefined,
                    backgroundColor: selectedAmount === 'negotiable' ? 'rgba(59, 130, 246, 0.05)' : undefined,
                  }}>
                    <input
                      type="radio"
                      name="amount"
                      value="negotiable"
                      checked={selectedAmount === 'negotiable'}
                      onChange={(e) => setSelectedAmount(e.target.value as 'audited' | 'negotiable')}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 flex-1">
                      <span className="font-medium">Negotiable</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">${auditResult.negotiableAmount.toFixed(2)}</p>
                    </span>
                  </label>
                </div>

                {/* MetaMask Payment */}
                {!metaMaskConnected ? (
                  <button
                    onClick={handleConnectMetaMask}
                    className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiDollarSign size={20} />
                    Connect MetaMask
                  </button>
                ) : (
                  <button
                    onClick={handlePayment}
                    disabled={isProcessingPayment}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FiDollarSign size={20} />
                    {isProcessingPayment ? 'Processing...' : 'Pay with HealthCoin'}
                  </button>
                )}

                {/* Reasoning */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold mb-2 text-sm">Audit Reasoning</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{auditResult.reasoning}</p>
                </div>

                {/* Recommendations */}
                {auditResult.recommendations.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2 text-sm">Recommendations</h3>
                    <ul className="space-y-1">
                      {auditResult.recommendations.slice(0, 3).map((rec, idx) => (
                        <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex gap-2">
                          <span className="text-blue-600">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

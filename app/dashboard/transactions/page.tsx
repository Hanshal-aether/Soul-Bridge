'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { FiArrowLeft, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

interface Transaction {
  id: string;
  amount: number;
  healthcoin_amount: number;
  status: 'pending' | 'confirmed' | 'failed';
  tx_hash?: string;
  bill_url?: string;
  audited_amount?: number;
  negotiable_amount?: number;
  created_at: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    fetchTransactions();
  }, [user, router]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.uid)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Could not fetch transactions:', error);
        setTransactions([]);
      } else {
        setTransactions(data || []);
      }
    } catch (err) {
      console.warn('Transactions fetch failed:', err);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <FiCheckCircle className="text-green-500" size={20} />;
      case 'pending':
        return <FiClock className="text-yellow-500" size={20} />;
      case 'failed':
        return <FiXCircle className="text-red-500" size={20} />;
      default:
        return <FiClock className="text-slate-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'pending':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'failed':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading transactions...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-4xl font-bold">Transaction History</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">View all your HealthCoin payments and bill submissions</p>
        </div>

        {/* Stats */}
        {transactions.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total Transactions</p>
              <p className="text-3xl font-bold">{transactions.length}</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total Amount</p>
              <p className="text-3xl font-bold">${transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total HealthCoin</p>
              <p className="text-3xl font-bold">${transactions.reduce((sum, t) => sum + t.healthcoin_amount, 0).toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400 mb-4 text-lg">No transactions yet</p>
            <p className="text-sm text-slate-500 mb-6">Start by uploading a medical bill to make your first payment</p>
            <Link
              href="/dashboard/upload-bill"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Upload Bill
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className={`rounded-2xl p-6 border ${getStatusColor(tx.status)} transition-all hover:shadow-lg`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">{getStatusIcon(tx.status)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">Bill Payment</h3>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          tx.status === 'confirmed' ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          tx.status === 'pending' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {formatDate(tx.created_at)}
                      </p>

                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">Original Amount</p>
                          <p className="font-semibold">${tx.amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">Audited Amount</p>
                          <p className="font-semibold">${(tx.audited_amount || tx.amount).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">Paid (HealthCoin)</p>
                          <p className="font-semibold text-blue-600">${tx.healthcoin_amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">Savings</p>
                          <p className="font-semibold text-green-600">${(tx.amount - tx.healthcoin_amount).toFixed(2)}</p>
                        </div>
                      </div>

                      {tx.tx_hash && (
                        <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            Blockchain Hash: <span className="font-mono text-xs">{tx.tx_hash.substring(0, 16)}...</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

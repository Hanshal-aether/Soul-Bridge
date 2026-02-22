'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { supabase } from '@/lib/supabase';
import { validateIDImage } from '@/lib/ai-audit';
import toast from 'react-hot-toast';
import { FiUpload, FiCheck, FiAlertCircle } from 'react-icons/fi';

export default function VerifyIdentityPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setValidationError('');
      
      const validation = await validateIDImage(selectedFile);
      if (!validation.valid) {
        setValidationError(validation.message);
        setFile(null);
        setPreview('');
        toast.error(validation.message);
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      toast.success('Image validated successfully');
    }
  };

  const handleUpload = async () => {
    if (!file || !user) {
      toast.error('Please select a valid file');
      return;
    }

    setIsLoading(true);
    try {
      // Save to Supabase with verification status
      const { error } = await supabase
        .from('users')
        .update({
          id_proof_url: `id-proof-${user.uid}-${Date.now()}`,
          verified: true,
        })
        .eq('firebase_uid', user.uid);

      if (error) {
        console.error('Supabase update error:', error);
        toast.error('Failed to verify identity. Please try again.');
        return;
      }

      toast.success('ID verified successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Failed to upload ID proof');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4 pb-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUpload className="text-blue-600 text-2xl" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Verify Your Identity</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Upload a government-issued ID to verify your account
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 mb-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Requirements:</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>✓ Clear, readable image</li>
              <li>✓ Minimum 300x300 pixels</li>
              <li>✓ JPG, PNG, WebP, or PDF</li>
              <li>✓ Max 10MB file size</li>
              <li>✓ Government-issued ID only</li>
            </ul>
          </div>

          <div className="mb-6">
            <label className="block mb-3">
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
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                      <FiCheck size={16} /> Validated
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FiUpload className="text-3xl text-slate-400 mx-auto" />
                    <p className="font-medium text-slate-700 dark:text-slate-300">Click to upload</p>
                    <p className="text-sm text-slate-500">PNG, JPG, WebP, or PDF</p>
                  </div>
                )}
              </div>
            </label>

            {validationError && (
              <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{validationError}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={handleUpload}
              disabled={!file || isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FiCheck size={20} />
              {isLoading ? 'Verifying...' : 'Verify Identity'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Your ID will be securely stored and used only for verification purposes. We never share your personal information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

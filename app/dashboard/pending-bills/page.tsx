'use client';

import { useAuthStore } from '@/lib/auth-store';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function PendingBillsPage() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Please login first</p>
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          <FiArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-slate-200 dark:border-slate-700 text-center">
          <h1 className="text-3xl font-bold mb-4">Pending Bills</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            No pending bills at the moment
          </p>
          <p className="text-sm text-slate-500">
            Bills from patients will appear here for review and approval
          </p>
        </div>
      </div>
    </div>
  );
}

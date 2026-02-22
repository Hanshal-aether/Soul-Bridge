'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700 text-center">
          <h1 className="text-3xl font-bold gradient-text mb-4">Sign Up</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Use the login page to sign up with Google. It's that simple!
          </p>
          <Link
            href="/auth/login"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useAuthStore } from '@/lib/auth-store';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { FaGoogle } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setUserType } = useAuthStore();
  const [userType, setUserTypeLocal] = useState<'individual' | 'hospital'>('individual');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        router.push('/dashboard');
      }
      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [setUser, router]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      setUser(user);
      setUserType(userType);

      // Try to sync with Supabase but don't fail if it doesn't work
      try {
        await supabase.from('users').upsert(
          {
            firebase_uid: user.uid,
            name: user.displayName || 'User',
            email: user.email,
            user_type: userType,
            verified: false,
            healthcoin_balance: 0,
          },
          { onConflict: 'firebase_uid' }
        );
      } catch (supabaseError) {
        console.warn('Supabase sync skipped:', supabaseError);
        // Continue anyway - dashboard will handle it
      }

      toast.success(`Welcome, ${user.displayName}!`);
      router.push('/auth/verify-identity');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Pop-up blocked. Please allow pop-ups for this site.');
      } else {
        toast.error(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Welcome to SoulBridge</h1>
            <p className="text-slate-600 dark:text-slate-400">Sign in to your account</p>
          </div>

          {/* User Type Selection */}
          <div className="mb-6 space-y-3">
            <label className="flex items-center p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer transition-all hover:border-blue-500" style={{
              borderColor: userType === 'individual' ? '#0ea5e9' : undefined,
              backgroundColor: userType === 'individual' ? 'rgba(14, 165, 233, 0.05)' : undefined,
            }}>
              <input
                type="radio"
                name="userType"
                value="individual"
                checked={userType === 'individual'}
                onChange={(e) => setUserTypeLocal(e.target.value as 'individual' | 'hospital')}
                className="w-4 h-4"
              />
              <span className="ml-3 font-medium">Individual User</span>
            </label>

            <label className="flex items-center p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer transition-all hover:border-blue-500" style={{
              borderColor: userType === 'hospital' ? '#0ea5e9' : undefined,
              backgroundColor: userType === 'hospital' ? 'rgba(14, 165, 233, 0.05)' : undefined,
            }}>
              <input
                type="radio"
                name="userType"
                value="hospital"
                checked={userType === 'hospital'}
                onChange={(e) => setUserTypeLocal(e.target.value as 'individual' | 'hospital')}
                className="w-4 h-4"
              />
              <span className="ml-3 font-medium">Hospital</span>
            </label>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaGoogle size={20} />
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-slate-500 text-sm">or</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Terms */}
          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-6">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>
          </p>

          {/* Footer */}
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-blue-600 font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

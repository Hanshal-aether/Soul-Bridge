'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { supabase, User as DBUser } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { FiArrowUpRight, FiArrowDownLeft, FiPlus } from 'react-icons/fi';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, userType } = useAuthStore();
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // If user type not selected, redirect to login to select it
    if (!userType) {
      router.push('/auth/login');
      return;
    }

    let isMounted = true;

    const fetchUserData = async () => {
      try {
        // Only fetch, don't create
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('firebase_uid', user.uid)
          .single();

        if (!isMounted) return;

        if (error) {
          // User doesn't exist in database yet - this is normal before ID verification
          console.log('User not yet in database (normal before ID verification)');
          // Create a temporary local user object for display only
          if (isMounted) {
            setDbUser({
              id: user.uid,
              firebase_uid: user.uid,
              name: user.displayName || 'User',
              email: user.email || '',
              user_type: userType || 'individual',
              verified: false,
              healthcoin_balance: 0,
              created_at: new Date().toISOString(),
            });
          }
        } else {
          // User exists in database
          if (isMounted) setDbUser(data);
        }
      } catch (error: any) {
        console.warn('Dashboard error:', error?.message || 'Unknown error');
        // Create temporary local user object
        if (isMounted) {
          setDbUser({
            id: user.uid,
            firebase_uid: user.uid,
            name: user.displayName || 'User',
            email: user.email || '',
            user_type: userType || 'individual',
            verified: false,
            healthcoin_balance: 0,
            created_at: new Date().toISOString(),
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [user, router, userType]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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

  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Please select user type</p>
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  if (!dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Loading user data...</p>
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Return to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome, {dbUser.name}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {userType === 'individual' ? 'Individual Dashboard' : 'Hospital Dashboard'}
          </p>
        </div>

        {/* HealthCoin Balance */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">HealthCoin Balance</h3>
              <div className="text-2xl">💰</div>
            </div>
            <div className="text-4xl font-bold mb-2">{dbUser.healthcoin_balance}</div>
            <p className="text-blue-100">≈ ${dbUser.healthcoin_balance}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4">Verification Status</h3>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${dbUser.verified ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="font-medium">{dbUser.verified ? 'Verified' : 'Pending Verification'}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4">Account Type</h3>
            <p className="font-medium capitalize">{userType || 'individual'}</p>
          </div>
        </div>

        {/* Quick Actions - Different for Individual vs Hospital */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {userType === 'individual' ? (
            <>
              <Link
                href="/dashboard/upload-bill"
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all card-hover"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <FiPlus className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Upload Bill</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Submit hospital bill for audit</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/family"
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all card-hover"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <FiPlus className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Family Members</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Manage family healthcare</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/transactions"
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all card-hover md:col-span-2"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <FiArrowUpRight className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Transactions</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">View your payment history</p>
                  </div>
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard/pending-bills"
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all card-hover"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <FiArrowDownLeft className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Pending Bills</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Review incoming payments</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/transactions"
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all card-hover"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <FiArrowUpRight className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Transactions</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">View received payments</p>
                  </div>
                </div>
              </Link>
            </>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Recent Transactions</h3>
            <Link href="/dashboard/transactions" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="text-center py-12 text-slate-600 dark:text-slate-400">
            <p>No transactions yet</p>
            {userType === 'individual' && (
              <Link href="/dashboard/upload-bill" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                Upload your first bill
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

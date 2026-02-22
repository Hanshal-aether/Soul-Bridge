'use client';

import Link from 'next/link';
import { FiArrowLeft, FiShield, FiGlobe, FiZap, FiCpu, FiDollarSign, FiLock } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          <FiArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Mission */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold mb-6">About SoulBridge</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            SoulBridge is revolutionizing healthcare payments by combining AI-powered bill auditing with blockchain technology. We make healthcare affordable, transparent, and accessible across borders.
          </p>
        </div>

        {/* Core Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Our Core Features</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* AI Bill Audit */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <FiCpu className="text-purple-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered Bill Audit</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Our advanced AI analyzes medical bills to identify fair market values, detect overcharges, and suggest negotiable amounts with hospitals.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>✓ Real-time bill analysis</li>
                <li>✓ Market rate comparison</li>
                <li>✓ Negotiable amount suggestions</li>
                <li>✓ Fraud detection</li>
              </ul>
            </div>

            {/* HealthCoin */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <FiDollarSign className="text-green-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">HealthCoin (USDC)</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Powered by USDC on Polygon blockchain, HealthCoin enables instant, secure, and borderless healthcare payments with minimal fees.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>✓ Instant settlements</li>
                <li>✓ Low transaction fees</li>
                <li>✓ Global accessibility</li>
                <li>✓ Max transfer: 10 lakh</li>
              </ul>
            </div>

            {/* Blockchain Security */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <FiLock className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Blockchain Security</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                All transactions are recorded on Polygon blockchain, ensuring transparency, immutability, and complete audit trails.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>✓ Immutable records</li>
                <li>✓ Full transparency</li>
                <li>✓ MetaMask integration</li>
                <li>✓ Polygon Amoy testnet</li>
              </ul>
            </div>

            {/* Identity Verification */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                <FiShield className="text-red-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Identity Verification</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Secure government ID verification ensures only legitimate users can access healthcare payments and audit services.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>✓ Government ID validation</li>
                <li>✓ Image quality checks</li>
                <li>✓ Secure storage</li>
                <li>✓ Privacy protected</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>

          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-500 text-white font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Sign Up & Verify</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Create your account with Google and upload your government ID for verification. This ensures security and compliance.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-500 text-white font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Upload Medical Bill</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Submit your hospital bill with details about procedures and charges. Our system accepts images and PDFs.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-500 text-white font-bold">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">AI Audit Analysis</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Our AI analyzes the bill against market rates and provides three amounts: original, audited (fair), and negotiable.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-orange-500 text-white font-bold">
                  4
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Pay with HealthCoin</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Connect your MetaMask wallet and pay using USDC (HealthCoin) on Polygon blockchain. Instant, secure, and transparent.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-red-500 text-white font-bold">
                  5
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Negotiate with Hospital</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Use our audit report to negotiate with hospitals. Many accept the audited or negotiable amounts, saving you money.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Blockchain */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Why Blockchain?</h2>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiZap className="text-yellow-500" />
                  Speed
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Transactions settle in seconds, not days. No intermediaries, no delays. Perfect for urgent medical payments.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiGlobe className="text-green-500" />
                  Global
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Send payments across borders instantly. No currency conversion delays or international wire fees.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiShield className="text-blue-500" />
                  Secure
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Cryptographically secured transactions. Every payment is verified and recorded on the blockchain permanently.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiLock className="text-purple-500" />
                  Transparent
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Complete audit trail. Both patients and hospitals can verify transactions on the public blockchain.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* HealthCoin Details */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">About HealthCoin</h2>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">What is HealthCoin?</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  HealthCoin is USDC (USD Coin) running on the Polygon blockchain. It's a stablecoin pegged 1:1 to the US Dollar, ensuring stable value for healthcare payments.
                </p>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>✓ 1 HealthCoin = 1 USD</li>
                  <li>✓ Powered by USDC</li>
                  <li>✓ Polygon blockchain</li>
                  <li>✓ MetaMask compatible</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Transfer Limits</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  To ensure compliance and security, we've set a maximum transfer limit per transaction.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-3xl font-bold text-blue-600 mb-2">10 Lakh</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Maximum per transaction (10,00,000 HealthCoin / USD)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Commitment */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Our Commitment</h2>

          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-3">Transparency</h3>
                <p>
                  Every transaction is visible on the blockchain. No hidden fees, no surprises. Complete financial clarity.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">Security</h3>
                <p>
                  Your data is encrypted and secured. We never store sensitive information unnecessarily. Privacy is paramount.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">Accessibility</h3>
                <p>
                  Healthcare payments should be easy for everyone. We're building tools that work for patients and hospitals alike.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Healthcare Payments?</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Join thousands of users saving money on medical bills with AI audits and blockchain payments.
          </p>
          <Link
            href="/auth/login"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
}

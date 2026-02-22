'use client';

import Link from 'next/link';
import { FiGithub, FiTwitter, FiMail, FiHeart } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 dark:bg-black text-slate-300 dark:text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <div className="mb-16 pb-16 border-b border-slate-800">
          <h2 className="text-3xl font-bold text-white mb-6">Why We Built SoulBridge</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* The Problem */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">The Problem We Saw</h3>
              <p className="text-slate-300 mb-4 leading-relaxed">
                Millions of people work abroad, far from their families. When a loved one gets sick back home, they want to help immediately. But the current system is broken:
              </p>
              <ul className="space-y-3 text-slate-400">
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold">⏱️</span>
                  <span><strong>Slow transfers:</strong> International money takes 3-7 days to reach hospitals</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold">💸</span>
                  <span><strong>High fees:</strong> Exchange rates and bank fees eat 10-20% of the money</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold">❓</span>
                  <span><strong>No verification:</strong> You don't know if the hospital bill is fair or inflated</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold">🏥</span>
                  <span><strong>Wrong recipient:</strong> Money goes to banks, not directly to hospitals</span>
                </li>
              </ul>
            </div>

            {/* Our Solution */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">How SoulBridge Helps</h3>
              <p className="text-slate-300 mb-4 leading-relaxed">
                We built SoulBridge to solve this. Now when your family member is sick:
              </p>
              <ul className="space-y-3 text-slate-400">
                <li className="flex gap-3">
                  <span className="text-green-500 font-bold">⚡</span>
                  <span><strong>Instant delivery:</strong> Money reaches hospital in seconds, not days</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-500 font-bold">💰</span>
                  <span><strong>No hidden fees:</strong> Direct blockchain transfer, minimal costs</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span><strong>AI verification:</strong> We check if the bill is fair and suggest better prices</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-500 font-bold">🏥</span>
                  <span><strong>Direct to hospital:</strong> Money goes straight to the hospital, not intermediaries</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Impact */}
          <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-lg p-6">
            <p className="text-slate-300 text-center">
              <span className="text-white font-semibold">Our Mission:</span> Help families send money home instantly, securely, and fairly. No delays. No hidden fees. No overpriced bills. Just direct help when it matters most.
            </p>
          </div>
        </div>

        {/* How We Built It */}
        <div className="mb-16 pb-16 border-b border-slate-800">
          <h2 className="text-3xl font-bold text-white mb-6">How We Built This</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">🤖 AI Technology</h3>
              <p className="text-slate-400 text-sm">
                We integrated Gemini AI to analyze medical bills in seconds. It checks if hospitals are overcharging and suggests fair prices. This protects families from paying too much.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">⛓️ Blockchain</h3>
              <p className="text-slate-400 text-sm">
                Using Polygon blockchain, money transfers directly to hospitals in seconds. No banks. No intermediaries. No delays. Just instant, transparent, verified payments.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">💳 Stablecoin</h3>
              <p className="text-slate-400 text-sm">
                We use USDC (HealthCoin) - a stablecoin pegged to USD. No volatility. No currency risk. Families know exactly how much their loved ones will receive.
              </p>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h4 className="font-semibold text-white mb-3">The Tech Stack</h4>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>• Next.js 15 (Frontend)</li>
                <li>• Firebase (Authentication)</li>
                <li>• Supabase (Database)</li>
                <li>• Gemini AI (Bill Analysis)</li>
                <li>• Polygon (Blockchain)</li>
                <li>• MetaMask (Wallet)</li>
              </ul>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h4 className="font-semibold text-white mb-3">What We Deliver</h4>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>✓ Instant international transfers</li>
                <li>✓ AI-verified fair pricing</li>
                <li>✓ Direct hospital payments</li>
                <li>✓ Blockchain transparency</li>
                <li>✓ No hidden fees</li>
                <li>✓ Complete security</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-lg text-white">SoulBridge</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Healthcare payments without borders. Instant. Fair. Secure.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <FiGithub size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="mailto:support@soulbridge.io" className="hover:text-blue-400 transition-colors">
                <FiMail size={20} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/upload-bill" className="hover:text-blue-400 transition-colors">
                  Upload Bill
                </Link>
              </li>
              <li>
                <Link href="/dashboard/transactions" className="hover:text-blue-400 transition-colors">
                  Transactions
                </Link>
              </li>
              <li>
                <Link href="/dashboard/family" className="hover:text-blue-400 transition-colors">
                  Family
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-400 transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@soulbridge.io" className="hover:text-blue-400 transition-colors">
                  Email Support
                </a>
              </li>
              <li>
                <a href="mailto:support@soulbridge.io" className="hover:text-blue-400 transition-colors">
                  Report Issue
                </a>
              </li>
              <li>
                <a href="mailto:support@soulbridge.io" className="hover:text-blue-400 transition-colors">
                  Feedback
                </a>
              </li>
              <li>
                <a href="mailto:support@soulbridge.io" className="hover:text-blue-400 transition-colors">
                  Partnerships
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-slate-400 mb-4 md:mb-0">
              © {currentYear} SoulBridge. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Built with</span>
              <FiHeart className="text-red-500" size={16} />
              <span>for families</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

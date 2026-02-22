'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p>
              SoulBridge ("we", "us", "our") operates the SoulBridge platform. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Data Collection</h2>
            <p>We collect the following types of data:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Personal identification information (name, email, phone)</li>
              <li>Wallet addresses for blockchain transactions</li>
              <li>ID proof documents (PDF)</li>
              <li>Hospital bills and medical records</li>
              <li>Transaction history and payment information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
            <p>
              Your data is protected by end-to-end encryption and stored securely in Supabase. We never store private keys or seed phrases. All sensitive data is encrypted in transit and at rest.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Data Usage</h2>
            <p>We use your data to:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Process healthcare payments</li>
              <li>Verify your identity</li>
              <li>Audit hospital bills</li>
              <li>Maintain transaction records</li>
              <li>Improve our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Third-Party Services</h2>
            <p>
              We use Firebase for authentication, Supabase for database, and blockchain networks for transactions. These services have their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at support@soulbridge.io
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

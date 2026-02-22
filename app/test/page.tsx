'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testAudit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          billAmount: 5000,
          hospitalName: 'City Hospital',
          billDescription: 'Emergency room visit',
          procedures: ['CT Scan', 'Blood Test'],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      toast.success('Audit successful!');
      console.log('Audit result:', data);
    } catch (error: any) {
      console.error('Test error:', error);
      toast.error(error.message || 'Test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">API Test Page</h1>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-bold mb-4">Test Bill Audit API</h2>
          <button
            onClick={testAudit}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Run Test'}
          </button>
        </div>

        {result && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-4">Result</h2>
            <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

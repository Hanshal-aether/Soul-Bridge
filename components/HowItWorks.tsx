'use client';

import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

export default function HowItWorks() {
  const steps = [
    { number: '1', title: 'Connect Wallet', description: 'Link your MetaMask wallet securely' },
    { number: '2', title: 'Select Hospital', description: 'Choose verified hospital partner' },
    { number: '3', title: 'Upload Bill', description: 'Submit hospital bill for AI audit' },
    { number: '4', title: 'Confirm Payment', description: 'Review audited amount and approve' },
    { number: '5', title: 'Blockchain Settlement', description: 'Transaction confirmed on-chain' },
    { number: '6', title: 'Hospital Receives', description: 'Funds instantly available' },
  ];

  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Simple, transparent, and secure healthcare payment flow
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex items-center gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Content */}
                <div className="flex-1">
                  <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold gradient-text">{step.number}</span>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
                  </div>
                </div>

                {/* Circle */}
                <div className="hidden md:flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold z-10 relative">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <FiArrowRight className="text-blue-500 mt-4 transform rotate-90" size={24} />
                  )}
                </div>

                {/* Spacer */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { FiLock, FiEye, FiShield, FiKey } from 'react-icons/fi';

export default function SecuritySection() {
  const features = [
    {
      icon: FiLock,
      title: 'Wallet Signature Verification',
      description: 'No seed phrases ever requested. Sign-in only.',
    },
    {
      icon: FiEye,
      title: 'Smart Contract Transparency',
      description: 'All transactions verifiable on-chain',
    },
    {
      icon: FiShield,
      title: 'Multi-Layer Encryption',
      description: 'End-to-end encryption for all data',
    },
    {
      icon: FiKey,
      title: 'User-Controlled Assets',
      description: 'You maintain full custody of your funds',
    },
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
            Security First
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Enterprise-grade security for your healthcare payments
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-xl border border-slate-200 dark:border-slate-700 card-hover"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

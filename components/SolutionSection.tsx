'use client';

import { motion } from 'framer-motion';
import { FiZap, FiShield, FiCheckCircle } from 'react-icons/fi';

export default function SolutionSection() {
  const solutions = [
    {
      icon: FiZap,
      title: 'Instant Payments',
      description: 'Blockchain-powered transfers settle in minutes, not days',
    },
    {
      icon: FiShield,
      title: 'Verified Bills',
      description: 'AI audits hospital bills against standard pricing rules',
    },
    {
      icon: FiCheckCircle,
      title: 'Family Management',
      description: 'Add family members and manage healthcare payments seamlessly',
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
            The SoulBridge Solution
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Fast, transparent, and secure healthcare payments powered by blockchain
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl border border-blue-200 dark:border-slate-600 card-hover"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{solution.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{solution.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

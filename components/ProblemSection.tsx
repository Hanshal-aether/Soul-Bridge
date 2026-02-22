'use client';

import { motion } from 'framer-motion';
import { FiClock, FiDollarSign, FiAlertCircle } from 'react-icons/fi';

export default function ProblemSection() {
  const problems = [
    {
      icon: FiClock,
      title: 'Slow Transfers',
      description: 'Traditional remittance takes 3-5 days for healthcare payments',
    },
    {
      icon: FiDollarSign,
      title: 'High Fees',
      description: 'International payment fees eat up 5-10% of medical funds',
    },
    {
      icon: FiAlertCircle,
      title: 'Lack of Transparency',
      description: 'No verification of hospital payments or bill authenticity',
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
            The Problem
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Healthcare emergencies require instant funds. Traditional remittance fails families.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-200 dark:border-slate-700 card-hover"
              >
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-red-500" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{problem.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

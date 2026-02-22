'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Stat {
  label: string;
  value: string;
  suffix?: string;
}

export default function StatsSection() {
  const [stats, setStats] = useState<Stat[]>([
    { label: 'Countries Connected', value: '45', suffix: '+' },
    { label: 'Hospitals Onboarded', value: '1200', suffix: '+' },
    { label: 'Transactions Secured', value: '50K', suffix: '+' },
    { label: 'Total Volume', value: '$25M', suffix: '+' },
  ]);

  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {stat.value}
                {stat.suffix}
              </div>
              <p className="text-slate-600 dark:text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

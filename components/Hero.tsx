'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const diamondRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate diamond rotation
    if (diamondRef.current) {
      gsap.to(diamondRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
      });
    }

    // Parallax effect on scroll
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollY = window.scrollY;
        containerRef.current.style.transform = `translateY(${scrollY * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 z-0">
        {/* Animated Diamond */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div
            ref={diamondRef}
            className="w-64 h-64 md:w-96 md:h-96 relative"
          >
            {/* Diamond Shape */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full opacity-20 blur-3xl" />
            <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full" />
            
            {/* Inner rotating elements */}
            <div className="absolute inset-8 border-2 border-purple-500/20 rounded-full" />
            <div className="absolute inset-16 border-2 border-pink-500/20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
            SoulBridge
          </h1>
          <h2 className="text-2xl md:text-4xl font-semibold mb-4 text-slate-700 dark:text-slate-200">
            Fast, Secure, Verified Healthcare Payments
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Simplifying healthcare payments, audits, and family support worldwide
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/auth/login"
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105 btn-glow"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="px-8 py-4 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-slate-800 transition-all"
          >
            Learn More
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-blue-500 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-blue-500 rounded-full mt-2" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

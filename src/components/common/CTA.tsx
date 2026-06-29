'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PhoneCall, Calendar } from 'lucide-react';

interface CTAProps {
  title?: string;
  subtitle?: string;
}

export default function CTA({
  title = "Ready to Upgrade Your Laboratory or Cryogenic Infrastructure?",
  subtitle = "Consult with our team of specialists to design, install, and calibrate world-class scientific equipment tailored for your institution."
}: CTAProps) {
  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-white via-[#f0f7ff] to-[#e0f2fe] border-t border-blue-100">
      {/* Light highlights inside CTA */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel border border-primary/10 rounded-3xl p-10 md:p-16 flex flex-col items-center shadow-2xl bg-white/80"
        >
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-secondary/10 text-secondary border border-secondary/20 mb-6">
            Consultation Request
          </span>
          <h2 className="font-hanken font-bold text-3xl md:text-5xl text-[#0B3D91] tracking-tight leading-tight max-w-3xl">
            {title}
          </h2>
          <p className="text-gray-600 font-sans text-base md:text-lg mt-6 max-w-2xl leading-relaxed">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-secondary to-accent hover:from-accent hover:to-secondary text-white font-medium shadow-lg shadow-secondary/20 transition-all duration-300"
            >
              <Calendar className="w-5 h-5" />
              <span>Schedule Free Consultation</span>
            </Link>
            
            <a
              href="tel:+914422501234"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-blue-50 border border-blue-100 text-[#0B3D91] font-medium shadow-sm transition-all duration-300"
            >
              <PhoneCall className="w-5 h-5 text-secondary" />
              <span>Call Sales: +91 44 2250 1234</span>
            </a>
          </div>

          <p className="text-gray-500 text-xs mt-6">
            Response Time: Usually under 4 hours • 24/7 technical hotline available for current clients
          </p>
        </motion.div>
      </div>
    </section>
  );
}

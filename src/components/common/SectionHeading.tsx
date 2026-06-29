'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  light?: boolean;
}

export default function SectionHeading({
  badge,
  title,
  subtitle,
  align = 'center',
  light = false
}: SectionHeadingProps) {
  const isLeft = align === 'left';

  return (
    <div className={`flex flex-col mb-12 ${isLeft ? 'items-start text-left' : 'items-center text-center'}`}>
      {badge && (
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-secondary/15 text-accent border border-accent/20 mb-3"
        >
          {badge}
        </motion.span>
      )}
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`font-hanken font-bold text-3xl md:text-4xl tracking-tight leading-tight ${
          light ? 'text-white' : 'text-dark'
        }`}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`max-w-2xl mt-4 text-base md:text-lg leading-relaxed ${
            light ? 'text-white/88' : 'text-gray-600'
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

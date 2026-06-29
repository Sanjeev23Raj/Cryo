'use client';

import React from 'react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  highlightColor?: 'blue' | 'emerald' | 'amber' | 'rose';
}

export default function MetricsCard({
  title,
  value,
  description,
  trend,
  highlightColor = 'blue',
}: MetricsCardProps) {
  const getGlowStyles = () => {
    switch (highlightColor) {
      case 'blue':
        return 'border-sky-500/10 hover:border-sky-500/30 hover:shadow-sky-500/5 text-sky-400';
      case 'emerald':
        return 'border-emerald-500/10 hover:border-emerald-500/30 hover:shadow-emerald-500/5 text-emerald-400';
      case 'amber':
        return 'border-amber-500/10 hover:border-amber-500/30 hover:shadow-amber-500/5 text-amber-400';
      case 'rose':
        return 'border-rose-500/10 hover:border-rose-500/30 hover:shadow-rose-500/5 text-rose-400';
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    switch (trend.type) {
      case 'positive':
        return 'text-emerald-400';
      case 'negative':
        return 'text-rose-400';
      case 'neutral':
        return 'text-slate-400';
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border bg-slate-900/60 p-6 shadow-md backdrop-blur-sm transition-all duration-300 ${getGlowStyles()}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {trend && (
          <span className={`text-xs font-bold ${getTrendColor()}`}>
            {trend.value}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-white tracking-tight">
          {value}
        </span>
      </div>

      {description && (
        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

'use client';

import React from 'react';

interface FreezerProps {
  id: string;
  customerName: string;
  model: string;
  status: 'Normal' | 'Warning' | 'Critical';
  currentTemp?: number;
  location?: string;
  lastUpdated?: string;
}

export default function FreezerCard({
  id,
  customerName,
  model,
  status,
  currentTemp = 4.2,
  location = 'Lab Alpha',
  lastUpdated = 'Just now',
}: FreezerProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'Normal':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          dot: 'bg-emerald-400',
          glow: 'shadow-emerald-500/5',
        };
      case 'Warning':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          dot: 'bg-amber-400',
          glow: 'shadow-amber-500/5',
        };
      case 'Critical':
        return {
          bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
          dot: 'bg-rose-400',
          glow: 'shadow-rose-500/5',
        };
    }
  };

  const statusStyles = getStatusColor();

  return (
    <div className={`relative overflow-hidden rounded-xl border border-sky-500/10 bg-slate-900/60 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/20 hover:shadow-sky-500/5 ${statusStyles.glow}`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold tracking-wider text-sky-400 uppercase">
            {model}
          </span>
          <h4 className="mt-1 text-lg font-bold text-white">
            {id}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {customerName}
          </p>
        </div>

        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${statusStyles.bg}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${statusStyles.dot} animate-pulse`} />
          {status}
        </span>
      </div>

      <div className="mt-6 flex items-baseline justify-between border-t border-sky-500/5 pt-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-500">Current Temp</span>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {currentTemp.toFixed(1)}<span className="text-lg font-semibold text-sky-400">°C</span>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-slate-500">Location</span>
          <p className="text-sm font-medium text-slate-300">{location}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Updated: {lastUpdated}</p>
        </div>
      </div>
    </div>
  );
}

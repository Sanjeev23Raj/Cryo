'use client';

import React from 'react';

interface AlarmEvent {
  id: string;
  freezerId: string;
  severity: 'Warning' | 'Critical';
  temperature: number;
  timestamp: string;
  message: string;
}

interface AlarmTableProps {
  alarms?: AlarmEvent[];
}

export default function AlarmTable({ alarms = [] }: AlarmTableProps) {
  const defaultAlarms: AlarmEvent[] = [
    {
      id: 'ALM-101',
      freezerId: 'FRZ-001',
      severity: 'Critical',
      temperature: 9.4,
      timestamp: '2026-06-15 09:15',
      message: 'Temperature exceeded critical high threshold (8.0°C)',
    },
    {
      id: 'ALM-102',
      freezerId: 'FRZ-001',
      severity: 'Warning',
      temperature: 8.2,
      timestamp: '2026-06-15 08:30',
      message: 'Temperature exceeded warning threshold (8.0°C)',
    },
    {
      id: 'ALM-103',
      freezerId: 'FRZ-002',
      severity: 'Critical',
      temperature: 1.2,
      timestamp: '2026-06-14 22:45',
      message: 'Temperature dropped below critical low threshold (2.0°C)',
    },
    {
      id: 'ALM-104',
      freezerId: 'FRZ-003',
      severity: 'Warning',
      temperature: -14.1,
      timestamp: '2026-06-14 14:10',
      message: 'Temperature exceeded warning threshold (-15.0°C)',
    },
  ];

  const list = alarms.length > 0 ? alarms : defaultAlarms;

  return (
    <div className="overflow-hidden rounded-xl border border-sky-500/10 bg-slate-900/60 shadow-lg backdrop-blur-md">
      <div className="px-6 py-4 border-b border-sky-500/5">
        <h4 className="font-bold text-white tracking-wide">Recent Alarm Events</h4>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-sky-500/5 bg-slate-950/40 text-[10px] uppercase tracking-wider text-slate-400">
              <th className="px-6 py-3 font-semibold">Alarm ID</th>
              <th className="px-6 py-3 font-semibold">Freezer</th>
              <th className="px-6 py-3 font-semibold">Severity</th>
              <th className="px-6 py-3 font-semibold">Reading</th>
              <th className="px-6 py-3 font-semibold">Message</th>
              <th className="px-6 py-3 font-semibold text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-500/5 text-xs text-slate-300">
            {list.map((alarm) => (
              <tr key={alarm.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-3.5 font-semibold text-sky-400">{alarm.id}</td>
                <td className="px-6 py-3.5">{alarm.freezerId}</td>
                <td className="px-6 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      alarm.severity === 'Critical'
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {alarm.severity}
                  </span>
                </td>
                <td className="px-6 py-3.5 font-bold text-white">{alarm.temperature}°C</td>
                <td className="px-6 py-3.5 text-slate-400 max-w-xs truncate">{alarm.message}</td>
                <td className="px-6 py-3.5 text-right text-slate-500 font-mono">{alarm.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

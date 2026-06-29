import React from 'react';
import Link from 'next/link';

export default function FreezerMonitoringLanding() {
  return (
    <div className="relative min-h-[90vh] bg-[#071B34] flex flex-col justify-center pt-28 pb-20 px-4 md:px-8 text-white overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -top-40 right-10 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/25 mb-8">
          Cryo Scientific Smart-Sense
        </span>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-transparent font-sans">
          Freezer Monitoring & Analysis
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Advanced real-time telemetry, trace logging, and critical alerts for vaccine storage, blood banks, and deep cryogenic freezers. Protect sample integrity through smart analytics.
        </p>

        {/* Card Selectors */}
        <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Admin Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-sky-500/10 bg-slate-900/40 p-8 text-left backdrop-blur-md transition-all duration-300 hover:border-sky-500/25 hover:shadow-2xl hover:shadow-sky-500/5 hover:-translate-y-1">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-500/5 group-hover:bg-sky-500/10 blur-xl transition-all duration-300" />
            
            <div className="flex items-center justify-between">
              <span className="text-3xl">🛡️</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400/70 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                Staff Access
              </span>
            </div>
            
            <h3 className="mt-6 text-xl font-bold text-white tracking-wide">
              Admin Portal
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Register cryo-freezers, audit temperature files, view global alerts, and analyze aggregate metrics across your facility.
            </p>

            <Link
              href="/freezer-monitoring/admin"
              className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-sky-500 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/10"
            >
              Go To Admin
            </Link>
          </div>

          {/* Client Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-sky-500/10 bg-slate-900/40 p-8 text-left backdrop-blur-md transition-all duration-300 hover:border-sky-500/25 hover:shadow-2xl hover:shadow-sky-500/5 hover:-translate-y-1">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/5 group-hover:bg-blue-500/10 blur-xl transition-all duration-300" />

            <div className="flex items-center justify-between">
              <span className="text-3xl">🔬</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/70 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Client Access
              </span>
            </div>

            <h3 className="mt-6 text-xl font-bold text-white tracking-wide">
              Client Portal
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Access individual units using secure freezer codes to view active charts, min/max records, and export custom PDF trace audits.
            </p>

            <Link
              href="/freezer-monitoring/client"
              className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/10"
            >
              Go To Client
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import FreezerCard from '../components/FreezerCard';
import MetricsCard from '../components/MetricsCard';
import AlarmTable from '../components/AlarmTable';
import CircularRecorder from '../components/CircularRecorder';
import CSVUploader from '../components/CSVUploader';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Reading {
  id: string;
  freezer_id: string;
  temperature: number;
  timestamp: string;
}

interface Alarm {
  id: string;
  freezerId: string;
  severity: 'Warning' | 'Critical';
  temperature: number;
  timestamp: string;
  message: string;
}

export default function ClientPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [freezerId, setFreezerId] = useState('FRZ-001');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Filtering states
  const [timeFilter, setTimeFilter] = useState<'Today' | '7days' | '30days' | 'Custom'>('7days');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Limits
  const [minConfig, setMinConfig] = useState(2.0);
  const [maxConfig, setMaxConfig] = useState(8.0);

  // Data states
  const [readings, setReadings] = useState<Reading[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [metrics, setMetrics] = useState({
    min: 0,
    max: 0,
    avg: 0,
    compliance: 100,
    count: 0,
  });
  const [loading, setLoading] = useState(false);

  // Shared freezers list state
  const [freezersList, setFreezersList] = useState<any[]>([]);

  useEffect(() => {
    const fetchFreezers = async () => {
      try {
        const res = await fetch('/api/freezers');
        if (res.ok) {
          const json = await res.json();
          const list = json.freezers || [];
          setFreezersList(list);
          if (list.length > 0) {
            setFreezerId(list[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchFreezers();
  }, []);

  // Load configuration based on selected freezer
  useEffect(() => {
    if (freezerId === 'FRZ-003') {
      setMinConfig(-20.0);
      setMaxConfig(-15.0);
    } else if (freezerId === 'FRZ-002') {
      setMinConfig(2.0);
      setMaxConfig(6.0);
    } else {
      setMinConfig(2.0);
      setMaxConfig(8.0);
    }
  }, [freezerId]);

  // Fetch telemetry logs from API
  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      let url = `/api/freezer-data?freezerId=${freezerId}`;

      // Date range filtering helper
      const now = new Date();
      let fromStr = '';
      let toStr = now.toISOString();

      if (timeFilter === 'Today') {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        fromStr = todayStart.toISOString();
      } else if (timeFilter === '7days') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        fromStr = weekAgo.toISOString();
      } else if (timeFilter === '30days') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        fromStr = monthAgo.toISOString();
      } else if (timeFilter === 'Custom' && fromDate) {
        fromStr = new Date(fromDate).toISOString();
        if (toDate) {
          toStr = new Date(toDate).toISOString();
        }
      }

      if (fromStr) {
        url += `&from=${encodeURIComponent(fromStr)}&to=${encodeURIComponent(toStr)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to query logs');
      const json = await res.json();

      const dataLogs: Reading[] = json.data || [];
      setReadings(dataLogs);

      // Compute statistics and filter alarms
      if (dataLogs.length > 0) {
        let minT = Infinity;
        let maxT = -Infinity;
        let sumT = 0;
        let safeCount = 0;
        const alarmList: Alarm[] = [];

        dataLogs.forEach((log, idx) => {
          if (log.temperature < minT) minT = log.temperature;
          if (log.temperature > maxT) maxT = log.temperature;
          sumT += log.temperature;

          const isSafe = log.temperature >= minConfig && log.temperature <= maxConfig;
          if (isSafe) {
            safeCount++;
          } else {
            const deviation = log.temperature > maxConfig ? log.temperature - maxConfig : minConfig - log.temperature;
            const severity = deviation > 1.5 ? 'Critical' : 'Warning';
            
            // Consolidate logs into discrete alarm events (limit table spam)
            if (idx === 0 || dataLogs[idx - 1].temperature >= minConfig || idx % 20 === 0) {
              const timeFormatted = new Date(log.timestamp).toLocaleString('en-IN', {
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              });
              alarmList.push({
                id: `ALM-${idx + 101}`,
                freezerId: log.freezer_id,
                severity,
                temperature: log.temperature,
                timestamp: log.timestamp.replace('T', ' ').substring(0, 16),
                message: `${severity} Excursion: Temperature hit ${log.temperature}°C (${
                  log.temperature > maxConfig ? 'above limit' : 'below limit'
                }) at ${timeFormatted}`,
              });
            }
          }
        });

        setMetrics({
          min: minT,
          max: maxT,
          avg: sumT / dataLogs.length,
          compliance: (safeCount / dataLogs.length) * 100,
          count: dataLogs.length,
        });
        setAlarms(alarmList);
      } else {
        setMetrics({ min: 0, max: 0, avg: 0, compliance: 100, count: 0 });
        setAlarms([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchTelemetry();
    }
  }, [isLoggedIn, freezerId, timeFilter, fromDate, toDate, minConfig, maxConfig]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!freezerId.trim()) {
      setError('Please select/enter your Freezer ID.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setIsLoggedIn(true);
    setError('');
  };

  const handlePrintReport = async () => {
    try {
      setLoading(true);

      const reportElement = document.getElementById('report-content');
      if (!reportElement) return;

      const mainCanvas = reportElement.querySelector('canvas') as HTMLCanvasElement;
      const canvasDataUrl = mainCanvas ? mainCanvas.toDataURL('image/png') : '';

      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Page size: 210 x 297 mm
      // Header
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(15, 27, 52); // Dark Blue #0f1b34
      pdf.text('CRYO SCIENTIFIC SYSTEMS', 15, 22);
      
      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139); // Gray
      pdf.text('Advanced Cryogenic & Scientific Solutions', 15, 27);

      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(15, 27, 52);
      pdf.text('TEMPERATURE AUDIT REPORT', 130, 22);

      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 130, 27);

      // Line separator
      pdf.setDrawColor(226, 232, 240); // slate-200
      pdf.setLineWidth(0.5);
      pdf.line(15, 30, 195, 30);

      // Details Box
      pdf.setFillColor(248, 250, 252); // slate-50
      pdf.rect(15, 35, 180, 32, 'F');
      pdf.setDrawColor(226, 232, 240);
      pdf.rect(15, 35, 180, 32, 'D');

      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(71, 85, 105); // slate-600
      pdf.text('FREEZER DETAILS', 20, 42);
      pdf.text('AUDIT METRICS', 110, 42);

      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(15, 27, 52);
      
      // Left details column
      pdf.text(`Serial ID:  ${freezerId}`, 20, 48);
      pdf.text('Account:  Apex Health Corp', 20, 53);
      const modelName = freezerId === 'FRZ-003' ? 'Cryogenic Dewar' : 'Ultra-Low Temp Refrigerator';
      pdf.text(`Model:     ${modelName}`, 20, 58);
      
      // Right details column
      pdf.text(`Temp Range:     ${minConfig.toFixed(1)}°C to ${maxConfig.toFixed(1)}°C`, 110, 48);
      pdf.text(`Average Temp:   ${metrics.avg.toFixed(2)}°C`, 110, 53);
      pdf.text(`Compliance:       ${metrics.compliance.toFixed(1)}%`, 110, 58);

      // Embed circular recorder chart
      if (canvasDataUrl) {
        pdf.setFont('Helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.setTextColor(71, 85, 105);
        pdf.text('TELEMETRY TRACE RECORDING', 15, 75);
        
        // Circular chart image
        pdf.addImage(canvasDataUrl, 'PNG', 45, 80, 120, 120);
      }

      // Excursions Summary
      const excursionsY = 210;
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(15, 27, 52);
      pdf.text(`CRITICAL EXCURSIONS SUMMARY (${alarms.length})`, 15, excursionsY);

      pdf.setDrawColor(226, 232, 240);
      pdf.line(15, excursionsY + 2, 195, excursionsY + 2);

      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(8);
      
      if (alarms.length === 0) {
        pdf.setTextColor(16, 185, 129); // emerald-500
        pdf.text('No critical temperature excursions recorded. Unit is 100% compliant.', 15, excursionsY + 8);
      } else {
        pdf.setTextColor(15, 27, 52);
        // Display top 4 alarms
        const displayAlarms = alarms.slice(0, 4);
        let currentY = excursionsY + 8;
        displayAlarms.forEach((alarm) => {
          pdf.setFont('Helvetica', 'bold');
          pdf.setTextColor(239, 68, 68); // rose-500
          pdf.text(alarm.severity, 15, currentY);
          
          pdf.setFont('Helvetica', 'normal');
          pdf.setTextColor(15, 27, 52);
          const msg = alarm.message.length > 70 ? alarm.message.substring(0, 70) + '...' : alarm.message;
          pdf.text(msg, 32, currentY);
          
          pdf.setTextColor(100, 116, 139);
          pdf.text(alarm.timestamp, 160, currentY);
          currentY += 6;
        });

        if (alarms.length > 4) {
          pdf.setFont('Helvetica', 'italic');
          pdf.setTextColor(100, 116, 139);
          pdf.text(`* Showing 4 of ${alarms.length} alarms. Refer to CSV for complete logs.`, 15, currentY + 1);
        }
      }

      // Footer
      pdf.setDrawColor(226, 232, 240);
      pdf.line(15, 280, 195, 280);
      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(148, 163, 184); // slate-400
      pdf.text('Page 1 of 1  |  Cryo Scientific Smart-Sense Audit System', 15, 285);
      pdf.text('CONFIDENTIAL & COMPLIANT', 160, 285);

      pdf.save(`Freezer_Monitoring_Report_${freezerId}.pdf`);
    } catch (err: any) {
      console.error('Failed to generate PDF:', err);
      alert('Error generating PDF report: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="relative min-h-[85vh] bg-[#071B34] flex items-center justify-center px-4 pt-28 pb-12 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-md bg-slate-900/60 border border-sky-500/10 rounded-2xl p-8 shadow-xl backdrop-blur-md">
          <div className="text-center mb-8">
            <span className="text-3xl">🔬</span>
            <h2 className="mt-4 text-2xl font-bold text-white tracking-wide">Client Portal</h2>
            <p className="mt-1 text-xs text-slate-400">Access secure unit telemetry records</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                Freezer ID / Serial
              </label>
              <select
                value={freezerId}
                onChange={(e) => setFreezerId(e.target.value)}
                className="w-full bg-slate-950/80 border border-sky-500/15 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500/40"
              >
                {freezersList.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.id} ({f.model})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                Security Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/80 border border-sky-500/15 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-sky-500/40"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold uppercase tracking-wider text-xs py-3 rounded-lg transition-colors shadow-lg shadow-emerald-500/10"
            >
              Sign In to Unit
            </button>
          </form>

          <div className="mt-6 text-center border-t border-sky-500/5 pt-4">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest">
              Demo Mode: Enter any password
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Dashboard View
  return (
    <div id="report-content" className="min-h-screen bg-[#071B34] text-white pt-24 md:pt-28 pb-12 px-6 md:px-10 space-y-8 print:bg-white print:text-black print:p-0">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-sky-500/5 pb-6 print:border-slate-200">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-emerald-400 print:text-emerald-600">
            Telemetry Console
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide mt-0.5 print:text-slate-900">
            Unit {freezerId}
          </h1>
          <p className="text-xs text-slate-400 mt-1 print:text-slate-500">
            Apex Health Corp — Vaccine Storage Unit
          </p>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={handlePrintReport}
            className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-sky-500 text-white hover:bg-sky-400 rounded-lg transition-colors shadow-md"
          >
            PDF Report
          </button>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Disconnect
          </button>
        </div>
      </header>

      {/* Date Filters Row */}
      <div className="flex flex-wrap items-center gap-4 bg-slate-950/40 border border-sky-500/10 p-4 rounded-xl print:hidden">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date Filters:</span>
        <div className="flex gap-2">
          {([
            { id: 'Today', label: 'Today' },
            { id: '7days', label: 'Last 7 Days' },
            { id: '30days', label: 'Last 30 Days' },
            { id: 'Custom', label: 'Custom' },
          ] as const).map((filter) => (
            <button
              key={filter.id}
              onClick={() => setTimeFilter(filter.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                timeFilter === filter.id
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {timeFilter === 'Custom' && (
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-slate-900 border border-sky-500/15 text-xs text-white rounded px-2 py-1 focus:outline-none"
            />
            <span className="text-xs text-slate-500">to</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-slate-900 border border-sky-500/15 text-xs text-white rounded px-2 py-1 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8 print:grid-cols-1">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-1 print:space-y-4">
          <FreezerCard
            id={freezerId}
            customerName="Apex Health Corp"
            model={freezerId === 'FRZ-003' ? 'Cryogenic Dewar' : 'Ultra-Low Temp Refrigerator'}
            status={metrics.compliance > 98 ? 'Normal' : metrics.compliance > 90 ? 'Warning' : 'Critical'}
            currentTemp={readings.length > 0 ? readings[readings.length - 1].temperature : 0.0}
            location="Room 3B - Pharmacy Vault"
          />

          <div className="grid grid-cols-2 gap-4">
            <MetricsCard title="Min Temp" value={`${metrics.min.toFixed(1)}°C`} highlightColor="blue" />
            <MetricsCard title="Max Temp" value={`${metrics.max.toFixed(1)}°C`} highlightColor="rose" />
            <MetricsCard title="Average" value={`${metrics.avg.toFixed(1)}°C`} highlightColor="blue" />
            <MetricsCard
              title="Compliance"
              value={`${metrics.compliance.toFixed(1)}%`}
              highlightColor={metrics.compliance > 98 ? 'emerald' : 'amber'}
            />
          </div>

          <div className="print:hidden">
            <CSVUploader freezerId={freezerId} onUploadSuccess={fetchTelemetry} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-2 print:space-y-4">
          {loading ? (
            <div className="rounded-2xl border border-sky-500/10 bg-slate-900/40 p-12 flex flex-col items-center justify-center min-h-[400px]">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
              <p className="mt-4 text-xs text-slate-400 tracking-wider uppercase">Loading database logs...</p>
            </div>
          ) : (
            <CircularRecorder
              freezerId={freezerId}
              minConfig={minConfig}
              maxConfig={maxConfig}
              readings={readings.map((r) => ({ timestamp: r.timestamp, temperature: r.temperature }))}
              alarms={alarms.map((a) => ({ timestamp: a.timestamp, temperature: a.temperature, severity: a.severity }))}
            />
          )}

          <AlarmTable alarms={alarms} />
        </div>
      </div>

      {/* Off-screen PDF Report Template */}
      <div
        id="pdf-report-template"
        className="fixed top-[9999px] left-[9999px] w-[720px] bg-white text-slate-900 p-8 space-y-6 font-sans border border-slate-200"
        style={{ position: 'fixed', left: '9999px', top: '9999px' }}
      >
        {/* Logo & Header */}
        <div className="flex justify-between items-center border-b-2 border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <img src="/company logo.svg" alt="Cryo Scientific" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-xl font-bold tracking-wide text-slate-800">CRYO SCIENTIFIC SYSTEMS</h1>
              <p className="text-[9px] uppercase tracking-wider text-slate-400">
                Advanced Cryogenic & Scientific Solutions
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-500">TEMPERATURE AUDIT REPORT</p>
            <p className="text-[10px] text-slate-400">Generated: {new Date().toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Freezer Info & Date Range */}
        <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg text-xs">
          <div>
            <h4 className="font-bold text-slate-500 uppercase mb-2">Freezer Details</h4>
            <p>
              <span className="font-semibold text-slate-700">Serial ID:</span> {freezerId}
            </p>
            <p>
              <span className="font-semibold text-slate-700">Account:</span> Apex Health Corp
            </p>
            <p>
              <span className="font-semibold text-slate-700">Model:</span>{' '}
              {freezerId === 'FRZ-003' ? 'Cryogenic Dewar' : 'Ultra-Low Temp Refrigerator'}
            </p>
            <p>
              <span className="font-semibold text-slate-700">Location:</span> Room 3B - Pharmacy Vault
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-500 uppercase mb-2">Audit Settings</h4>
            <p>
              <span className="font-semibold text-slate-700">Date Range Filter:</span>{' '}
              {timeFilter === '7days'
                ? 'Last 7 Days'
                : timeFilter === '30days'
                ? 'Last 30 Days'
                : timeFilter === 'Today'
                ? 'Today'
                : 'Custom Range'}
            </p>
            {timeFilter === 'Custom' && (
              <p>
                <span className="font-semibold text-slate-700">Span:</span> {fromDate} to {toDate}
              </p>
            )}
            <p>
              <span className="font-semibold text-slate-700">Target Range:</span> {minConfig}°C to {maxConfig}°C
            </p>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-3 border border-slate-100 rounded bg-slate-50">
            <p className="text-[9px] uppercase font-bold text-slate-400">Min Temperature</p>
            <p className="text-lg font-bold text-blue-600 mt-1">{metrics.min.toFixed(1)}°C</p>
          </div>
          <div className="p-3 border border-slate-100 rounded bg-slate-50">
            <p className="text-[9px] uppercase font-bold text-slate-400">Max Temperature</p>
            <p className="text-lg font-bold text-rose-600 mt-1">{metrics.max.toFixed(1)}°C</p>
          </div>
          <div className="p-3 border border-slate-100 rounded bg-slate-50">
            <p className="text-[9px] uppercase font-bold text-slate-400">Average Temp</p>
            <p className="text-lg font-bold text-slate-700 mt-1">{metrics.avg.toFixed(1)}°C</p>
          </div>
          <div className="p-3 border border-slate-100 rounded bg-slate-50">
            <p className="text-[9px] uppercase font-bold text-slate-400">Compliance Rate</p>
            <p className="text-lg font-bold text-emerald-600 mt-1">{metrics.compliance.toFixed(1)}%</p>
          </div>
        </div>

        {/* Chart & Alarms */}
        <div className="flex flex-col items-center justify-center border border-slate-200 p-6 rounded-lg bg-slate-50">
          <h4 className="font-bold text-xs text-slate-600 uppercase mb-4 w-full text-left">
            Circular Trace Recording
          </h4>
          <img
            id="pdf-report-chart-img"
            alt="Circular Recorder Trace"
            className="w-[340px] h-[340px] object-contain border border-slate-200 rounded-lg p-2 bg-white"
          />
        </div>

        {/* Alarms Summary */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <h4 className="font-bold text-xs text-slate-600 uppercase mb-3">Critical Excursions Summary</h4>
          {alarms.length === 0 ? (
            <p className="text-xs text-slate-400">No critical temperature events recorded for this audit window.</p>
          ) : (
            <div className="space-y-1.5 max-h-[160px] overflow-hidden">
              {alarms.slice(0, 3).map((a, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-1.5 border-b border-slate-100">
                  <span className="font-bold text-rose-600">{a.severity}</span>
                  <span className="text-slate-600 truncate max-w-sm">{a.message}</span>
                  <span className="text-slate-400 font-mono">{a.timestamp}</span>
                </div>
              ))}
              {alarms.length > 3 && (
                <p className="text-[10px] text-slate-400 italic text-center mt-1">
                  Showing 3 of {alarms.length} alarms.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

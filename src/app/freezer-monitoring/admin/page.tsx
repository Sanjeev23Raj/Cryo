'use client';

import React, { useState, useEffect } from 'react';
import MetricsCard from '../components/MetricsCard';
import CSVUploader from '../components/CSVUploader';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Register' | 'List' | 'CSV' | 'Reports'>('Dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Dynamic Freezer State
  const [freezers, setFreezers] = useState<any[]>([]);

  // Registration form inputs state
  const [newId, setNewId] = useState('');
  const [newCustomer, setNewCustomer] = useState('');
  const [newModel, setNewModel] = useState('');

  // CSV and Reports State
  const [selectedUploadFreezerId, setSelectedUploadFreezerId] = useState('');
  const [selectedReportFreezerId, setSelectedReportFreezerId] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [compiledReport, setCompiledReport] = useState<any | null>(null);

  const fetchFreezersList = async () => {
    try {
      const res = await fetch('/api/freezers');
      if (res.ok) {
        const json = await res.json();
        const list = json.freezers || [];
        setFreezers(list);
        if (list.length > 0) {
          setSelectedUploadFreezerId(prev => prev || list[0].id);
          setSelectedReportFreezerId(prev => prev || list[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load freezers database list:', e);
    }
  };

  useEffect(() => {
    fetchFreezersList();
  }, []);

  const handleRegister = async () => {
    if (!newId.trim() || !newCustomer.trim() || !newModel.trim()) {
      alert('Please fill in all registration fields.');
      return;
    }

    const newFreezer = {
      id: newId.trim(),
      customerName: newCustomer.trim(),
      model: newModel.trim(),
    };

    try {
      const res = await fetch('/api/freezers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFreezer),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to save new unit.');
      }

      await fetchFreezersList(); // Reload shared data
      
      // Reset inputs
      setNewId('');
      setNewCustomer('');
      setNewModel('');
      
      // Redirect to list view
      setActiveTab('List');
      alert(`Unit ${newFreezer.id} registered successfully & stored in SQL database!`);
    } catch (err: any) {
      alert(err.message || 'Error registering unit.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please fill in both Username and Password.');
      return;
    }
    setIsLoggedIn(true);
    setError('');
  };

  const handleCompileReport = async () => {
    if (!selectedReportFreezerId) {
      alert('Please select a freezer.');
      return;
    }
    setReportLoading(true);
    try {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const url = `/api/freezer-data?freezerId=${selectedReportFreezerId}&from=${encodeURIComponent(weekAgo.toISOString())}&to=${encodeURIComponent(now.toISOString())}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch freezer data');
      const json = await res.json();
      const logs = json.data || [];
      
      const freezer = freezers.find(f => f.id === selectedReportFreezerId);
      
      let minConfig = 2.0;
      let maxConfig = 8.0;
      if (selectedReportFreezerId === 'FRZ-003') {
        minConfig = -20.0;
        maxConfig = -15.0;
      } else if (selectedReportFreezerId === 'FRZ-002') {
        minConfig = 2.0;
        maxConfig = 6.0;
      }

      if (logs.length > 0) {
        let minT = Infinity;
        let maxT = -Infinity;
        let sumT = 0;
        let safeCount = 0;
        const alarmList: any[] = [];

        logs.forEach((log: any, idx: number) => {
          if (log.temperature < minT) minT = log.temperature;
          if (log.temperature > maxT) maxT = log.temperature;
          sumT += log.temperature;

          const isSafe = log.temperature >= minConfig && log.temperature <= maxConfig;
          if (isSafe) {
            safeCount++;
          } else {
            const deviation = log.temperature > maxConfig ? log.temperature - maxConfig : minConfig - log.temperature;
            const severity = deviation > 1.5 ? 'Critical' : 'Warning';
            
            if (idx === 0 || logs[idx - 1].temperature >= minConfig || idx % 20 === 0) {
              alarmList.push({
                severity,
                temperature: log.temperature,
                timestamp: log.timestamp.replace('T', ' ').substring(0, 16),
                message: `${severity} Excursion: Temperature hit ${log.temperature}°C (${
                  log.temperature > maxConfig ? 'above limit' : 'below limit'
                })`,
              });
            }
          }
        });

        setCompiledReport({
          min: minT,
          max: maxT,
          avg: sumT / logs.length,
          compliance: (safeCount / logs.length) * 100,
          alarms: alarmList,
          freezer,
          logsCount: logs.length,
          minConfig,
          maxConfig,
          rawLogs: logs
        });
      } else {
        setCompiledReport({
          min: 0,
          max: 0,
          avg: 0,
          compliance: 100,
          alarms: [],
          freezer,
          logsCount: 0,
          minConfig,
          maxConfig,
          rawLogs: []
        });
      }
    } catch (err: any) {
      alert(err.message || 'Error compiling report data.');
    } finally {
      setReportLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!compiledReport) return;
    const { rawLogs } = compiledReport;
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Log ID,Freezer ID,Temperature (C),Timestamp,Created At\n';
    rawLogs.forEach((log: any) => {
      csvContent += `"${log.id}","${log.freezer_id}",${log.temperature},"${log.timestamp}","${log.created_at}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit_Report_${selectedReportFreezerId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = async () => {
    if (!compiledReport) return;
    
    try {
      const { jsPDF } = await import('jspdf');
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
      pdf.text(`Serial ID:  ${compiledReport.freezer?.id}`, 20, 48);
      pdf.text(`Account:  ${compiledReport.freezer?.customerName}`, 20, 53);
      pdf.text(`Model:     ${compiledReport.freezer?.model}`, 20, 58);
      
      // Right details column
      pdf.text(`Temp Range:     ${compiledReport.minConfig.toFixed(1)}°C to ${compiledReport.maxConfig.toFixed(1)}°C`, 110, 48);
      pdf.text(`Average Temp:   ${compiledReport.avg.toFixed(2)}°C`, 110, 53);
      pdf.text(`Compliance:       ${compiledReport.compliance.toFixed(1)}%`, 110, 58);

      // Excursions Summary Title
      const excursionsY = 80;
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(15, 27, 52);
      pdf.text(`CRITICAL EXCURSIONS SUMMARY (${compiledReport.alarms.length})`, 15, excursionsY);

      pdf.setDrawColor(226, 232, 240);
      pdf.line(15, excursionsY + 2, 195, excursionsY + 2);

      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(8);
      
      if (compiledReport.alarms.length === 0) {
        pdf.setTextColor(16, 185, 129); // emerald-500
        pdf.text('No critical temperature excursions recorded. Unit is 100% compliant.', 15, excursionsY + 8);
      } else {
        pdf.setTextColor(15, 27, 52);
        
        // Headers of Excursions Table
        pdf.setFont('Helvetica', 'bold');
        pdf.setFillColor(241, 245, 249); // slate-100
        pdf.rect(15, excursionsY + 5, 180, 7, 'F');
        pdf.text('Severity', 18, excursionsY + 10);
        pdf.text('Temperature', 45, excursionsY + 10);
        pdf.text('Excursion Message', 80, excursionsY + 10);
        pdf.text('Timestamp', 160, excursionsY + 10);
        
        pdf.setFont('Helvetica', 'normal');
        let currentY = excursionsY + 18;
        
        // Show up to 25 alarms on this page
        const displayAlarms = compiledReport.alarms.slice(0, 25);
        displayAlarms.forEach((alarm: any) => {
          // Excursion Severity
          pdf.setFont('Helvetica', 'bold');
          if (alarm.severity === 'Critical') {
            pdf.setTextColor(239, 68, 68); // rose-500
          } else {
            pdf.setTextColor(245, 158, 11); // amber-500
          }
          pdf.text(alarm.severity, 18, currentY);
          
          // Temperature
          pdf.setFont('Helvetica', 'bold');
          pdf.setTextColor(15, 27, 52);
          pdf.text(`${alarm.temperature.toFixed(2)}°C`, 45, currentY);
          
          // Message & Time
          pdf.setFont('Helvetica', 'normal');
          const cleanMsg = alarm.message.replace(/Critical Excursion: |Warning Excursion: /g, '');
          pdf.text(cleanMsg, 80, currentY);
          
          pdf.setTextColor(100, 116, 139);
          pdf.text(alarm.timestamp, 160, currentY);
          
          // Draw thin line between rows
          pdf.setDrawColor(241, 245, 249);
          pdf.setLineWidth(0.2);
          pdf.line(15, currentY + 2, 195, currentY + 2);
          
          currentY += 7;
        });

        if (compiledReport.alarms.length > 25) {
          pdf.setFont('Helvetica', 'italic');
          pdf.setTextColor(100, 116, 139);
          pdf.text(`* Showing 25 of ${compiledReport.alarms.length} alarms. Refer to CSV for complete logs.`, 15, currentY + 2);
        }
      }

      // Footer
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.5);
      pdf.line(15, 280, 195, 280);
      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(148, 163, 184); // slate-400
      pdf.text('Page 1 of 1  |  Cryo Scientific Smart-Sense Audit System', 15, 285);
      pdf.text('CONFIDENTIAL & COMPLIANT', 160, 285);

      pdf.save(`Audit_Report_${selectedReportFreezerId}.pdf`);
    } catch (err: any) {
      alert('Error generating PDF report: ' + err.message);
    }
  };


  if (!isLoggedIn) {
    return (
      <div className="relative min-h-[85vh] bg-[#071B34] flex items-center justify-center px-4 pt-28 pb-12 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-md bg-slate-900/60 border border-sky-500/10 rounded-2xl p-8 shadow-xl backdrop-blur-md">
          <div className="text-center mb-8">
            <span className="text-3xl">🛡️</span>
            <h2 className="mt-4 text-2xl font-bold text-white tracking-wide font-sans">Admin Portal</h2>
            <p className="mt-1 text-xs text-slate-400">Cryo Scientific Systems Hub</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., admin"
                className="w-full bg-slate-950/80 border border-sky-500/15 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-sky-500/40"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                Password
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
              className="w-full mt-2 bg-sky-500 hover:bg-sky-400 text-white font-bold uppercase tracking-wider text-xs py-3 rounded-lg transition-colors shadow-lg shadow-sky-500/10"
            >
              Sign In to Command
            </button>
          </form>

          <div className="mt-6 text-center border-t border-sky-500/5 pt-4">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest">
              Demo Access: Any username & password accepted
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071B34] text-white pt-20 md:pt-24 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-sky-500/10 bg-slate-950/60 p-6 flex flex-col justify-between backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl">🛡️</span>
            <div>
              <h3 className="font-bold text-white tracking-wide uppercase text-sm">Cryo Admin</h3>
              <p className="text-[10px] text-sky-400 font-semibold tracking-widest uppercase">System Command</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'Dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'Register', label: 'Register Freezer', icon: '➕' },
              { id: 'List', label: 'Freezer List', icon: '❄️' },
              { id: 'CSV', label: 'Upload CSV', icon: '📥' },
              { id: 'Reports', label: 'Reports', icon: '📄' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                    : 'text-slate-400 hover:bg-slate-900/80 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-sky-500/5 text-center">
          <p className="text-[10px] text-slate-500">Cryo Scientific Systems</p>
          <p className="text-[9px] text-slate-600 mt-0.5">v2.1.4-beta</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
              {activeTab === 'Dashboard' && 'Telemetry Command Center'}
              {activeTab === 'Register' && 'Unit Registration'}
              {activeTab === 'List' && 'Registered Units Database'}
              {activeTab === 'CSV' && 'Log Upload Suite'}
              {activeTab === 'Reports' && 'Audit Reports Engine'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Active Session: Admin Console (Mock Node)
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/40 rounded-full border border-sky-500/10">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Node Sync Active</span>
          </div>
        </header>

        {activeTab === 'Dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricsCard title="Total Freezers" value={freezers.length} description="Registered telemetry units" highlightColor="blue" />
              <MetricsCard title="Active Freezers" value={freezers.filter(f => f.status === 'Normal').length} description="Units in safe margins" highlightColor="emerald" />
              <MetricsCard title="Uploaded Logs" value={84} description="Logs processed this week" highlightColor="amber" />
              <MetricsCard title="Alarm Events" value={freezers.filter(f => f.status === 'Critical' || f.status === 'Warning').length} description="Requiring urgent attention" highlightColor="rose" />
            </div>

            {/* Freezer Table */}
            <div className="overflow-hidden rounded-xl border border-sky-500/10 bg-slate-900/60 shadow-lg backdrop-blur-md">
              <div className="px-6 py-4 border-b border-sky-500/5 flex justify-between items-center">
                <h4 className="font-bold text-white tracking-wide">Freezer Fleet Directory</h4>
                <span className="text-[10px] text-sky-400 font-semibold tracking-wider uppercase">Live updates mock</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-sky-500/5 bg-slate-950/40 text-[10px] uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-3 font-semibold">Freezer ID</th>
                      <th className="px-6 py-3 font-semibold">Customer Name</th>
                      <th className="px-6 py-3 font-semibold">Model</th>
                      <th className="px-6 py-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-500/5 text-xs text-slate-300">
                    {freezers.map((freezer) => (
                      <tr key={freezer.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-semibold text-sky-400">{freezer.id}</td>
                        <td className="px-6 py-4 font-medium text-slate-200">{freezer.customerName}</td>
                        <td className="px-6 py-4 text-slate-400">{freezer.model}</td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              freezer.status === 'Normal'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : freezer.status === 'Warning'
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                freezer.status === 'Normal'
                                  ? 'bg-emerald-400'
                                  : freezer.status === 'Warning'
                                  ? 'bg-amber-400'
                                  : 'bg-rose-400'
                              }`}
                            />
                            {freezer.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'Register' && (
          <div className="max-w-xl rounded-xl border border-sky-500/10 bg-slate-900/60 p-8 shadow-lg">
            <p className="text-slate-400 text-xs mb-6">
              Establish a new hardware telemetry link for high-precision temperature recording.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Freezer Serial/ID</label>
                <input
                  type="text"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  placeholder="e.g., FRZ-2026-X"
                  className="w-full bg-slate-950/80 border border-sky-500/15 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-sky-500/40"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Customer / Account</label>
                <input
                  type="text"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  placeholder="e.g., Apollo Research Chennai"
                  className="w-full bg-slate-950/80 border border-sky-500/15 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-sky-500/40"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Equipment Model</label>
                <input
                  type="text"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  placeholder="e.g., Cryo Storage Model-B"
                  className="w-full bg-slate-950/80 border border-sky-500/15 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-sky-500/40"
                />
              </div>
              <button
                onClick={handleRegister}
                className="w-full mt-4 bg-sky-500 hover:bg-sky-400 text-white font-bold uppercase tracking-wider text-xs py-3 rounded-lg transition-colors cursor-pointer"
              >
                Initialize Hardware Registration
              </button>
            </div>
          </div>
        )}

        {activeTab === 'List' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {freezers.map((freezer) => (
              <div key={freezer.id} className="rounded-xl border border-sky-500/10 bg-slate-900/60 p-6 shadow-md">
                <span className="text-[10px] uppercase text-sky-400 font-bold">{freezer.model}</span>
                <h4 className="text-lg font-bold text-white mt-1">{freezer.id}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{freezer.customerName}</p>
                <div className="mt-6 flex items-center justify-between border-t border-sky-500/5 pt-4">
                  <span className="text-[10px] uppercase text-slate-500">Status</span>
                  <span className={`text-xs font-bold ${freezer.status === 'Normal' ? 'text-emerald-400' : freezer.status === 'Warning' ? 'text-amber-400' : 'text-rose-400'}`}>{freezer.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'CSV' && (
          <div className="max-w-2xl space-y-6">
            <div className="rounded-xl border border-sky-500/10 bg-slate-900/60 p-6 shadow-md backdrop-blur-md">
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                Select target freezer unit
              </label>
              <select
                value={selectedUploadFreezerId}
                onChange={(e) => setSelectedUploadFreezerId(e.target.value)}
                className="w-full bg-slate-950 border border-sky-500/15 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500/40"
              >
                {freezers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.id} — {f.customerName} ({f.model})
                  </option>
                ))}
              </select>
            </div>
            <CSVUploader freezerId={selectedUploadFreezerId || 'FRZ-001'} onUploadSuccess={fetchFreezersList} />
          </div>
        )}

        {activeTab === 'Reports' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-sky-500/10 bg-slate-900/60 p-8 shadow-md">
              <h3 className="font-bold text-white mb-2">Historical Audit Reports</h3>
              <p className="text-slate-400 text-xs mb-6">Select a unit to generate a compliant PDF trace report or download raw CSV log data.</p>
              <div className="space-y-4">
                <select
                  value={selectedReportFreezerId}
                  onChange={(e) => {
                    setSelectedReportFreezerId(e.target.value);
                    setCompiledReport(null);
                  }}
                  className="w-full bg-slate-950 border border-sky-500/15 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none"
                >
                  {freezers.map(f => (
                    <option key={f.id} value={f.id}>{f.id} — {f.customerName} ({f.model})</option>
                  ))}
                </select>
                <button
                  onClick={handleCompileReport}
                  disabled={reportLoading}
                  className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-sky-800 text-white font-bold uppercase tracking-wider text-xs py-3 rounded-lg transition-colors cursor-pointer"
                >
                  {reportLoading ? 'Analyzing Telemetry...' : 'Compile Report Data'}
                </button>
              </div>
            </div>

            {compiledReport && (
              <div className="rounded-xl border border-sky-500/10 bg-slate-900/60 p-6 md:p-8 shadow-md space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-sky-500/5 pb-4 gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-white uppercase tracking-wide">Compiled Report Details</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Unit {compiledReport.freezer?.id} — {compiledReport.freezer?.customerName}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadPDF}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      Download PDF
                    </button>
                    <button
                      onClick={handleDownloadCSV}
                      className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      Download CSV
                    </button>
                  </div>
                </div>

                {/* Metrics Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-sky-500/5 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Min Temp</p>
                    <p className="text-xl font-bold text-sky-400 mt-1">{compiledReport.min.toFixed(2)}°C</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-sky-500/5 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Max Temp</p>
                    <p className="text-xl font-bold text-rose-400 mt-1">{compiledReport.max.toFixed(2)}°C</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-sky-500/5 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Average Temp</p>
                    <p className="text-xl font-bold text-sky-400 mt-1">{compiledReport.avg.toFixed(2)}°C</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-sky-500/5 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Compliance Rate</p>
                    <p className={`text-xl font-bold mt-1 ${compiledReport.compliance > 98 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {compiledReport.compliance.toFixed(2)}%
                    </p>
                  </div>
                </div>

                {/* Limit Thresholds */}
                <div className="flex justify-between items-center text-xs bg-slate-950/20 px-4 py-3 rounded-lg border border-sky-500/5">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider">Target Thresholds:</span>
                  <span className="font-mono text-sky-400">{compiledReport.minConfig.toFixed(1)}°C to {compiledReport.maxConfig.toFixed(1)}°C</span>
                </div>

                {/* Alarm Events Table */}
                <div className="space-y-3">
                  <h5 className="font-bold text-sm text-slate-200 uppercase tracking-wide">Critical Excursions Summary ({compiledReport.alarms.length})</h5>
                  {compiledReport.alarms.length === 0 ? (
                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-400 text-center">
                      No critical temperature excursions recorded. Unit is 100% compliant.
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-sky-500/5 bg-slate-950/40 max-h-[200px] overflow-y-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-sky-500/5 bg-slate-950/60 uppercase text-[10px] text-slate-400 tracking-wider">
                            <th className="px-4 py-2 font-semibold">Severity</th>
                            <th className="px-4 py-2 font-semibold">Temperature</th>
                            <th className="px-4 py-2 font-semibold">Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-sky-500/5 text-slate-300">
                          {compiledReport.alarms.map((a: any, index: number) => (
                            <tr key={index} className="hover:bg-slate-900/40">
                              <td className="px-4 py-2">
                                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${a.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                  {a.severity}
                                </span>
                              </td>
                              <td className="px-4 py-2 font-semibold text-slate-200">{a.temperature}°C</td>
                              <td className="px-4 py-2 text-slate-400">{a.timestamp}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}


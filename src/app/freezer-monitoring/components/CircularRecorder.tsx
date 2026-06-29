'use client';

import React, { useRef, useEffect } from 'react';

interface CircularRecorderProps {
  freezerId: string;
  minConfig: number;
  maxConfig: number;
  readings: { timestamp: string; temperature: number }[];
  alarms?: { timestamp: string; temperature: number; severity: 'Warning' | 'Critical' }[];
}

export default function CircularRecorder({
  freezerId,
  minConfig,
  maxConfig,
  readings,
  alarms = [],
}: CircularRecorderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    ctx.clearRect(0, 0, W, H);

    // 1. Draw Cream paper background
    ctx.fillStyle = '#fdfbf7';
    ctx.beginPath();
    ctx.arc(cx, cy, 460, 0, Math.PI * 2);
    ctx.fill();

    // Draw outer rim edge
    ctx.strokeStyle = '#dfdacb';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Radius range config
    const RMIN = 120;
    const RMAX = 410;

    // Temperature mapping setup
    // Physical scale goes from -10 to +40 (Outer radius is -10, Inner is +40)
    const TEMP_MIN = -10;
    const TEMP_MAX = 40;

    const tempToR = (t: number) => {
      const ratio = (t - TEMP_MIN) / (TEMP_MAX - TEMP_MIN);
      const rRatio = Math.max(0, Math.min(1, ratio));
      // Inverse: center is TEMP_MAX, edge is TEMP_MIN
      return RMAX - rRatio * (RMAX - RMIN);
    };

    // Draw the safe range band shading
    const safeRMax = tempToR(minConfig);
    const safeRMin = tempToR(maxConfig);

    ctx.fillStyle = 'rgba(72, 169, 123, 0.12)';
    ctx.beginPath();
    ctx.arc(cx, cy, safeRMax, 0, Math.PI * 2);
    ctx.arc(cx, cy, safeRMin, 0, Math.PI * 2, true);
    ctx.fill();

    // Concentric temperature grid lines
    for (let t = TEMP_MIN; t <= TEMP_MAX; t += 2) {
      const r = tempToR(t);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);

      if (t === minConfig || t === maxConfig) {
        ctx.strokeStyle = 'rgba(72, 169, 123, 0.6)';
        ctx.lineWidth = 2.0;
      } else if (t % 10 === 0) {
        ctx.strokeStyle = 'rgba(212, 163, 115, 0.45)';
        ctx.lineWidth = 1.0;
      } else {
        ctx.strokeStyle = 'rgba(212, 163, 115, 0.18)';
        ctx.lineWidth = 0.5;
      }
      ctx.stroke();

      // Concentration labels
      if (t % 10 === 0) {
        ctx.font = '500 11px Inter, sans-serif';
        ctx.fillStyle = 'rgba(124, 117, 110, 0.8)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${t}°`, cx, cy - r);
        ctx.fillText(`${t}°`, cx + r, cy);
      }
    }

    // Curved Pen Path Grid (Law of Cosines pivot geometry)
    const pivotDist = 480;
    const armLength = 430;

    const getPhi = (r: number) => {
      const val = (pivotDist * pivotDist + r * r - armLength * armLength) / (2 * pivotDist * r);
      return Math.acos(Math.max(-1, Math.min(1, val)));
    };

    const phiRMax = getPhi(RMAX);
    const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

    // Draw curved radial time lines (168 hours = 7 days)
    for (let i = 0; i < 168; i++) {
      const targetAngle = (i / 168) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();

      let first = true;
      for (let r = RMAX; r >= RMIN; r -= 10) {
        const phi = getPhi(r);
        const arcAngle = targetAngle + (phi - phiRMax);
        const px = cx + r * Math.cos(arcAngle);
        const py = cy + r * Math.sin(arcAngle);

        if (first) {
          ctx.moveTo(px, py);
          first = false;
        } else {
          ctx.lineTo(px, py);
        }
      }

      const isDayBoundary = i % 24 === 0;
      const isSixHourMark = i % 6 === 0;

      if (isDayBoundary) {
        ctx.strokeStyle = 'rgba(180, 160, 140, 0.6)';
        ctx.lineWidth = 1.2;
      } else if (isSixHourMark) {
        ctx.strokeStyle = 'rgba(180, 160, 140, 0.35)';
        ctx.lineWidth = 0.8;
      } else {
        ctx.strokeStyle = 'rgba(212, 163, 115, 0.12)';
        ctx.lineWidth = 0.4;
      }
      ctx.stroke();

      // Day names on outer ring
      if (isDayBoundary) {
        const dayIdx = (i / 24) % 7;
        const dayText = DAYS[dayIdx];
        const labelAngle = targetAngle + (12 / 168) * Math.PI * 2;
        const lr = RMAX + 30;
        const lx = cx + lr * Math.cos(labelAngle);
        const ly = cy + lr * Math.sin(labelAngle);

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(labelAngle + Math.PI / 2);
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillStyle = '#7c756e';
        ctx.textAlign = 'center';
        ctx.fillText(dayText, 0, 0);
        ctx.restore();
      }

      // Hour numbers
      if (isSixHourMark) {
        const hrVal = i % 24;
        const labelAngle = targetAngle;
        const lr = RMAX + 12;
        const lx = cx + lr * Math.cos(labelAngle);
        const ly = cy + lr * Math.sin(labelAngle);

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(labelAngle + Math.PI / 2);
        ctx.font = '500 8px Inter, sans-serif';
        ctx.fillStyle = '#9e968f';
        ctx.textAlign = 'center';
        ctx.fillText(hrVal === 0 ? '24/0' : String(hrVal), 0, 0);
        ctx.restore();
      }
    }

    // 2. Plot Temperature Trace
    if (readings.length > 0) {
      const totalPoints = readings.length;
      for (let i = 1; i < totalPoints; i++) {
        const prev = readings[i - 1];
        const curr = readings[i];

        const prevRatio = (i - 1) / totalPoints;
        const currRatio = i / totalPoints;

        const prevTargetAngle = prevRatio * Math.PI * 2 - Math.PI / 2;
        const currTargetAngle = currRatio * Math.PI * 2 - Math.PI / 2;

        const prevR = tempToR(prev.temperature);
        const currR = tempToR(curr.temperature);

        const prevPhi = getPhi(prevR);
        const currPhi = getPhi(currR);

        const prevAngle = prevTargetAngle + (prevPhi - phiRMax);
        const currAngle = currTargetAngle + (currPhi - phiRMax);

        const x0 = cx + prevR * Math.cos(prevAngle);
        const y0 = cy + prevR * Math.sin(prevAngle);
        const x1 = cx + currR * Math.cos(currAngle);
        const y1 = cy + currR * Math.sin(currAngle);

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);

        const tVal = curr.temperature;
        if (tVal > maxConfig + 1.5 || tVal < minConfig - 1.5) {
          ctx.strokeStyle = '#f43f5e'; // rose-500
          ctx.lineWidth = 2.5;
        } else if (tVal > maxConfig || tVal < minConfig) {
          ctx.strokeStyle = '#f59e0b'; // amber-500
          ctx.lineWidth = 2.0;
        } else {
          ctx.strokeStyle = '#10b981'; // emerald-500
          ctx.lineWidth = 1.8;
        }
        ctx.stroke();
      }

      // Draw alarm markers on the trace
      alarms.forEach((alm) => {
        const timestampTime = new Date(alm.timestamp).getTime();
        const matchIdx = readings.findIndex((r) => new Date(r.timestamp).getTime() === timestampTime);
        if (matchIdx !== -1) {
          const ratio = matchIdx / totalPoints;
          const targetAngle = ratio * Math.PI * 2 - Math.PI / 2;
          const r = tempToR(alm.temperature);
          const phi = getPhi(r);
          const finalAngle = targetAngle + (phi - phiRMax);

          const ax = cx + r * Math.cos(finalAngle);
          const ay = cy + r * Math.sin(finalAngle);

          ctx.beginPath();
          ctx.arc(ax, ay, 5, 0, Math.PI * 2);
          ctx.fillStyle = alm.severity === 'Critical' ? '#f43f5e' : '#f59e0b';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });
    }

    // 3. Draw Center Hub
    ctx.fillStyle = '#eae5dc';
    ctx.beginPath();
    ctx.arc(cx, cy, 65, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c5bea7';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner Cutout
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hub pin
    ctx.fillStyle = '#3c3a37';
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();

    // Hub text
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillStyle = '#2d2b2a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(freezerId, cx, cy - 22);

    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.fillStyle = '#7c756e';
    ctx.fillText('7-DAY RECORD', cx, cy + 22);
  }, [freezerId, minConfig, maxConfig, readings, alarms]);

  return (
    <div className="rounded-2xl border border-sky-500/10 bg-slate-900/40 p-6 flex flex-col items-center justify-center shadow-lg backdrop-blur-md">
      <div className="w-full flex items-center justify-between mb-4 border-b border-sky-500/5 pb-3">
        <h4 className="font-bold text-white tracking-wide uppercase text-xs">7-Day Circular Chart Recorder</h4>
        <span className="text-[9px] text-sky-400 font-semibold tracking-wider bg-sky-500/10 px-2 py-0.5 rounded uppercase">Hardware Simulation</span>
      </div>

      <div className="relative p-4 bg-white rounded-xl shadow-inner border border-slate-200">
        <canvas
          ref={canvasRef}
          width={1000}
          height={1000}
          className="w-full max-w-[420px] h-auto aspect-square block"
        />
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
        <div className="flex items-center gap-2">
          <span className="h-1 w-4 bg-emerald-500 rounded" />
          <span>Normal Trace</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1 w-4 bg-amber-500 rounded" />
          <span>Warning Trace</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1 w-4 bg-rose-500 rounded" />
          <span>Critical Trace</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 border border-emerald-500 bg-emerald-500/10 rounded" />
          <span>Safe Range (2°C - 8°C)</span>
        </div>
      </div>
    </div>
  );
}

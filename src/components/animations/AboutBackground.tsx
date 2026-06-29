'use client';

import React, { useEffect, useRef } from 'react';

export default function AboutBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollRef = useRef({ current: 0, target: 0 });
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false }); // Disable alpha channel for faster rendering
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    // Particle flow inside the 3D funnel
    interface Particle3D {
      theta: number; // Angle around funnel
      y3d: number;   // Height position in funnel
      speed: number;
      radiusOffset: number;
      color: string;
      glowColor: string;
      size: number;
    }

    const particles: Particle3D[] = [];
    const particleCount = 80; // Optimized count for desktop performance

    const initElements = () => {
      particles.length = 0;
      const colors = [
        { c: '#ffffff', g: 'rgba(0, 240, 255, 0.3)' }, // White core, cyan glow
        { c: '#00f0ff', g: 'rgba(0, 240, 255, 0.25)' }, // Cyan
        { c: '#38bdf8', g: 'rgba(0, 114, 255, 0.2)' },  // Sky blue
        { c: '#0ea5e9', g: 'rgba(0, 114, 255, 0.15)' }  // Deep sky blue
      ];

      for (let i = 0; i < particleCount; i++) {
        const colorSet = colors[Math.floor(Math.random() * colors.length)];
        particles.push({
          theta: Math.random() * Math.PI * 2,
          y3d: (Math.random() * 500) - 250,
          speed: 1.5 + Math.random() * 2.0,
          radiusOffset: 0.85 + Math.random() * 0.3,
          color: colorSet.c,
          glowColor: colorSet.g,
          size: 1.2 + Math.random() * 2.0,
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1); // Clamp DPR at 2 for performance on Retina screens
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initElements();
    };

    const updateAndDraw = () => {
      scrollRef.current.current += (scrollRef.current.target - scrollRef.current.current) * 0.08;
      const scrollVal = scrollRef.current.current;

      const centerX = width * 0.5;
      const centerY = height * 0.45;

      // 1. Draw premium blue radial gradient background (as requested)
      const bgGrad = ctx.createRadialGradient(
        centerX, centerY, 50,
        centerX, centerY, Math.max(width, height) * 0.75
      );
      bgGrad.addColorStop(0, '#0a1d40');   // Rich dark blue/cyan core
      bgGrad.addColorStop(0.5, '#040d21'); // Deep navy intermediate
      bgGrad.addColorStop(1, '#020510');   // Space blue edges
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const time = Date.now() * 0.0008;

      // Funnel Geometry
      const maxRadius = Math.min(width, height) * 0.45;
      const throatRadius = maxRadius * 0.15;
      
      const cameraDistance = 500;
      const baseTilt = 0.55;
      const scrollTilt = scrollVal * 0.0006;
      const tilt = Math.min(1.4, Math.max(0.2, baseTilt + scrollTilt));
      const spinSpeed = time * 0.3 + scrollVal * 0.001;
      const twist = 0.004;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // 3D Projection Helper
      const project = (x3d: number, y3d: number, z3d: number) => {
        const cosY = Math.cos(spinSpeed);
        const sinY = Math.sin(spinSpeed);
        const rx = x3d * cosY - z3d * sinY;
        const rz = x3d * sinY + z3d * cosY;
        const ry = y3d;

        const cosX = Math.cos(tilt);
        const sinX = Math.sin(tilt);
        const finalY = ry * cosX - rz * sinX;
        const finalZ = ry * sinX + rz * cosX;
        const finalX = rx;

        const scale = cameraDistance / (cameraDistance + finalZ + 200);
        return {
          x: centerX + finalX * scale,
          y: centerY + finalY * scale,
          visible: finalZ + 200 > -cameraDistance,
          scale
        };
      };

      // 2. Draw central glowing singularity (soft radial glow at the throat center instead of a solid vertical pillar)
      const throatGlow = ctx.createRadialGradient(
        centerX, centerY, 2,
        centerX, centerY, throatRadius * 1.8
      );
      throatGlow.addColorStop(0, 'rgba(255, 255, 255, 0.7)'); // Bright singularity center
      throatGlow.addColorStop(0.3, 'rgba(0, 240, 255, 0.35)');
      throatGlow.addColorStop(1, 'rgba(0, 114, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, throatRadius * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = throatGlow;
      ctx.fill();

      // 3. Render Funnel Latitudinal Rings (Optimized ring count & segments)
      const ringCount = 14;  // Reduced from 20 for performance
      const segments = 30;   // Reduced from 45 for performance

      for (let r = 0; r < ringCount; r++) {
        const y3d = -250 + (r / (ringCount - 1)) * 500;
        const rFactor = Math.pow(Math.abs(y3d) / 250, 2);
        const ringRadius = throatRadius + (maxRadius - throatRadius) * rFactor;

        // Collect projected points for drawing
        const points = [];
        for (let s = 0; s <= segments; s++) {
          const theta = (s / segments) * Math.PI * 2;
          const currentTheta = theta + y3d * twist;
          const x3d = ringRadius * Math.cos(currentTheta);
          const z3d = ringRadius * Math.sin(currentTheta);
          points.push(project(x3d, y3d, z3d));
        }

        // Draw double-stroke glow for rings (extremely lightweight compared to shadowBlur)
        const density = 1 - Math.abs(y3d) / 250;
        
        // Stroke 1: Outer glow stroke
        ctx.beginPath();
        points.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.closePath();
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.06 + density * 0.12})`;
        ctx.lineWidth = 4.0;
        ctx.stroke();

        // Stroke 2: Sharp inner stroke
        ctx.beginPath();
        points.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.closePath();
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.25 + density * 0.45})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }

      // 4. Draw Longitudinal Grid Lines (Meridians - Optimized count)
      const meridianCount = 12; // Reduced from 18 for performance
      for (let m = 0; m < meridianCount; m++) {
        const theta = (m / meridianCount) * Math.PI * 2;
        
        ctx.beginPath();
        for (let r = 0; r < ringCount; r++) {
          const y3d = -250 + (r / (ringCount - 1)) * 500;
          const rFactor = Math.pow(Math.abs(y3d) / 250, 2);
          const ringRadius = throatRadius + (maxRadius - throatRadius) * rFactor;
          const currentTheta = theta + y3d * twist;
          
          const x3d = ringRadius * Math.cos(currentTheta);
          const z3d = ringRadius * Math.sin(currentTheta);
          
          const pt = project(x3d, y3d, z3d);
          if (r === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = 'rgba(0, 114, 255, 0.18)';
        ctx.lineWidth = 0.85;
        ctx.stroke();
      }

      // 5. Draw Flow Particles (Double stroke simulation for glows)
      particles.forEach((p) => {
        const flowSpeedMultiplier = 1 + (scrollVal * 0.003);
        p.y3d += p.speed * flowSpeedMultiplier;

        if (p.y3d > 250) {
          p.y3d = -250;
          p.theta = Math.random() * Math.PI * 2;
        }

        const densityFactor = 1 - Math.abs(p.y3d) / 250;
        p.theta += 0.015 * (1 + densityFactor * 4);

        const rFactor = Math.pow(Math.abs(p.y3d) / 250, 2);
        const currentRadius = (throatRadius + (maxRadius - throatRadius) * rFactor) * p.radiusOffset;

        const x3d = currentRadius * Math.cos(p.theta + p.y3d * twist);
        const z3d = currentRadius * Math.sin(p.theta + p.y3d * twist);

        const pt = project(x3d, p.y3d, z3d);
        if (pt.visible) {
          const size = p.size * pt.scale;
          const alpha = 0.35 + densityFactor * 0.55;

          // Draw outer glow dot
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p.glowColor;
          ctx.globalAlpha = alpha * 0.4;
          ctx.fill();

          // Draw sharp center dot
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.fill();
        }
      });

      ctx.restore();

      animationId = requestAnimationFrame(updateAndDraw);
    };

    const handleScroll = () => {
      scrollRef.current.target = window.scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    resize();
    updateAndDraw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-auto" />
    </div>
  );
}

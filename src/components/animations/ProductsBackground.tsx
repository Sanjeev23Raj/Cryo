'use client';

import React, { useEffect, useRef } from 'react';

export default function ProductsBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollRef = useRef({ current: 0, target: 0 });
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use alpha: false for performance gains
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    // 3D Node structure representing a molecular/crystal lattice
    interface CrystalNode {
      x: number;
      y: number;
      z: number;
      baseX: number;
      baseY: number;
      baseZ: number;
      vx: number;
      vy: number;
      vz: number;
      color: string;
      glowColor: string;
      size: number;
      pulseSpeed: number;
      pulseOffset: number;
    }

    // Drifting frost/ice crystals
    interface IceCrystal {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      angle: number;
      spinSpeed: number;
      opacity: number;
      pulseOffset: number;
    }

    const nodes: CrystalNode[] = [];
    const iceCrystals: IceCrystal[] = [];
    const maxNodes = 60;
    const maxDistance3D = 140;
    const maxIceCrystals = 25;

    const initLattice = () => {
      nodes.length = 0;
      const colors = [
        { c: '#ffffff', g: 'rgba(255, 255, 255, 0.45)' }, // Crisp white
        { c: '#00f0ff', g: 'rgba(0, 240, 255, 0.4)' },   // Neon cyan
        { c: '#38bdf8', g: 'rgba(56, 189, 248, 0.3)' },   // Sky blue
        { c: '#a855f7', g: 'rgba(168, 85, 247, 0.25)' }   // Frost purple
      ];

      for (let i = 0; i < maxNodes; i++) {
        // Distribute nodes in a 3D volume box
        const x = (Math.random() - 0.5) * 700;
        const y = (Math.random() - 0.5) * 600;
        const z = (Math.random() - 0.5) * 500;
        const colorSet = colors[Math.floor(Math.random() * colors.length)];

        nodes.push({
          x, y, z,
          baseX: x,
          baseY: y,
          baseZ: z,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          vz: (Math.random() - 0.5) * 0.35,
          color: colorSet.c,
          glowColor: colorSet.g,
          size: 1.2 + Math.random() * 2.2,
          pulseSpeed: 0.015 + Math.random() * 0.02,
          pulseOffset: Math.random() * Math.PI * 2
        });
      }

      // Initialize ice crystals
      iceCrystals.length = 0;
      for (let i = 0; i < maxIceCrystals; i++) {
        iceCrystals.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 3 + Math.random() * 6,
          speedY: 0.15 + Math.random() * 0.3,
          speedX: (Math.random() - 0.5) * 0.2,
          angle: Math.random() * Math.PI * 2,
          spinSpeed: (Math.random() - 0.5) * 0.01,
          opacity: 0.1 + Math.random() * 0.3,
          pulseOffset: Math.random() * Math.PI
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initLattice();
    };

    const drawHexagon = (x: number, y: number, size: number, angle: number, opacity: number) => {
      ctx.save();
      ctx.strokeStyle = `rgba(200, 243, 255, ${opacity})`;
      ctx.lineWidth = 0.75;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = angle + (i * Math.PI) / 3;
        const hx = x + Math.cos(a) * size;
        const hy = y + Math.sin(a) * size;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();

      // Inner details
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const a1 = angle + (i * Math.PI) / 3;
        const a2 = a1 + Math.PI;
        ctx.moveTo(x + Math.cos(a1) * size * 0.4, y + Math.sin(a1) * size * 0.4);
        ctx.lineTo(x + Math.cos(a2) * size * 0.4, y + Math.sin(a2) * size * 0.4);
      }
      ctx.stroke();
      ctx.restore();
    };

    const updateAndDraw = () => {
      // Smooth scroll updates
      scrollRef.current.current += (scrollRef.current.target - scrollRef.current.current) * 0.08;
      const scrollVal = scrollRef.current.current;

      const centerX = width * 0.5;
      const centerY = height * 0.45;
      const time = Date.now() * 0.0003;

      // 1. Draw premium dark gradient background with moving light sources
      ctx.fillStyle = '#02040a';
      ctx.fillRect(0, 0, width, height);

      // Dynamic glowing aura 1 (Cyan)
      const gX1 = centerX + Math.sin(time) * (width * 0.25);
      const gY1 = centerY + Math.cos(time * 0.8) * (height * 0.2);
      const grad1 = ctx.createRadialGradient(gX1, gY1, 10, gX1, gY1, Math.max(width, height) * 0.7);
      grad1.addColorStop(0, 'rgba(6, 45, 84, 0.8)');
      grad1.addColorStop(0.5, 'rgba(3, 15, 36, 0.4)');
      grad1.addColorStop(1, 'rgba(2, 4, 10, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Dynamic glowing aura 2 (Violet / Royal Blue)
      const gX2 = centerX - Math.cos(time * 1.1) * (width * 0.25);
      const gY2 = centerY - Math.sin(time * 0.7) * (height * 0.2);
      const grad2 = ctx.createRadialGradient(gX2, gY2, 10, gX2, gY2, Math.max(width, height) * 0.65);
      grad2.addColorStop(0, 'rgba(40, 16, 75, 0.55)');
      grad2.addColorStop(0.5, 'rgba(8, 12, 32, 0.35)');
      grad2.addColorStop(1, 'rgba(2, 4, 10, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Ambient top light highlight
      const gradTop = ctx.createLinearGradient(0, 0, 0, 250);
      gradTop.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
      gradTop.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = gradTop;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw curling organic cryogenic vapor waves (flows of liquid nitrogen steam)
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const vaporCount = 3;
      const colorsVapor = [
        'rgba(56, 189, 248, 0.045)', // Cyan
        'rgba(168, 85, 247, 0.035)', // Purple
        'rgba(255, 255, 255, 0.025)'  // White
      ];

      for (let w = 0; w < vaporCount; w++) {
        ctx.beginPath();
        const baseHeight = height * (0.3 + w * 0.15);
        const amplitude = 30 + w * 15;
        const frequency = 0.0025 + w * 0.001;
        const waveSpeed = 0.4 + w * 0.25;

        for (let x = 0; x <= width + 40; x += 40) {
          const yOffset = Math.sin(x * frequency + time * waveSpeed + w) * amplitude +
                          Math.cos(x * 0.008 - time * 0.5 + w) * (amplitude * 0.4);
          
          const finalY = baseHeight + yOffset + (scrollVal * 0.15);
          if (x === 0) {
            ctx.moveTo(x, finalY);
          } else {
            ctx.lineTo(x, finalY);
          }
        }
        ctx.strokeStyle = colorsVapor[w];
        ctx.lineWidth = 25 + w * 15;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }
      ctx.restore();

      // 3. Draw drifting ice crystals
      iceCrystals.forEach((c) => {
        c.y -= c.speedY;
        c.x += c.speedX + Math.sin(time + c.pulseOffset) * 0.05;
        c.angle += c.spinSpeed;

        // Reset if offscreen
        if (c.y < -30) {
          c.y = height + 30;
          c.x = Math.random() * width;
        }
        if (c.x < -30 || c.x > width + 30) {
          c.x = Math.random() * width;
        }

        const opacity = c.opacity * (0.6 + Math.sin(time * 3 + c.pulseOffset) * 0.4);
        drawHexagon(c.x, c.y, c.size, c.angle, opacity);
      });

      // 4. Update and Draw 3D Crystal lattice
      // Camera settings & dynamic rotation based on scroll and mouse
      const mouseXRatio = mouseRef.current.active ? (mouseRef.current.x / width - 0.5) : 0;
      const mouseYRatio = mouseRef.current.active ? (mouseRef.current.y / height - 0.5) : 0;

      const angleX = 0.35 + scrollVal * 0.00035 + mouseYRatio * 0.25;
      const angleY = time * 0.15 + mouseXRatio * 0.25;
      
      const cameraDistance = 650;

      // 3D Projection math
      const project = (node: CrystalNode) => {
        // Rotate around Y-axis
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        let rx = node.x * cosY - node.z * sinY;
        let rz = node.x * sinY + node.z * cosY;
        let ry = node.y;

        // Rotate around X-axis
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const finalY = ry * cosX - rz * sinX;
        const finalZ = ry * sinX + rz * cosX;
        const finalX = rx;

        // Perspective scaling
        const scale = cameraDistance / (cameraDistance + finalZ + 250);
        return {
          x: centerX + finalX * scale,
          y: centerY + finalY * scale,
          visible: finalZ + 250 > -cameraDistance,
          scale,
          zDepth: finalZ
        };
      };

      // Project all nodes
      const projected = nodes.map(node => ({
        node,
        proj: project(node)
      }));

      // Update positions & draw lines
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const projectedCount = projected.length;
      for (let i = 0; i < projectedCount; i++) {
        const itemA = projected[i];
        
        // Idle floating movement
        itemA.node.x += itemA.node.vx;
        itemA.node.y += itemA.node.vy;
        itemA.node.z += itemA.node.vz;

        // Boundary bounce (keep within 3D bounding box)
        if (Math.abs(itemA.node.x) > 350) itemA.node.vx *= -1;
        if (Math.abs(itemA.node.y) > 300) itemA.node.vy *= -1;
        if (Math.abs(itemA.node.z) > 250) itemA.node.vz *= -1;

        // Interactive mouse gravity deflection in 3D
        if (mouseRef.current.active) {
          // Project mouse position to approximate 3D space coordinates
          const dx = (mouseRef.current.x - centerX) - itemA.node.x;
          const dy = (mouseRef.current.y - centerY) - itemA.node.y;
          const dist2D = Math.sqrt(dx * dx + dy * dy);
          if (dist2D < 180) {
            const pullFactor = (180 - dist2D) * 0.0003;
            itemA.node.x += dx * pullFactor;
            itemA.node.y += dy * pullFactor;
          }
        }

        // Connect with neighboring nodes in 3D
        for (let j = i + 1; j < projectedCount; j++) {
          const itemB = projected[j];
          
          const dx = itemA.node.x - itemB.node.x;
          const dy = itemA.node.y - itemB.node.y;
          const dz = itemA.node.z - itemB.node.z;
          const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist3D < maxDistance3D) {
            const alpha = (1 - dist3D / maxDistance3D) * 0.22;
            ctx.beginPath();
            ctx.moveTo(itemA.proj.x, itemA.proj.y);
            ctx.lineTo(itemB.proj.x, itemB.proj.y);

            // Line gradient based on node positions
            const lineGrad = ctx.createLinearGradient(
              itemA.proj.x, itemA.proj.y,
              itemB.proj.x, itemB.proj.y
            );
            lineGrad.addColorStop(0, `rgba(56, 189, 248, ${alpha})`);
            lineGrad.addColorStop(0.5, `rgba(168, 85, 247, ${alpha * 0.6})`);
            lineGrad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.25})`);

            ctx.strokeStyle = lineGrad;
            ctx.lineWidth = 0.5 * ((itemA.proj.scale + itemB.proj.scale) * 0.5);
            ctx.stroke();
          }
        }
      }

      // Draw projected node points (sorted by depth to render back-to-front correctly)
      projected.sort((a, b) => b.proj.zDepth - a.proj.zDepth);

      projected.forEach(({ node, proj }) => {
        if (proj.visible) {
          const pulse = Math.sin(Date.now() * node.pulseSpeed + node.pulseOffset) * 0.25 + 0.88;
          const size = node.size * proj.scale * pulse;
          
          // Draw soft radial glow behind node
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, size * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = node.glowColor;
          ctx.globalAlpha = 0.3 * proj.scale;
          ctx.fill();

          // Draw main node core
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.globalAlpha = 0.9 * proj.scale;
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

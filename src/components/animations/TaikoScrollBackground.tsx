'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ScienceObjectProps {
  scrollYRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}

function ScienceObject3D({ scrollYRef, mouseRef }: ScienceObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ufoRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scrollY = scrollYRef.current;
    
    // Breathing/floating oscillation
    const floatOffset = Math.sin(time * 1.2) * 0.12;
    const breathe = 1.0 + Math.sin(time * 1.8) * 0.03;

    // Mouse interactive target rotations
    const targetRotX = mouseRef.current.y * 0.35;
    const targetRotY = mouseRef.current.x * 0.35;

    // Virtual Camera Fly-Through / Travel Effect (scroll 950 - 1400)
    let cameraTravelZ = 0;
    let cameraTravelX = 0;
    let cameraTravelY = 0;

    if (scrollY > 950 && scrollY < 1400) {
      const travelFactor = (scrollY - 950) / 450;
      cameraTravelZ = travelFactor * 8.0;
      cameraTravelX = Math.sin(travelFactor * Math.PI) * 1.5;
      cameraTravelY = -travelFactor * 2.0;
    } else if (scrollY >= 1400) {
      cameraTravelZ = 8.0;
      cameraTravelX = 0;
      cameraTravelY = -2.0;
    }

    // Scroll depth and position shifts
    const targetZ = -scrollY * 0.0035 + cameraTravelZ; 
    const targetY = -scrollY * 0.0018 + floatOffset + cameraTravelY;
    const targetX = cameraTravelX;

    if (groupRef.current) {
      groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.06;
      groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.06;
      groupRef.current.rotation.y += 0.004; // slow passive spin

      groupRef.current.position.z += (targetZ - groupRef.current.position.z) * 0.08;
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.08;
      groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.08;

      const fadeFactor = Math.max(0.0, 1.0 - (scrollY - 300) * 0.0012);
      const activeScale = breathe * (scrollY > 300 ? fadeFactor : 1.0);
      groupRef.current.scale.setScalar(activeScale * 0.95);
    }

    // UFO orbit animation
    if (ufoRef.current) {
      const ufoTime = time * 0.8;
      ufoRef.current.position.x = Math.sin(ufoTime) * 2.0;
      ufoRef.current.position.z = Math.cos(ufoTime) * 2.0;
      ufoRef.current.position.y = Math.sin(ufoTime * 2.0) * 0.45;
      ufoRef.current.rotation.y = ufoTime + Math.PI / 2;
      ufoRef.current.rotation.z = Math.sin(ufoTime * 2.0) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Holographic Planet */}
      <group>
        <mesh>
          <sphereGeometry args={[0.78, 32, 32]} />
          <meshStandardMaterial 
            color="#05152b"
            roughness={0.7}
            metalness={0.8}
            emissive="#0033aa"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.79, 16, 16]} />
          <meshBasicMaterial 
            color="#00f0ff"
            wireframe={true}
            transparent={true}
            opacity={0.2}
          />
        </mesh>
      </group>

      {/* 3D Orbit Planet-style Flat Rings - concentric rings */}
      <mesh rotation={[Math.PI / 2.2, Math.PI / 6, 0]}>
        <ringGeometry args={[1.2, 1.8, 64]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
      
      <mesh rotation={[Math.PI / 2.2, Math.PI / 6, 0]}>
        <ringGeometry args={[1.85, 1.9, 64]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.30} side={THREE.DoubleSide} />
      </mesh>

      <mesh rotation={[Math.PI / 2.2, Math.PI / 6, 0]}>
        <ringGeometry args={[2.0, 2.3, 64]} />
        <meshBasicMaterial color="#0066ff" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      {/* Orbiting Saucer UFO */}
      <group ref={ufoRef}>
        {/* saucer base disc */}
        <mesh scale={[1, 0.2, 1]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#0e3a5f" roughness={0.3} metalness={0.9} emissive="#0ea5e9" emissiveIntensity={0.3} />
        </mesh>
        {/* saucer dome */}
        <mesh position={[0, 0.04, 0]}>
          <sphereGeometry args={[0.10, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#00f0ff" transparent opacity={0.7} roughness={0.1} />
        </mesh>
        {/* bottom neon glowing thruster ring */}
        <mesh position={[0, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.08, 0.02, 8, 16]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      </group>
    </group>
  );
}

export default function TaikoScrollBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollRef = useRef({ current: 0, target: 0 });
  const scrollYRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [bgStyle, setBgStyle] = useState({
    backgroundColor: '#030712' // Deep dark background initially for shader integration
  });

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      scrollRef.current.target = scrollY;
      scrollYRef.current = scrollY;

      // Evolve background wrapper base color under the fading WebGL shader
      if (scrollY <= 300) {
        setBgStyle({ backgroundColor: '#030712' }); // Dark slate
      } else if (scrollY > 300 && scrollY <= 950) {
        const f = (scrollY - 300) / 650;
        const r = Math.round(3 + (224 - 3) * f); 
        const g = Math.round(7 + (242 - 7) * f); 
        const b = Math.round(18 + (254 - 18) * f);  
        setBgStyle({ backgroundColor: `rgb(${r}, ${g}, ${b})` });
      } else if (scrollY > 950 && scrollY <= 1500) {
        const f = (scrollY - 950) / 550;
        const r = Math.round(224 - 36 * f); 
        const g = Math.round(242 - 16 * f); 
        const b = Math.round(254 - 6 * f);  
        setBgStyle({ backgroundColor: `rgb(${r}, ${g}, ${b})` });
      } else {
        setBgStyle({ backgroundColor: '#93c5fd' }); // vibrant ocean sky blue
      }

      // Smoothly fade out the Lightspeed WebGL canvas as we scroll down to Section 2
      const glCanvas = glCanvasRef.current;
      if (glCanvas) {
        const opacity = Math.max(0.0, 1.0 - scrollY / 320);
        glCanvas.style.opacity = opacity.toFixed(3);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);

    // --- WebGL 2 Lightspeed Shader Setup ---
    const glCanvas = glCanvasRef.current;
    let gl: WebGL2RenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let vbo: WebGLBuffer | null = null;
    let uniforms = {
      time: null as WebGLUniformLocation | null,
      resolution: null as WebGLUniformLocation | null,
      intensity: null as WebGLUniformLocation | null,
      particleCount: null as WebGLUniformLocation | null,
      colorShift: null as WebGLUniformLocation | null,
    };

    if (glCanvas) {
      gl = glCanvas.getContext('webgl2', {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'high-performance'
      });

      if (gl) {
        const VERTEX_SHADER_SRC = `#version 300 es
        precision highp float;
        in vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
        `;

        const FRAGMENT_SHADER_SRC = `#version 300 es
        precision highp float;
        out vec4 O;
        uniform float time;
        uniform vec2 resolution;
        uniform float intensity;
        uniform float particleCount;
        uniform vec3 colorShift;

        #define FC gl_FragCoord.xy
        #define R  resolution
        #define T  time

        float rnd(float a) {
          vec2 p = fract(a * vec2(12.9898, 78.233));
          p += dot(p, p*345.0);
          return fract(p.x * p.y);
        }

        vec3 hue(float a) {
          return colorShift * (0.6 + 0.6 * cos(6.3 * a + vec3(0.0, 8.3, 2.1)));
        }

        vec3 pattern(vec2 uv) {
          vec3 col = vec3(0.0);
          for (float i=0.0; i<particleCount; i++) {
            float a = rnd(i);
            vec2 n = vec2(a, fract(a*34.56));
            vec2 p = sin(n*(T+7.0) + T*0.5);
            float d = dot(uv-p, uv-p);
            col += (intensity * 0.00125)/d * hue(dot(uv,uv) + i*0.125 + T);
          }
          return col;
        }

        void main(void) {
          vec2 uv = (FC - 0.5 * R) / min(R.x, R.y);
          vec3 col = vec3(0.0);
          float s = 2.4;
          float a = atan(uv.x, uv.y);
          float b = length(uv);
          uv = vec2(a * 5.0 / 6.28318, 0.05 / tan(b) + T);
          uv = fract(uv) - 0.5;
          col += pattern(uv * s);

          // Dark cybernetic/cryogenic slate space chamber background
          vec2 ndc = (FC - 0.5 * R) / R.xy;
          vec3 bg = mix(vec3(0.02, 0.07, 0.18), vec3(0.005, 0.015, 0.04), length(ndc));

          O = vec4(bg + col, 1.0);
        }
        `;

        const compile = (type: number, src: string) => {
          const shader = gl!.createShader(type);
          if (!shader) throw new Error('Failed to create shader');
          gl!.shaderSource(shader, src);
          gl!.compileShader(shader);
          if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
            const log = gl!.getShaderInfoLog(shader);
            gl!.deleteShader(shader);
            throw new Error('Shader compilation error: ' + log);
          }
          return shader;
        };

        try {
          const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
          const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
          program = gl.createProgram();
          if (program) {
            gl.attachShader(program, vs);
            gl.attachShader(program, fs);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
              throw new Error('Program link error');
            }
            gl.useProgram(program);

            vbo = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            const verts = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
            gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

            const locPos = gl.getAttribLocation(program, 'position');
            gl.enableVertexAttribArray(locPos);
            gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0);

            uniforms.time = gl.getUniformLocation(program, 'time');
            uniforms.resolution = gl.getUniformLocation(program, 'resolution');
            uniforms.intensity = gl.getUniformLocation(program, 'intensity');
            uniforms.particleCount = gl.getUniformLocation(program, 'particleCount');
            uniforms.colorShift = gl.getUniformLocation(program, 'colorShift');
          }
        } catch (e) {
          console.error('WebGL 2 shader initialization failed:', e);
          gl = null;
        }
      }
    }

    // --- 2D Canvas setup ---
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    // Particle flow trails
    interface Trail {
      x: number;
      y: number;
      speed: number;
      length: number;
      opacity: number;
    }
    const trails: Trail[] = [];

    const initTrails = () => {
      trails.length = 0;
      for (let i = 0; i < 20; i++) {
        trails.push({
          x: Math.random() * width,
          y: Math.random() * height - height,
          speed: 0.8 + Math.random() * 1.5,
          length: 4 + Math.floor(Math.random() * 6),
          opacity: 0.05 + Math.random() * 0.25
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = rect.width;
      height = rect.height;
      
      // Resize 2D Canvas
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Resize WebGL Canvas
      if (glCanvas && gl) {
        glCanvas.width = width * dpr;
        glCanvas.height = height * dpr;
        gl.viewport(0, 0, glCanvas.width, glCanvas.height);
        gl.useProgram(program);
        gl.uniform2f(uniforms.resolution, glCanvas.width, glCanvas.height);
      }

      initTrails();
    };

    // Blueprint vector representation of the Cryo Iceberg Logo
    const drawIcebergLogo = (scrollVal: number) => {
      ctx.save();
      const ix = width - 180;
      const iy = 150;
      
      const opacity = Math.max(0.0, 0.04 - scrollVal * 0.0001);
      if (opacity <= 0.001) {
        ctx.restore();
        return;
      }
      
      ctx.strokeStyle = `rgba(0, 102, 255, ${opacity})`;
      ctx.fillStyle = `rgba(56, 189, 248, ${opacity * 0.25})`;
      ctx.lineWidth = 1.3;
      
      ctx.beginPath();
      ctx.moveTo(ix, iy + 80);
      ctx.lineTo(ix + 20, iy + 40);
      ctx.lineTo(ix + 35, iy + 15);
      ctx.lineTo(ix + 42, iy + 15);
      ctx.lineTo(ix + 50, iy + 35);
      ctx.lineTo(ix + 60, iy + 80);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(ix + 40, iy + 80);
      ctx.lineTo(ix + 55, iy + 25);
      ctx.lineTo(ix + 68, iy + 5);
      ctx.lineTo(ix + 75, iy + 5);
      ctx.lineTo(ix + 85, iy + 35);
      ctx.lineTo(ix + 98, iy + 65);
      ctx.lineTo(ix + 110, iy + 80);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      
      ctx.strokeStyle = `rgba(0, 102, 255, ${opacity * 1.5})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ix - 15, iy + 80); ctx.lineTo(ix + 125, iy + 80);
      ctx.moveTo(ix - 5, iy + 85); ctx.lineTo(ix + 115, iy + 85);
      ctx.moveTo(ix + 10, iy + 92); ctx.lineTo(ix + 100, iy + 92);
      ctx.stroke();

      ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.35})`;
      ctx.beginPath();
      ctx.moveTo(ix + 20, iy + 40);
      ctx.lineTo(ix + 35, iy + 15);
      ctx.lineTo(ix + 38, iy + 35);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(ix + 55, iy + 25);
      ctx.lineTo(ix + 68, iy + 5);
      ctx.lineTo(ix + 72, iy + 30);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const drawCryoOrnaments = (scrollVal: number) => {
      ctx.save();
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.05)';
      ctx.lineWidth = 0.8;
      
      const centerX = width * 0.5;
      const time = Date.now() * 0.001;

      drawIcebergLogo(scrollVal);

      // 1. Concentric blueprint radar rings around the 3D Centerpiece
      const centerY1 = 320;
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY1, 160, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY1, 260, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.06)';
      ctx.setLineDash([5, 12]);
      ctx.beginPath();
      ctx.arc(centerX, centerY1, 210, time * 0.15, time * 0.15 + Math.PI * 0.4);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY1, 240, -time * 0.08, -time * 0.08 + Math.PI * 0.7);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // Faint degree marks on radar circle
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.05)';
      ctx.beginPath();
      ctx.moveTo(centerX - 265, centerY1); ctx.lineTo(centerX - 255, centerY1);
      ctx.moveTo(centerX + 255, centerY1); ctx.lineTo(centerX + 265, centerY1);
      ctx.moveTo(centerX, centerY1 - 265); ctx.lineTo(centerX, centerY1 - 255);
      ctx.moveTo(centerX, centerY1 + 255); ctx.lineTo(centerX, centerY1 + 265);
      ctx.stroke();

      // 2. Faint Telemetry text data stream overlays
      ctx.fillStyle = 'rgba(14, 165, 233, 0.08)';
      ctx.font = '7px Courier New, monospace';
      ctx.fillText('CRYO_N2: -195.8 C', 55, 80);
      ctx.fillText('FLOW_RATE: 1.4 L/MIN', 55, 95);
      ctx.fillText('VACUUM: 1.02e-6 BAR', 55, 110);

      ctx.fillText('SYS_LOG: ESTABLISHED', width - 180, 80);
      ctx.fillText('CORE_TEMP: -80.4 C', width - 180, 95);
      ctx.fillText('STB_VAL: 99.85%', width - 180, 110);

      // 3. Oscilloscope monitor block (Left-bottom corner)
      const ox = 60;
      const oy = height - 130;
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.04)';
      ctx.strokeRect(ox, oy, 110, 60);
      ctx.fillStyle = 'rgba(14, 165, 233, 0.01)';
      ctx.fillRect(ox, oy, 110, 60);
      // internal grid
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.015)';
      for (let gx = ox + 22; gx < ox + 110; gx += 22) {
        ctx.beginPath(); ctx.moveTo(gx, oy); ctx.lineTo(gx, oy + 60); ctx.stroke();
      }
      for (let gy = oy + 15; gy < oy + 60; gy += 15) {
        ctx.beginPath(); ctx.moveTo(ox, gy); ctx.lineTo(ox + 110, gy); ctx.stroke();
      }
      
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1.0;
      for (let i = 0; i < 110; i += 2) {
        const waveY = oy + 30 + Math.sin(i * 0.12 - scrollVal * 0.012) * 16 * Math.cos(i * 0.025);
        if (i === 0) ctx.moveTo(ox + i, waveY);
        else ctx.lineTo(ox + i, waveY);
      }
      ctx.stroke();
      ctx.fillStyle = 'rgba(14, 165, 233, 0.08)';
      ctx.fillText('TEMP_SENS_LOG', ox + 4, oy - 4);

      // 4. Draw scientific chamber pipeline framework
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.04)';
      ctx.beginPath();
      ctx.moveTo(40, 0);
      ctx.lineTo(40, height);
      ctx.moveTo(width - 40, 0);
      ctx.lineTo(width - 40, height);
      ctx.stroke();

      // Horizontal flow pipeline connections
      ctx.beginPath();
      ctx.moveTo(40, height * 0.35);
      ctx.lineTo(width - 40, height * 0.35);
      ctx.moveTo(40, height * 0.72);
      ctx.lineTo(width - 40, height * 0.72);
      ctx.stroke();

      // 5. Frozen Crystal Outlines (Iceberg geometry, very faint)
      ctx.fillStyle = 'rgba(56, 189, 248, 0.015)';
      
      // Crystal 1 (Left side)
      ctx.beginPath();
      ctx.moveTo(30, height * 0.2);
      ctx.lineTo(110, height * 0.15);
      ctx.lineTo(130, height * 0.25);
      ctx.lineTo(80, height * 0.3);
      ctx.lineTo(30, height * 0.2);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      // Crystal 2 (Right side)
      ctx.beginPath();
      ctx.moveTo(width - 30, height * 0.65);
      ctx.lineTo(width - 120, height * 0.7);
      ctx.lineTo(width - 150, height * 0.6);
      ctx.lineTo(width - 70, height * 0.55);
      ctx.lineTo(width - 30, height * 0.65);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      // 6. Floating Translucent reflections / panels
      const panelOpacity = Math.min(0.08, scrollVal > 300 ? (scrollVal - 300) * 0.0002 : 0);
      ctx.fillStyle = `rgba(255, 255, 255, ${panelOpacity})`;
      ctx.strokeStyle = `rgba(56, 189, 248, ${panelOpacity * 1.5})`;
      ctx.lineWidth = 1.0;
      
      // Floating glass panels next to corporate details area
      ctx.fillRect(width * 0.1, height * 0.45, 220, 140);
      ctx.strokeRect(width * 0.1, height * 0.45, 220, 140);

      ctx.fillRect(width * 0.7, height * 0.2, 240, 160);
      ctx.strokeRect(width * 0.7, height * 0.2, 240, 160);

      ctx.restore();
    };

    const drawGrid = (scrollVal: number) => {
      const spacing = 75;
      const offset = scrollVal * 0.12;
      const time = Date.now() * 0.001;

      ctx.strokeStyle = 'rgba(14, 165, 233, 0.015)';
      ctx.lineWidth = 1;

      // Section 2 Atmosphere: Introduce grid distortions (scroll 300 to 950)
      let distortionStrength = 0;
      if (scrollVal > 300 && scrollVal <= 950) {
        distortionStrength = Math.min(6.0, (scrollVal - 300) * 0.012);
      } else if (scrollVal > 950) {
        distortionStrength = Math.max(0, 6.0 - (scrollVal - 950) * 0.012);
      }

      // Vertical lines
      for (let x = 0; x < width; x += spacing) {
        ctx.beginPath();
        for (let y = 0; y < height; y += 10) {
          const rippleX = x + Math.sin(y * 0.005 + time) * distortionStrength;
          if (y === 0) ctx.moveTo(rippleX, y);
          else ctx.lineTo(rippleX, y);
        }
        ctx.stroke();
      }

      // Horizontal lines
      const startY = -(offset % spacing);
      for (let y = startY; y < height; y += spacing) {
        ctx.beginPath();
        for (let x = 0; x < width; x += 10) {
          const rippleY = y + Math.cos(x * 0.005 + time) * distortionStrength;
          if (x === 0) ctx.moveTo(x, rippleY);
          else ctx.lineTo(x, rippleY);
        }
        ctx.stroke();
      }

      // Coordinate tick signs (+)
      ctx.fillStyle = 'rgba(14, 165, 233, 0.08)';
      ctx.font = '6px monospace';

      const cols = Math.floor(width / spacing);
      const rows = Math.floor(height / spacing) + 2;

      for (let c = 1; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const px = c * spacing;
          const py = r * spacing - (offset % spacing);

          ctx.beginPath();
          ctx.moveTo(px - 2, py);
          ctx.lineTo(px + 2, py);
          ctx.moveTo(px, py - 2);
          ctx.lineTo(px, py + 2);
          ctx.stroke();

          if (c % 4 === 0 && r % 5 === 0) {
            ctx.fillText(`+ ${Math.round(px)},${Math.round(py + offset)}`, px + 4, py - 4);
          }
        }
      }
    };

    const drawFlowingLines = (scrollVal: number) => {
      if (scrollVal < 900) return;

      const progress = Math.min(1.0, (scrollVal - 900) / 300);
      const scrollOffsetTime = scrollVal * 0.006;
      
      const drawSingleLine = (yCenter: number, amp: number, freq: number, speed: number, alpha: number, thickness: number) => {
        ctx.beginPath();
        ctx.lineWidth = thickness;
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.02)');
        grad.addColorStop(0.5, `rgba(6, 182, 212, ${alpha * progress})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
        
        ctx.strokeStyle = grad;
        
        for (let x = -50; x <= width + 50; x += 10) {
          const y = yCenter + Math.sin(x * freq + scrollOffsetTime * speed) * amp + Math.cos(x * 0.001 - scrollOffsetTime * 0.4) * (amp * 0.3);
          if (x === -50) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };

      drawSingleLine(height * 0.48, 45, 0.0040, -1.8, 0.45, 2.5);
      drawSingleLine(height * 0.52, 25, 0.0028, -2.5, 0.30, 0.7);
      drawSingleLine(height * 0.56, 55, 0.0048, -1.1, 0.35, 1.8);
      drawSingleLine(height * 0.60, 30, 0.0032, -2.1, 0.22, 1.2);
      drawSingleLine(height * 0.65, 50, 0.0044, -1.5, 0.28, 2.0);
      drawSingleLine(height * 0.70, 35, 0.0036, -2.8, 0.18, 0.5);
    };

    const drawParticles = () => {
      trails.forEach((trail) => {
        trail.y += trail.speed;
        if (trail.y > height) {
          trail.y = -30;
          trail.x = Math.random() * width;
        }

        for (let j = 0; j < trail.length; j++) {
          const py = trail.y - j * 5;
          if (py < 0 || py > height) continue;

          const alpha = trail.opacity * (1 - j / trail.length);
          ctx.fillStyle = `rgba(14, 165, 233, ${alpha * 0.8})`;
          ctx.fillRect(trail.x, py, 1.5, 1.5);
        }
      });
    };

    const updateAndDraw = () => {
      scrollRef.current.current += (scrollRef.current.target - scrollRef.current.current) * 0.08;
      const scrollVal = scrollRef.current.current;

      // Render WebGL Lightspeed Canvas
      if (gl && program) {
        gl.useProgram(program);
        // Warp lines are strictly scroll linked: mapping scrollOffset to scrollVal * 0.015
        gl.uniform1f(uniforms.time, scrollVal * 0.015);
        gl.uniform1f(uniforms.intensity, 1.25);
        gl.uniform1f(uniforms.particleCount, 25.0);
        gl.uniform3f(uniforms.colorShift, 0.0, 0.75, 1.0); // Neon cyber cyan-blue

        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      // Render 2D Overlay
      ctx.clearRect(0, 0, width, height);
      drawGrid(scrollVal);
      drawCryoOrnaments(scrollVal);
      drawParticles();
      drawFlowingLines(scrollVal);

      animationId = requestAnimationFrame(updateAndDraw);
    };

    window.addEventListener('resize', resize);
    resize();
    updateAndDraw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (gl && program) {
        const attachedShaders = gl.getAttachedShaders(program) || [];
        attachedShaders.forEach(s => gl.deleteShader(s));
        gl.deleteProgram(program);
      }
      if (gl && vbo) {
        gl.deleteBuffer(vbo);
      }
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 transition-colors duration-1000 ease-out"
      style={bgStyle}
    >
      {/* WebGL Lightspeed Warp Tunnel Shader Canvas */}
      <canvas 
        ref={glCanvasRef} 
        className="absolute inset-0 w-full h-full block transition-opacity duration-300 ease-out"
        style={{ opacity: 1.0 }} 
      />

      {/* 2D Grid and Flow Line Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* 3D WebGL Canvas containing the rotating molecular lattice */}
      {mounted && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <ambientLight intensity={0.4} />
            <pointLight position={[5, 5, 5]} intensity={0.8} />
            <ScienceObject3D scrollYRef={scrollYRef} mouseRef={mouseRef} />
          </Canvas>
        </div>
      )}

      {/* Vignette fade layout overlay */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-transparent via-slate-100/10 to-transparent pointer-events-none" />
    </div>
  );
}

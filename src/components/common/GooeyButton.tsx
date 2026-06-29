'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';

interface GooeyButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const GooeyButton: React.FC<GooeyButtonProps> = ({
  children,
  href,
  onClick,
  className = '',
}) => {
  const filterRef = useRef<HTMLSpanElement>(null);
  const [isActive, setIsActive] = useState(false);

  const noise = (n = 1) => n / 2 - Math.random() * n;
  const getXY = (distance: number, pointIndex: number, totalPoints: number): [number, number] => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i: number, t: number, d: [number, number], r: number) => {
    const rotate = noise(r / 10);
    const colors = ['#005BFF', '#1b51dbff', '#ffffff', '#05347cff'];
    return {
      start: getXY(d[0], 12 - i, 12),
      end: getXY(d[1] + noise(7), 12 - i, 12),
      time: t,
      scale: 1.2 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  };

  const triggerGooeyEffect = () => {
    if (isActive) return;
    setIsActive(true);

    const element = filterRef.current;
    if (element) {
      // Clear existing particles
      const existing = element.querySelectorAll('.btn-particle');
      existing.forEach((p) => {
        try {
          element.removeChild(p);
        } catch {
          // do nothing
        }
      });

      const particleCount = 12;
      const animationTime = 500;
      const timeVariance = 200;
      const particleDistances: [number, number] = [20, 75];
      const particleR = 80;

      for (let i = 0; i < particleCount; i++) {
        const t = animationTime * 2 + noise(timeVariance * 2);
        const p = createParticle(i, t, particleDistances, particleR);

        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('btn-particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', p.color);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);

        point.classList.add('btn-point');
        particle.appendChild(point);
        element.appendChild(particle);

        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // do nothing
          }
        }, t);
      }
    }

    // Reset active state after animation completes
    setTimeout(() => {
      setIsActive(false);
    }, 1000);
  };

  const handleClick = (e: React.MouseEvent) => {
    triggerGooeyEffect();

    // Dispatch event to open the right side assistant widget
    window.dispatchEvent(new CustomEvent('open-assistant'));

    if (onClick) {
      onClick();
    }
  };

  const buttonContent = (
    <>
      <style>
        {`
          .gooey-btn-container {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 2;
            padding: 0.6em 1.4em;
            border-radius: 9999px;
            border: 1.5px solid rgba(56, 189, 248, 0.4);
            background: rgba(7, 27, 52, 0.5);
            color: #ffffff;
            transition: color 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
            overflow: visible;
          }
          .gooey-btn-container:hover {
            border-color: rgba(56, 189, 248, 0.8);
            background: rgba(7, 27, 52, 0.7);
          }
          /* Click effect state styles */
          .gooey-btn-container.active {
            color: #000000 !important;
            border-color: #ffffff !important;
            background: transparent !important;
          }
          .gooey-btn-filter {
            position: absolute;
            inset: -12px;
            z-index: -1;
            filter: url(#gooey-btn-effect-filter);
            pointer-events: none;
          }
          /* Gooey background bubble that expands only on active click */
          .gooey-btn-bubble {
            position: absolute;
            inset: 12px;
            background: #ffffff;
            border-radius: 9999px;
            transform: scale(0);
            opacity: 0;
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
            z-index: -1;
          }
          .gooey-btn-container.active .gooey-btn-bubble {
            transform: scale(1);
            opacity: 1;
          }
          .btn-particle,
          .btn-point {
            display: block;
            opacity: 0;
            width: 18px;
            height: 18px;
            border-radius: 9999px;
            transform-origin: center;
          }
          .btn-particle {
            position: absolute;
            top: calc(50% - 9px);
            left: calc(50% - 9px);
            animation: btn-particle-anim var(--time) ease 1 -100ms;
          }
          .btn-point {
            background: var(--color);
            opacity: 1;
            animation: btn-point-anim var(--time) ease 1 -100ms;
          }
          @keyframes btn-particle-anim {
            0% {
              transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y)));
              opacity: 1;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            70% {
              transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.1), calc(var(--end-y) * 1.1));
              opacity: 1;
              animation-timing-function: ease;
            }
            100% {
              transform: rotate(calc(var(--rotate))) translate(calc(var(--end-x) * 0.4), calc(var(--end-y) * 0.4));
              opacity: 0;
            }
          }
          @keyframes btn-point-anim {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            20% {
              transform: scale(calc(var(--scale) * 0.4));
              opacity: 1;
            }
            65% {
              transform: scale(var(--scale));
              opacity: 1;
            }
            100% {
              transform: scale(0);
              opacity: 0;
            }
          }
        `}
      </style>
      <span className="gooey-btn-filter" ref={filterRef}>
        <span className="gooey-btn-bubble" />
      </span>
      <span className="relative z-10 select-none font-sans text-xs font-semibold tracking-wider uppercase">{children}</span>

      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="gooey-btn-effect-filter" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -12" result="goo" />
          </filter>
        </defs>
      </svg>
    </>
  );

  return (
    <button
      onClick={handleClick}
      className={`gooey-btn-container ${isActive ? 'active' : ''} ${className}`}
    >
      {buttonContent}
    </button>
  );
};

export default GooeyButton;

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function CompanyIntro({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSupportPage = pathname === '/support';

  const [visible, setVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return !(window as any).__introPlayed && !isSupportPage;
    }
    return true;
  });
  const [videoEnded, setVideoEnded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [rippleScale, setRippleScale] = useState(0);
  const [baseFrequency, setBaseFrequency] = useState("0.015 0.03");
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
  const [showRings, setShowRings] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if intro has already played in this session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isSupportPage) {
        (window as any).__introPlayed = true;
        (window as any).__introActive = false;
        (window as any).__introFinished = true;
        setVisible(false);
        return;
      }
      if ((window as any).__introPlayed) {
        (window as any).__introActive = false;
        (window as any).__introFinished = true;
        setVisible(false);
        return;
      }
      (window as any).__introPlayed = true;
      (window as any).__introActive = true;
      (window as any).__introFinished = false;
    }
  }, [isSupportPage]);

  // Prevent scrolling on body while intro is active
  useEffect(() => {
    if (!visible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  const handleEnterClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTransitioning) return;

    // Capture click location for expanding water ripple rings
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setClickPos({ x, y });
    setShowRings(true);
    setIsTransitioning(true);

    // Animate the liquid displacement scale (water wave warp)
    let start: number | null = null;
    const duration = 1200; // 1.2s ripple and reveal time

    const animateRipple = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);

      // Distorts waves: peaks in the middle and then smooths out
      const currentScale = Math.sin(progress * Math.PI) * 160;
      setRippleScale(currentScale);

      // Morph waves to simulate liquid turbulence
      const freqX = 0.015 + Math.sin(progress * 5) * 0.01;
      const freqY = 0.03 + Math.cos(progress * 5) * 0.015;
      setBaseFrequency(`${freqX} ${freqY}`);

      if (progress < 1) {
        requestAnimationFrame(animateRipple);
      } else {
        setVisible(false);
        if (typeof window !== 'undefined') {
          (window as any).__introActive = false;
          (window as any).__introFinished = true;
          window.dispatchEvent(new Event('intro-finished'));
        }
      }
    };

    requestAnimationFrame(animateRipple);
  };

  if (!visible || isSupportPage) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Website content pre-rendered behind the transition */}
      <div className="absolute inset-0 pointer-events-none opacity-0">
        {children}
      </div>

      {/* SVG liquid distortion filter definition */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <filter id="liquid-ripple-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={baseFrequency}
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={rippleScale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
            onClick={handleEnterClick}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black overflow-hidden select-none cursor-pointer"
          >
            {/* Main Full-Screen Video Wrapper */}
            <div 
              style={{
                filter: rippleScale > 0 ? 'url(#liquid-ripple-filter)' : 'none',
              }}
              className="absolute inset-0 w-full h-full bg-black transition-all duration-75"
            >
              <video
                ref={videoRef}
                src="/intro.mp4"
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                onEnded={() => setVideoEnded(true)}
              />
              {/* Soft dark vignette over video to enhance prompt visibility */}
              <div className="absolute inset-0 bg-black/15 pointer-events-none" />
            </div>

            {/* expanding concentric ripple rings */}
            {showRings && (
              <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border border-sky-300/30 bg-sky-400/5"
                    style={{
                      left: clickPos.x,
                      top: clickPos.y,
                      transform: 'translate(-50%, -50%)',
                    }}
                    initial={{ width: 0, height: 0, opacity: 0.7 }}
                    animate={{ width: 1500, height: 1500, opacity: 0 }}
                    transition={{
                      duration: 0.9,
                      delay: i * 0.12,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Click-to-Enter prompt at the bottom */}
            <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center justify-center z-30 pointer-events-none">
              <AnimatePresence>
                {!isTransitioning && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    <span className="font-hanken font-bold text-[11px] tracking-[0.4em] text-white/70 uppercase animate-pulse mb-3">
                      {videoEnded ? 'Click anywhere to Enter' : 'Click to skip and Enter'}
                    </span>
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-white/50"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="10 8 16 12 10 16 10 8" />
                      </svg>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FlaskConical, HeartPulse, ThermometerSnowflake, ChevronDown } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
}

interface GooeyNavProps {
  items: NavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
}

const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const pathname = usePathname();

  // Find index of item matching current pathname
  const getActiveIndexFromPathname = (): number => {
    const idx = items.findIndex((item) => {
      if (item.href === '/') {
        return pathname === '/';
      }
      return pathname.startsWith(item.href);
    });
    return idx !== -1 ? idx : 0;
  };

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isProductsHovered, setIsProductsHovered] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterProducts = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsProductsHovered(true);
  };

  const handleMouseLeaveProducts = () => {
    timeoutRef.current = setTimeout(() => {
      setIsProductsHovered(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Sync active index with Next.js pathname
  useEffect(() => {
    const idx = getActiveIndexFromPathname();
    if (idx !== activeIndex) {
      setActiveIndex(idx);
    }
  }, [pathname]);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance: number, pointIndex: number, totalPoints: number): [number, number] => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i: number, t: number, d: [number, number], r: number) => {
    const rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  };

  const makeParticles = (element: HTMLSpanElement) => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);
    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');
      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);
        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => {
          element.classList.add('active');
        });
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // do nothing
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.querySelector('.nav-link-text')?.textContent || element.innerText;
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    const liEl = e.currentTarget.parentElement;
    if (!liEl || activeIndex === index) return;

    // Position/animation effects
    updateEffectPosition(liEl);
    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll('.particle');
      particles.forEach((p) => filterRef.current?.removeChild(p));
    }
    if (textRef.current) {
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }
    if (filterRef.current) {
      makeParticles(filterRef.current);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const liEl = e.currentTarget.parentElement;
      if (liEl) {
        // Trigger simulated click
        const clickEvent = {
          currentTarget: e.currentTarget,
          preventDefault: () => { },
        } as unknown as React.MouseEvent<HTMLAnchorElement>;
        handleClick(clickEvent, index);
      }
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex];
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
      filterRef.current?.classList.add('active');
    }
    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex];
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  return (
    <>
      <style>
        {`
          :root {
            --linear-ease: linear(0, 0.068, 0.19 2.7%, 0.804 8.1%, 1.037, 1.199 13.2%, 1.245, 1.27 15.8%, 1.274, 1.272 17.4%, 1.249 19.1%, 0.996 28%, 0.949, 0.928 33.3%, 0.926, 0.933 36.8%, 1.001 45.6%, 1.013, 1.019 50.8%, 1.018 54.4%, 1 63.1%, 0.995 68%, 1.001 85%, 1);
            --color-1: #005BFF;
            --color-2: #1d69dcff;
            --color-3: #ffffff;
            --color-4: #001F4D;
          }
          .effect {
            position: absolute;
            opacity: 1;
            pointer-events: none;
            display: grid;
            place-items: center;
            z-index: 1;
          }
          .effect.text {
            color: white;
            transition: color 0.3s ease;
            font-size: 14px;
            font-weight: 500;
            font-family: inherit;
          }
          .effect.text.active {
            color: #0B3D91;
          }
          .effect.filter {
            filter: url(#gooey-nav-filter);
          }
          .effect.filter::after {
            content: "";
            position: absolute;
            inset: 0;
            background: white;
            transform: scale(0);
            opacity: 0;
            z-index: -1;
            border-radius: 9999px;
          }
          .effect.active::after {
            animation: pill 0.3s ease both;
          }
          @keyframes pill {
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .particle,
          .point {
            display: block;
            opacity: 0;
            width: 20px;
            height: 20px;
            border-radius: 9999px;
            transform-origin: center;
          }
          .particle {
            --time: 5s;
            position: absolute;
            top: calc(50% - 10px);
            left: calc(50% - 10px);
            animation: particle calc(var(--time)) ease 1 -350ms;
          }
          .point {
            background: var(--color);
            opacity: 1;
            animation: point calc(var(--time)) ease 1 -350ms;
          }
          @keyframes particle {
            0% {
              transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y)));
              opacity: 1;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            70% {
              transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.2), calc(var(--end-y) * 1.2));
              opacity: 1;
              animation-timing-function: ease;
            }
            85% {
              transform: rotate(calc(var(--rotate) * 0.66)) translate(calc(var(--end-x)), calc(var(--end-y)));
              opacity: 1;
            }
            100% {
              transform: rotate(calc(var(--rotate) * 1.2)) translate(calc(var(--end-x) * 0.5), calc(var(--end-y) * 0.5));
              opacity: 1;
            }
          }
          @keyframes point {
            0% {
              transform: scale(0);
              opacity: 0;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            25% {
              transform: scale(calc(var(--scale) * 0.25));
            }
            38% {
              opacity: 1;
            }
            65% {
              transform: scale(var(--scale));
              opacity: 1;
              animation-timing-function: ease;
            }
            85% {
              transform: scale(var(--scale));
              opacity: 1;
            }
            100% {
              transform: scale(0);
              opacity: 0;
            }
          }
          li.active {
            color: transparent;
            text-shadow: none;
          }
          li.active a {
            color: transparent !important;
          }
          .chevron-svg {
            color: #d1d5db;
            transition: color 0.3s ease, transform 0.3s ease;
          }
          li:hover .chevron-svg {
            color: white;
          }
          li.active .chevron-svg {
            color: #0B3D91 !important;
          }
        
        `}
      </style>
      <div className="relative" ref={containerRef}>
        <nav className="flex relative" style={{ transform: 'translate3d(0,0,0.01px)' }}>
          <ul
            ref={navRef}
            className="flex gap-4 lg:gap-8 list-none p-0 px-4 m-0 relative z-[3] items-center"
            style={{
              color: 'white',
              textShadow: '0 1px 1px hsl(205deg 30% 10% / 0.2)'
            }}
          >
            {items.map((item, index) => {
              const isProducts = item.name === 'Products';
              return (
                <li
                  key={index}
                  onMouseEnter={() => isProducts && handleMouseEnterProducts()}
                  onMouseLeave={() => isProducts && handleMouseLeaveProducts()}
                  className={`group rounded-full relative cursor-pointer transition-[background-color_color_box-shadow] duration-300 ease shadow-[0_0_0.5px_1.5px_transparent] text-white ${activeIndex === index ? 'active' : ''
                    }`}
                >
                  <Link
                    onClick={(e) => handleClick(e, index)}
                    href={item.href}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="outline-none py-[0.6em] px-[1em] inline-flex items-center gap-1 font-sans text-sm font-medium tracking-wide text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    <span className="nav-link-text">{item.name}</span>
                    {isProducts && (
                      <ChevronDown className={`chevron-svg w-3.5 h-3.5 transition-transform duration-300 ${isProductsHovered ? 'rotate-180' : ''}`} />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <span className="effect filter" ref={filterRef} />
        <span className="effect text" ref={textRef} />

        {isProductsHovered && (
          <div
            onMouseEnter={handleMouseEnterProducts}
            onMouseLeave={handleMouseLeaveProducts}
            className="absolute top-[110%] left-1/2 -translate-x-[42%] mt-2 w-[90vw] max-w-5xl bg-[#090f26]/95 border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 backdrop-blur-xl z-[999] text-left"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Column 1: Laboratory */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10 text-cyan-400">
                  <FlaskConical className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-wider">Laboratory</span>
                </div>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href="/products?tab=laboratory&id=newgen-ultra-low-freezer" 
                      className="block group/item"
                      onClick={() => setIsProductsHovered(false)}
                    >
                      <span className="text-white group-hover/item:text-cyan-300 font-semibold text-xs transition-colors block leading-snug">
                        Newgen series Ultra Low Freezer/ Component Freezer (-20°C to -86°C)
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5 leading-normal">
                        • Premium Models with touch screen panel & VIP PUF (100–1000L)
                        <br />• Standard Models (30–1000L)
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/products?tab=laboratory&id=newgen-ultra-low-freezer" 
                      className="block group/item"
                      onClick={() => setIsProductsHovered(false)}
                    >
                      <span className="text-white group-hover/item:text-cyan-300 font-semibold text-xs transition-colors block leading-snug">
                        Standard series Ultra Low Freezer (-86°C)
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/products?tab=laboratory&id=plasma-freezer" 
                      className="block group/item"
                      onClick={() => setIsProductsHovered(false)}
                    >
                      <span className="text-white group-hover/item:text-cyan-300 font-semibold text-xs transition-colors block leading-snug">
                        Deep Freezer / Plasma Freezer (-40°C)
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/products?tab=laboratory&id=low-freezer-single-door" 
                      className="block group/item"
                      onClick={() => setIsProductsHovered(false)}
                    >
                      <span className="text-white group-hover/item:text-cyan-300 font-semibold text-xs transition-colors block leading-snug">
                        Low Freezer (-20°C) - Single door model
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/products?tab=laboratory&id=low-freezer-double-door" 
                      className="block group/item"
                      onClick={() => setIsProductsHovered(false)}
                    >
                      <span className="text-white group-hover/item:text-cyan-300 font-semibold text-xs transition-colors block leading-snug">
                        Low Freezer (-20°C) - Double door model
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/products?tab=laboratory&id=lab-pharma-refrigerator" 
                      className="block group/item"
                      onClick={() => setIsProductsHovered(false)}
                    >
                      <span className="text-white group-hover/item:text-cyan-300 font-semibold text-xs transition-colors block leading-snug">
                        Lab/Pharma/Chromatography Refrigerator (+2°C to +8°C)
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5 leading-normal">
                        • Pre-coated Steel or Stainless Steel SS-304 / SS-316
                        <br />• 200, 300, 500, 1000, 1250 and 1500L
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2: Blood Bank */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10 text-red-400">
                  <HeartPulse className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-wider">Blood Bank</span>
                </div>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href="/products?tab=laboratory&id=blood-bank-refrigerator" 
                      className="block group/item"
                      onClick={() => setIsProductsHovered(false)}
                    >
                      <span className="text-white group-hover/item:text-cyan-300 font-semibold text-xs transition-colors block leading-snug">
                        Blood Bag Refrigerator
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5 leading-normal">
                        • 60, 150, 300, 600 bags capacities
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/products?tab=laboratory&id=ice-lined-refrigerator" 
                      className="block group/item"
                      onClick={() => setIsProductsHovered(false)}
                    >
                      <span className="text-white group-hover/item:text-cyan-300 font-semibold text-xs transition-colors block leading-snug">
                        Ice lined Refrigerator (4°C to 8°C)
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/products?tab=blood-bank&id=plasma-thawing-bath" 
                      className="block group/item"
                      onClick={() => setIsProductsHovered(false)}
                    >
                      <span className="text-white group-hover/item:text-cyan-300 font-semibold text-xs transition-colors block leading-snug">
                        Plasma Thawing bath
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/products?tab=blood-bank&id=cold-trap" 
                      className="block group/item"
                      onClick={() => setIsProductsHovered(false)}
                    >
                      <span className="text-white group-hover/item:text-cyan-300 font-semibold text-xs transition-colors block leading-snug">
                        Ultra-low temperature Cold Trap (-80°C)
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/products?tab=blood-bank&id=sub-zero-chiller-bath" 
                      className="block group/item"
                      onClick={() => setIsProductsHovered(false)}
                    >
                      <span className="text-white group-hover/item:text-cyan-300 font-semibold text-xs transition-colors block leading-snug">
                        Sub – zero Chiller Bath
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/products?tab=blood-bank&id=heating-cooling-circulator" 
                      className="block group/item"
                      onClick={() => setIsProductsHovered(false)}
                    >
                      <span className="text-white group-hover/item:text-cyan-300 font-semibold text-xs transition-colors block leading-snug">
                        Heating and cooling circulator
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Cryogenic Accessories */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10 text-sky-400">
                  <ThermometerSnowflake className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-wider">Cryogenic Accessories</span>
                </div>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href="/products?tab=cryogenic-accessories&id=temp-data-loggers" 
                      className="block group/item"
                      onClick={() => setIsProductsHovered(false)}
                    >
                      <span className="text-white group-hover/item:text-cyan-300 font-semibold text-xs transition-colors block leading-snug">
                        Temperature Data Loggers – Single and Multi-channels
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/products?tab=cryogenic-accessories&id=iot-realtime-monitors" 
                      className="block group/item"
                      onClick={() => setIsProductsHovered(false)}
                    >
                      <span className="text-white group-hover/item:text-cyan-300 font-semibold text-xs transition-colors block leading-snug">
                        IoT Realtime Monitors
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/products?tab=cryogenic-accessories&id=temperature-recorders" 
                      className="block group/item"
                      onClick={() => setIsProductsHovered(false)}
                    >
                      <span className="text-white group-hover/item:text-cyan-300 font-semibold text-xs transition-colors block leading-snug">
                        Temperature Recorders
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/products?tab=cryogenic-accessories&id=cryoracks-cryoboxes" 
                      className="block group/item"
                      onClick={() => setIsProductsHovered(false)}
                    >
                      <span className="text-white group-hover/item:text-cyan-300 font-semibold text-xs transition-colors block leading-snug">
                        Cryoracks, Cryoboxes
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/products?tab=cryogenic-accessories&id=cryopen-cryoapron" 
                      className="block group/item"
                      onClick={() => setIsProductsHovered(false)}
                    >
                      <span className="text-white group-hover/item:text-cyan-300 font-semibold text-xs transition-colors block leading-snug">
                        Cryopen, Cryoapron
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SVG filter for the gooey/liquid connection effect */}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="gooey-nav-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -12" result="goo" />
          </filter>
        </defs>
      </svg>
    </>
  );
};

export default GooeyNav;

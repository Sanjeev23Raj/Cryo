'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import GooeyNav from './GooeyNav';
import GooeyButton from '../common/GooeyButton';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'R&D', href: '/rd' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const isDarkPage = pathname === '/about' || pathname === '/contact';

  return (
    <nav
      className={`hidden md:block fixed top-0 left-0 right-0 z-[50] transition-all duration-300 ${isScrolled
        ? (isDarkPage
          ? 'bg-[linear-gradient(135deg,rgba(10,30,64,0.96),rgba(4,13,33,0.96),rgba(2,5,16,0.98))] border-b border-sky-500/15 shadow-[0_10px_30px_rgba(0,0,0,0.35)] py-4'
          : 'bg-[linear-gradient(135deg,rgba(8,35,74,0.96),rgba(11,61,145,0.94),rgba(22,119,255,0.9))] border-b border-white/10 shadow-lg py-4')
        : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">

        {/* Logo + Company Name */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/company logo.svg"
            alt="Cryo Scientific"
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />

          <div className="flex flex-col">
            <span
              className="
          text-white
          font-bold
          leading-none
          text-sm
          sm:text-base
          md:text-lg
          tracking-wide
        "
            >
              CRYO SCIENTIFIC
            </span>

            <span
              className="
          text-cyan-300
          text-[8px]
          sm:text-[9px]
          md:text-[10px]
          tracking-[0.25em]
          uppercase
        "
            >
              SYSTEMS PVT LTD
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <GooeyNav items={navItems} />

          <GooeyButton
            href="/contact"
            className="px-6 py-2.5 text-white font-medium text-xs tracking-wider uppercase"
          >
            Get In Touch
          </GooeyButton>
        </div>

        {/* Mobile Menu Button */}

      </div>
    </nav>
  );
}

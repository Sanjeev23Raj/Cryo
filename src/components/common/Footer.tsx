'use client';

import React from 'react';
import Link from 'next/link';
import { Award, CheckCircle, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-20 mt-auto border-t border-sky-300/20 bg-[linear-gradient(180deg,#071427_0%,#0a1d37_52%,#102a4b_100%)] font-sans text-slate-200 shadow-[0_-24px_60px_rgba(4,15,32,0.5)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-12 px-6 py-16 md:grid-cols-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="font-hanken text-xl font-extrabold leading-none tracking-[0.08em] text-white">
              CRYO SCIENTIFIC
            </span>
            <span className="mt-1 text-[11px] font-semibold leading-none tracking-[0.28em] text-sky-300">
              SYSTEMS PVT LTD
            </span>
          </div>

          <p className="mt-2 text-sm leading-7 text-slate-200/88">
            Advanced cryogenic, blood bank, and scientific laboratory solutions with 25+ years of trusted engineering excellence.
          </p>

          <div className="mt-4 flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-sky-300" />
              <span className="text-slate-100">ISO 9001:2015 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-sky-300" />
              <span className="text-slate-100">CE & WHO-GMP Compliant Systems</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-6 font-hanken text-sm font-semibold uppercase tracking-widest text-white">
            Quick Navigation
          </h4>
          <ul className="flex flex-col gap-3 text-sm text-slate-100/88">
            <li><Link href="/" className="transition-colors hover:text-sky-300">Home</Link></li>
            <li><Link href="/about" className="transition-colors hover:text-sky-300">About Us</Link></li>
            <li><Link href="/products" className="transition-colors hover:text-sky-300">Products Catalog</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-sky-300">Contact Directory</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-6 font-hanken text-sm font-semibold uppercase tracking-widest text-white">
            Solutions
          </h4>
          <ul className="flex flex-col gap-3 text-sm text-slate-100/88">
            <li><Link href="/products?tab=blood-bank" className="transition-colors hover:text-sky-300">Blood Banks</Link></li>
            <li><Link href="/products?tab=laboratory" className="transition-colors hover:text-sky-300">Laboratory Refrigerators</Link></li>
            <li><Link href="/products?tab=cryogenic-accessories" className="transition-colors hover:text-sky-300">Cryogenic Accessories</Link></li>
            <li><Link href="/rd" className="transition-colors hover:text-sky-300">Research & Development</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-6 font-hanken text-sm font-semibold uppercase tracking-widest text-white">
            Head Office
          </h4>
          <ul className="flex flex-col gap-4 text-sm text-slate-100/88">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
              <a
                href="https://maps.google.com/?q=2/628,+Rapid+Nagar,+Kunrathur+High+Road,+Gerugambakkam,+Chennai+-+602+128"
                target="CRYO SCIENTIFIC SYSTEMS"
                rel="noopener noreferrer"
                className="text-slate-100 transition-colors hover:text-sky-300"
              >
                2/628, Rapid Nagar, Kunrathur High Road, Gerugambakkam, Chennai – 602128. Tamil Nadu - India
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 shrink-0 text-sky-300" />
              <span className="hidden md:inline text-slate-100">9025130103</span>
              <a
                href="tel:9025130103"
                className="inline md:hidden text-slate-100 transition-colors hover:text-sky-300"
              >
                9025130103
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 shrink-0 text-sky-300" />
              <a href="mailto:info@cryoscientific.com" className="text-slate-100 transition-colors hover:text-sky-300">
                info@cryoscientific.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sky-300/15 bg-[#06111f] py-6 text-center text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Cryo Scientific Systems Pvt Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-sky-300">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-sky-300">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

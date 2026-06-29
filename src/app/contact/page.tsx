'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
const TaikoScrollBackground = dynamic(() => import('@/components/animations/TaikoScrollBackground'), { ssr: false });
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Cpu,
  Globe,
  Settings,
  Megaphone,
  Hammer
} from 'lucide-react';

// Department Directory Details
const departments = [
  {
    name: "R&D Department",
    head: "Dinesh Nagarajan (Head)",
    email: "rnd@cryoscientific.com",
    phone: "6374115904",
    icon: Cpu,
    color: "text-red-500 bg-red-500/10"
  },
  {
    name: "Sales Department",
    head: "Nandhini.N (Head of Accounts & Sales)",
    email: "sales@cryoscientific.com",
    phone: "8248122837",
    icon: Globe,
    color: "text-sky-500 bg-sky-500/10"
  },
  {
    name: "Marketing Department",
    head: "Nandhini.N (Head of Accounts & Sales)",
    email: "marketing@cryoscientific.com",
    phone: "8248116517",
    icon: Megaphone,
    color: "text-purple-500 bg-purple-500/10"
  },
  {
    name: "Accounts Department",
    head: "Nandhini.N (Head of Accounts & Sales)",
    email: "accounts@cryoscientific.com",
    phone: "9025130103",
    icon: Building2,
    color: "text-emerald-500 bg-emerald-500/10"
  }
];

function ContactPageContent() {
  const searchParams = useSearchParams();
  const initialRequirement = searchParams.get('requirement') || '';

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    requirement: initialRequirement,
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [mapVisible, setMapVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Non-overlapping scroll thresholds for clean visual transitions
  // Section 1 (Hero) scrolls out
  const heroOpacity = useTransform(scrollY, [0, 250], [1, 0]);
  const heroY = useTransform(scrollY, [0, 250], [0, -50]);
  const heroBlur = useTransform(scrollY, [0, 200], ['blur(0px)', 'blur(6px)']);

  // Section 2 (Corporate Information) fades in, stays visible, and fades out completely before Section 3
  const infoOpacity = useTransform(scrollY, [150, 350, 950, 1100], [0, 1, 1, 0]);
  const infoY = useTransform(scrollY, [150, 350, 950, 1100], [60, 0, 0, -60]);

  // Section 3 (Form Section) starts fading in ONLY after the flowing lines transition finishes (after 1400px scroll)
  // Animation slides in horizontally from the right (x: 300px to 0px)
  const formOpacity = useTransform(scrollY, [1400, 1550], [0, 1]);
  const formX = useTransform(scrollY, [1400, 1550], [300, 0]);

  // Sync state if search parameter changes
  useEffect(() => {
    const req = searchParams.get('requirement');
    if (req) {
      setFormData(prev => ({ ...prev, requirement: req }));
    }
  }, [searchParams]);

  // Update map visual entry and footer visibility based on exact scroll threshold
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      // Reveal Map after contact form starts appearing
      if (latest > 1500) {
        setMapVisible(true);
      } else {
        setMapVisible(false);
      }
    });
    return () => unsubscribe();
  }, [scrollY]);

  // Global footer visibility and blur control
  useEffect(() => {
    const globalFooter = document.querySelector('footer');
    if (globalFooter) {
      globalFooter.style.transition = 'opacity 0.8s ease, filter 0.8s ease';
      if (footerVisible) {
        globalFooter.style.opacity = '1';
        globalFooter.style.filter = 'blur(0px)';
        globalFooter.style.pointerEvents = 'auto';
      } else {
        globalFooter.style.opacity = '0';
        globalFooter.style.filter = 'blur(8px)';
        globalFooter.style.pointerEvents = 'none';
      }
    }
    return () => {
      if (globalFooter) {
        globalFooter.style.opacity = '';
        globalFooter.style.filter = '';
        globalFooter.style.pointerEvents = '';
      }
    };
  }, [footerVisible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      setErrorMsg('Name, Phone, and Email are required.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          name: '',
          companyName: '',
          phone: '',
          email: '',
          requirement: '',
          message: ''
        });
      } else {
        const data = await response.json();
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch (err) {
      setErrorMsg('Connection error. Please check your network and try again.');
      setStatus('error');
    }
  };

  return (
    <div ref={containerRef} className="relative font-sans pt-24 min-h-screen overflow-x-hidden">
      <TaikoScrollBackground />

      {/* SECTION 1: Hero Contact Experience - Absolute positioned to resolve empty space spacing */}
      <motion.section
        style={{ opacity: heroOpacity, y: heroY, filter: heroBlur }}
        className="absolute top-24 left-0 w-full h-[80vh] flex flex-col justify-center items-center text-white z-10 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto px-6 text-center pointer-events-auto">
          <span className="px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-sky-500/10 text-sky-300 border border-sky-500/20">
            Contact Directory
          </span>
          <h1 className="font-hanken font-extrabold text-4xl md:text-6xl tracking-tight leading-tight mt-6 max-w-3xl mx-auto bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-sky-200">
            Get in Touch with Our Specialists
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-base md:text-lg text-sky-200/70 leading-relaxed font-light font-sans">
            Reach out directly to our specialized corporate departments or submit your technical specifications to get a tailored quote.
          </p>
        </div>

        {/* Animated Scroll Down Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto">
          <span className="text-[10px] uppercase tracking-[0.25em] text-sky-300/50 font-bold">
            Scroll Down
          </span>
          <div className="w-[18px] h-[30px] rounded-full border border-sky-300/30 flex justify-center p-1">
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-1.5 h-1.5 bg-sky-300 rounded-full"
            />
          </div>
        </div>
      </motion.section>

      {/* Spacer to offset scrolling so Section 2 moves up directly to overlay the fading Hero */}
      <div className="h-[75vh] pointer-events-none" />

      {/* SECTION 2: Corporate Information Reveal */}
      <motion.section
        style={{ opacity: infoOpacity, y: infoY }}
        className="py-16 relative z-10 max-w-6xl mx-auto px-6 flex flex-col gap-12 min-h-[90vh] justify-center overflow-visible"
      >
        {/* Headquarters Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-panel border-gray-200/50 p-6 rounded-2xl bg-white/70 shadow-sm"
          >
            <MapPin className="w-5 h-5 text-secondary mb-3" />
            <strong className="text-dark block mb-2 text-sm">Office Address</strong>
            <a
              href="https://maps.google.com/?q=2/628,+Rapid+Nagar,+Kunrathur+High+Road,+Gerugambakkam,+Chennai+-+600128"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-600 hover:text-secondary leading-relaxed transition-colors block"
            >
              2/628, Rapid Nagar, Kunrathur High Road, Gerugambakkam, Chennai – 600128. Tamil Nadu - India
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel border-gray-200/50 p-6 rounded-2xl bg-white/70 shadow-sm"
          >
            <Phone className="w-5 h-5 text-secondary mb-3" />
            <strong className="text-dark block mb-2 text-sm">Phone Enquiries</strong>
            <span className="hidden md:inline text-xs text-gray-600 leading-relaxed">
              9025130103
            </span>
            <a
              href="tel:9025130103"
              className="inline md:hidden text-xs text-secondary hover:underline leading-relaxed block"
            >
              9025130103
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-panel border-gray-200/50 p-6 rounded-2xl bg-white/70 shadow-sm"
          >
            <Mail className="w-5 h-5 text-secondary mb-3" />
            <strong className="text-dark block mb-2 text-sm">Corporate Email</strong>
            <a href="mailto:info@cryoscientific.com" className="text-xs text-secondary hover:underline block leading-relaxed">
              info@cryoscientific.com
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-panel border-gray-200/50 p-6 rounded-2xl bg-white/70 shadow-sm"
          >
            <Clock className="w-5 h-5 text-secondary mb-3" />
            <strong className="text-dark block mb-2 text-sm">Business Hours</strong>
            <p className="text-xs text-gray-600 leading-relaxed">
              Monday – Saturday: 9:30 AM – 6:00 PM IST (Sundays Closed)
            </p>
          </motion.div>
        </div>

        {/* Department Directory */}
        <div className="mt-4">
          <h3 className="font-hanken font-bold text-xl text-dark mb-6 text-center">
            Department Directory
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, idx) => {
              const Icon = dept.icon;
              return (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * idx }}
                  className="glass-panel border-gray-200/50 p-5 rounded-2xl flex items-start gap-4 hover:border-primary/10 transition-colors bg-white/75"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${dept.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-xs md:text-sm">
                    <h4 className="font-hanken font-bold text-dark">{dept.name}</h4>
                    <span className="text-gray-500 font-medium mt-0.5 block text-[11px]">{dept.head}</span>
                    <div className="flex flex-col gap-1 mt-2 text-gray-600 text-xs">
                      <a href={`mailto:${dept.email}`} className="text-secondary hover:underline flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{dept.email}</span>
                      </a>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{dept.phone}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Spacing spacer block representing the 300px transition journey of Flowing Lines & camera fly-through */}
      <div className="h-[40vh]" />

      {/* SECTION 3: Contact Form Reveal (Slides in from Right) */}
      <motion.section
        style={{ opacity: formOpacity, x: formX }}
        className="py-16 relative z-10 max-w-3xl mx-auto px-6 min-h-[90vh] flex items-center"
      >
        <div className="glass-panel border-gray-200 rounded-3xl p-8 md:p-10 shadow-xl bg-white/95 w-full">
          <h2 className="font-hanken font-bold text-2xl text-dark mb-2">
            Consultation & RFQ Form
          </h2>
          <p className="text-gray-500 text-xs mb-8">
            Fields marked with (*) are required for technical analysis.
          </p>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 flex flex-col items-center justify-center"
            >
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
              <h3 className="font-hanken font-bold text-dark text-xl">
                Form Submitted Successfully
              </h3>
              <p className="text-gray-600 text-sm mt-3 max-w-sm">
                Thank you. Your message has been sent to our sales and technical divisions. A representative will contact you shortly.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-8 px-6 py-2.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Submit Another Request
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-dark placeholder-gray-400 focus:bg-white focus:border-secondary outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                {/* Company Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Company / Institution
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-dark placeholder-gray-400 focus:bg-white focus:border-secondary outline-none transition-all"
                    placeholder="Medical Research Lab"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Phone */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-dark placeholder-gray-400 focus:bg-white focus:border-secondary outline-none transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-dark placeholder-gray-400 focus:bg-white focus:border-secondary outline-none transition-all"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              {/* Requirement */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-600 uppercase">
                  Equipment Requirement
                </label>
                <input
                  type="text"
                  value={formData.requirement}
                  onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-dark placeholder-gray-400 focus:bg-white focus:border-secondary outline-none transition-all"
                  placeholder="e.g., Blood Bank Refrigerator 360 Bags"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-600 uppercase">
                  Message / Specifications Details
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-dark placeholder-gray-400 focus:bg-white focus:border-secondary outline-none transition-all resize-none"
                  placeholder="Outline any special capacity, door configuration or monitoring sensor requirements..."
                />
              </div>

              {status === 'error' && (
                <span className="text-red-500 text-xs font-semibold">{errorMsg}</span>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-accent text-white font-semibold text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{status === 'loading' ? 'Submitting Form...' : 'Submit Inquiry'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </motion.section>

      {/* SECTION 4: Map Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={mapVisible ? { opacity: 0.9, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        onViewportEnter={() => setFooterVisible(true)}
        className="h-[450px] w-full relative z-10 mt-12"
      >
        <iframe
          src="https://maps.google.com/maps?q=Cryo%20Scientific%20Systems%20Pvt%20Ltd,%202/628,%20Rapid%20Nagar,%20Kunrathur%20High%20Road,%20Gerugambakkam,%20Chennai%20-%20602128&t=&z=15&ie=UTF8&iwloc=&output=embed"
          className="absolute inset-0 w-full h-full border-0 opacity-100"
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Rapid Nagar Gerugambakkam Map"
        />
      </motion.section>

    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Contact Directory...</div>}>
      <ContactPageContent />
    </Suspense>
  );
}

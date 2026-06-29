'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical,
  ThermometerSnowflake,
  Database,
  HeartPulse,
  ArrowRight,
  Award,
  Gift
} from 'lucide-react';
import SectionHeading from '@/components/common/SectionHeading';
import { testimonials } from '@/data/testimonials';
import dynamic from 'next/dynamic';
const LightRays = dynamic(() => import('@/components/animations/LightRays'), { ssr: false });
const CircularTestimonials = dynamic(() => import('@/components/animations/CircularTestimonials'), { ssr: false });
const TiltedCard = dynamic(() => import('@/components/animations/titltedcard'), { ssr: false });

// Slider items for Hero Right
const sliderItems = [
  {
    title: "Ultra-Low Freezer",
    description: "-86°C Stability • Dual Cooling System",
    imageUrl: "/product logo/new_gen_ultra_-86.png",
    badge: "NewGen Ultra"
  },
  {
    title: "Blood Bag Refrigerator",
    description: "4°C Precision • Redundant Backup",
    imageUrl: "/product logo/BBR.png",
    badge: "Precision Series"
  },
  {
    title: "Heating & Cooling Circulator",
    description: "-40°C to +200°C • Precise Thermal Control",
    imageUrl: "/product logo/he&co.png",
    badge: "HCC-40"
  }
];

// Domains list
const domains = [
  {
    title: "Blood Bank Solutions",
    description: "Advanced refrigerators and freezers engineered to protect plasma and critical blood components under strict WHO standards.",
    icon: HeartPulse,
    iconColor: "text-red-500",
    accentColor: "#ef4444",
    badge: "Validated Cooling",
    link: "/products?tab=blood-bank"
  },
  {
    title: "Laboratory Equipment",
    description: "Reliable CO2 incubators and Class II biosafety cabinets to deliver sterilized, optimal research testing environments.",
    icon: FlaskConical,
    iconColor: "text-emerald-500",
    accentColor: "#10b981",
    badge: "Controlled Environments",
    link: "/products?tab=laboratory"
  },
  {
    title: "Cryogenic Systems",
    description: "Liquid Nitrogen storage and transportation vessels built to operate safely in temperatures as low as -196°C.",
    icon: ThermometerSnowflake,
    iconColor: "text-sky-500",
    accentColor: "#0ea5e9",
    badge: "Deep Cold Chain",
    link: "/products?tab=cryogenic-accessories"
  },
  {
    title: "Upcoming Products",
    description: "Discover our latest high-efficiency innovations, wrapped and delivered with care. Custom engineered units tailored to your requirements.",
    icon: Gift,
    iconColor: "text-amber-400",
    accentColor: "#f59e0b",
    badge: "Coming Soon",
    link: "/new-arrivals"
  }
];

const clientPartners = [
  { name: "ICMR (Indian Council of Medical Research)", logo: "/images/icmr.png" },
  { name: "NIO (National Institute of Oceanography)", logo: "/National_Institute_of_Oceanography_logo.jpeg" },
  { name: "UNOPS", logo: "/unops logo.png" },
  { name: "CSIR", logo: "/csir.svg" },
  { name: "Apollo Hospitals", logo: "/Apollo_Hospitals_Logo.svg.png" },
  { name: "Zydus Cadila", logo: "/zydus cadilla.png" },
  { name: "TTK Healthcare", logo: "/TTK-Healthcare.jpg" },
  { name: "Merck", logo: "/Merck_Logo.svg" },
  { name: "Narayana Nethralaya", logo: "/narayana_nethralaya.webp" },
  { name: "HAL (Hindustan Aeronautics Limited)", logo: "/Hindustan_Aeronautics_Limited_Logo.svg.png" },
  { name: "Huawei", logo: "/Huawei-Vertical-Logo.wine.svg" },
  { name: "Natco Pharma", logo: "/Natco_Pharma_Logo.svg.png" },
  { name: "Richcore", logo: "/richcore.png" },
  { name: "Semler Research Center", logo: "/semler research center.jpg" },
  { name: "Poonawalla Group", logo: "/poonawala group.jpg" },
  { name: "Sun Pharmaceutical Industries", logo: "/Sun_Pharmaceutical_Logo.svg.png" },
  { name: "Premas Biotech", logo: "/premas-biotech.svg" },
  { name: "NCCS (National Centre for Cell Science)", logo: "/national_centre_for_cell_science.png" },
  { name: "Navitas Life Sciences", logo: "/Navitas-Logo-WOtagline.webp" },
  { name: "TATA MD", logo: "/tata md.webp" },
  { name: "NIHSAD", logo: "/nihsad.jpeg" },
  { name: "IARI (Indian Agricultural Research Institute)", logo: "/Indian_Agricultural_Research_Institute_Logo.png" },
  { name: "Family Care Ltd", logo: "/family care pv ltd.png" },
  { name: "Orchid Pharma Ltd", logo: "/images/orchid.jpg" },
  { name: "Gland Pharma Limited", logo: "/images/gland.jpeg" },
  { name: "Laurus Bio", logo: "/images/lauras.png" },
  { name: "Appasamy Ocular Devices (P) Ltd", logo: "/images/aod.jpeg" },
  { name: "Symbiotec Pharmalab Pvt Ltd", logo: "/images/symbiotec.jpeg" },
  { name: "Esjay Pharma Private Limited", logo: "/images/esjay.png" },
  { name: "SGS India Private Limited", logo: "/images/sgs.webp" },
  { name: "Malladi Drugs and Pharmaceuticals Limited", logo: "/images/malladi.jpg" },
  { name: "Nuray Chemicals Private Limited", logo: "/images/nuray.jpeg" },
  { name: "Par Active Technologies", logo: "/images/par.jpeg" },
  { name: "Ecron Acunova Ltd", logo: "/images/ecron.webp" },
  { name: "Embio Limited", logo: "/images/embio.png" },
  { name: "OncoStem Diagnostics Private Limited", logo: "/images/oncostem.png" },
  { name: "Scitus Pharma Services Private Limited", logo: "/images/sictus.png" },
  { name: "Siemens Healthcare Private Limited", logo: "/images/siemens.png" }
];

// Background components state is clean



export default function HomePage() {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [particles, setParticles] = useState<{ id: number; size: string; left: string; top: string; opacity: number; tx: number; ty: number; duration: number }[]>([]);

  // Auto-play product card slider
  useEffect(() => {
    const timer = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % sliderItems.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const generated = Array.from({ length: 20 }).map((_, i) => {
      const size = Math.random() * 4 + 2 + 'px';
      return {
        id: i,
        size,
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        opacity: Math.random() * 0.5,
        tx: (Math.random() - 0.5) * 100,
        ty: (Math.random() - 0.5) * 100,
        duration: Math.random() * 3 + 3,
      };
    });
    setParticles(generated);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-on-background">
      {/* SECTION 1 - HERO */}

      <section className="silk-bg relative min-h-[95vh] flex flex-col items-center justify-center pt-28 pb-20 px-6 overflow-hidden">
        <div className="light-ray" />
        <div className="absolute inset-0 pointer-events-none z-1">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute bg-white/20 rounded-full"
              style={{
                width: p.size,
                height: p.size,
                left: p.left,
                top: p.top,
              }}
              animate={{
                x: [0, p.tx],
                y: [0, p.ty],
                opacity: [p.opacity, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Scrolling Support Marquee Ticker */}
        <div className="w-full py-2 relative z-30 overflow-hidden -mt-6 mb-12">
          <div className="w-full flex items-center overflow-hidden whitespace-nowrap relative">
            <motion.div
              animate={{ x: ["100%", "-100%"] }}
              transition={{ ease: "linear", duration: 25, repeat: Infinity }}
              className="inline-block font-medium text-[11px] md:text-xs text-cyan-200/90 tracking-wider"
            >
              ⚠️ NOTICE: Kindly fill out our Customer Support Form for any complaints or queries regarding the products.
              <Link href="/support" className="text-white underline hover:text-cyan-300 font-bold ml-2 transition-colors">
                Open Support Desk →
              </Link>
            </motion.div>
          </div>
        </div>



        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10 w-full">

          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col justify-center text-dark">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-semibold text-secondary tracking-widest uppercase mb-6 w-fit"
            >
              <Award className="w-4 h-4 text-accent" />
              <span>25+ Years of Engineering Excellence</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-hanken font-extrabold text-4xl sm:text-6xl tracking-tight leading-[1.1] mb-6 text-white"
            >
              Advanced Cryogenic &<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-secondary">
                Scientific Solutions
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-sans text-base sm:text-lg text-white mb-8 max-w-2xl leading-relaxed"
            >
              Delivering innovative laboratory, blood bank, healthcare and cryogenic equipment solutions trusted by leading research institutions and hospitals across India.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link
                href="/contact"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-secondary to-accent hover:from-accent hover:to-secondary text-white font-semibold shadow-lg shadow-secondary/20 transition-all duration-300 text-center"
              >
                Request Consultation
              </Link>
              <Link
                href="/products"
                className="px-8 py-4 rounded-xl bg-white hover:bg-blue-50 border border-blue-100 text-dark font-semibold transition-all duration-300 text-center"
              >
                Explore Products
              </Link>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-gray-200 pt-8"
            >
              <div>
                <span className="block text-3xl font-extrabold font-hanken text-white">25+</span>
                <span className="text-xs text-white font-medium">Years Experience</span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold font-hanken text-white">500+</span>
                <span className="text-xs text-white font-medium">Installations</span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold font-hanken text-white">100+</span>
                <span className="text-xs text-white font-medium">Institutions Served</span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold font-hanken text-white">24/7</span>
                <span className="text-xs text-white font-medium">Technical Support</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Right Slide Panel */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center relative z-10">
            <div className="relative w-full max-w-md h-[550px] animate-float">
              <div className="relative w-full h-full">
                <AnimatePresence mode="wait">
                  {sliderItems.map((item, idx) => {
                    if (idx !== sliderIndex) return null;
                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 w-full h-full"
                      >
                        <div className="p-8 flex flex-col items-center justify-center text-center h-full relative group">
                          <div className="absolute top-4 right-4 bg-primary/20 border border-primary/30 text-white text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                            {item.badge}
                          </div>

                          <div className="relative w-full h-96 flex items-center justify-center mb-8" style={{ perspective: 1000 }}>
                            {/* Blurred background rotating copy */}
                            <motion.img
                              key={item.imageUrl + "-bg"}
                              alt={item.title}
                              src={item.imageUrl}
                              initial={{ opacity: 0, scale: 0.3, filter: "blur(12px)", z: -300 }}
                              animate={{
                                opacity: 0.25,
                                scale: 0.5,
                                filter: "blur(8px)",
                                z: -200,
                                rotateY: 360
                              }}
                              exit={{ opacity: 0 }}
                              transition={{
                                rotateY: { repeat: Infinity, duration: 18, ease: "linear" },
                                default: { duration: 0.8 }
                              }}
                              className="absolute object-contain select-none pointer-events-none"
                              style={{ height: '240px' }}
                            />

                            {/* Main active foreground image */}
                            <motion.img
                              key={item.imageUrl}
                              alt={item.title}
                              src={item.imageUrl}
                              initial={{ opacity: 0, scale: 0.1, rotateY: -180, filter: "blur(20px)", z: -400 }}
                              animate={{
                                opacity: 1,
                                scale: 1.15,
                                rotateY: 0,
                                filter: "blur(0px)",
                                z: 0,
                              }}
                              exit={{ opacity: 0, scale: 0.1, rotateY: 180, filter: "blur(20px)", z: -400 }}
                              transition={{
                                type: "spring",
                                stiffness: 75,
                                damping: 15,
                                duration: 0.8
                              }}
                              whileHover={{ scale: 1.22 }}
                              className="w-full h-full object-contain filter drop-shadow-[0_30px_30px_rgba(0,0,0,0.6)] z-10 cursor-pointer"
                            />
                          </div>

                          <h3 className="font-hanken font-bold text-2xl text-white mb-2">
                            {item.title}
                          </h3>
                          <p className="text-sm text-white/60">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Slider Indicators */}
              <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-3">
                {sliderItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSliderIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === sliderIndex ? 'w-6 bg-secondary' : 'w-2 bg-white/20'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2 - DOMAIN EXPERTISE */}
      <section className="py-24 bg-gradient-to-b from-[#E6F4FE] via-[#F0F9FF] to-[#E6F4FE] border-y border-blue-100/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="Engineering Solutions"
            title="Sectors of Specialized Expertise"
            subtitle="We engineer specialized high-stability temperature controls and containment devices serving crucial clinical, diagnostic, and manufacturing pipelines."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {domains.map((domain, index) => {
              const Icon = domain.icon;
              return (
                <motion.div
                  key={domain.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="h-full max-w-[360px] mx-auto w-full"
                >
                  <TiltedCard
                    imageSrc=""
                    altText={domain.title}
                    captionText=""
                    containerHeight="520px"
                    imageHeight="520px"
                    imageWidth="100%"
                    scaleOnHover={1.04}
                    rotateAmplitude={10}
                    showMobileWarning={false}
                    showTooltip={false}
                    displayOverlayContent={true}
                    hideImage={true}
                    overlayContent={
                      <div
                        className={`flex h-[520px] w-full flex-col justify-between overflow-hidden rounded-[15px] p-6 shadow-[0_30px_80px_rgba(11,61,145,0.28)] relative border ${domain.title === "New Arrivals"
                          ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-amber-50 border-blue-200 text-black shadow-blue-900/5'
                          : 'bg-gradient-to-br from-[#08234a] via-[#0b3d91] to-[#1677ff] border-white/15 text-white'
                          }`}
                        style={{
                          backgroundImage: domain.title === "Upcoming Products"
                            ? `radial-gradient(circle at 85% 18%, ${domain.accentColor}22 0, ${domain.accentColor}22 18%, transparent 19%), linear-gradient(135deg, #08234a 0%, #61c0ffff 58%, #1677ff 100%)`
                            : `radial-gradient(circle at 85% 18%, ${domain.accentColor}44 0, ${domain.accentColor}44 18%, transparent 19%), linear-gradient(135deg, #08234a 0%, #0b3d91 58%, #1677ff 100%)`,
                        }}
                      >
                        {/* Background looping video specifically for New Arrivals card */}
                        {domain.title === "Upcoming Products" && (
                          <video
                            src="/new arrival.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none z-0"
                          />
                        )}

                        <div className="flex items-start justify-between gap-4 z-10">
                          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] backdrop-blur-sm ${domain.title === "New Arrivals"
                            ? 'border-blue-300 bg-blue-100/50 text-blue-800'
                            : 'border-white/20 bg-white/10 text-white/90'
                            }`}>
                            {domain.badge}
                          </span>
                          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border backdrop-blur-sm ${domain.title === "Upcoming Products"
                            ? 'border-blue-300 bg-blue-100/50 text-white'
                            : `border-white/15 bg-white/10 ${domain.iconColor}`
                            }`}>
                            {domain.title === "Upcoming Products" ? (
                              <motion.div
                                className="relative w-8 h-8 flex items-center justify-center scale-90"
                                animate={{
                                  y: [0, -3, 0],
                                  rotate: [0, 6, -6, 0]
                                }}
                                transition={{
                                  y: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
                                  rotate: { repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.1 }
                                }}
                              >
                                {/* Bow Loops */}
                                <div className="absolute -top-1.5 left-1 w-3 h-3 bg-red-500 rounded-full border-2 border-red-600 -rotate-45 z-10" />
                                <div className="absolute -top-1.5 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-red-600 rotate-45 z-10" />
                                <div className="absolute -top-0.5 w-1.5 h-1.5 bg-red-600 rounded-full z-20" />

                                {/* Box Lid */}
                                <div className="absolute top-1.5 w-7 h-2 bg-amber-300 rounded-sm z-20 shadow-sm" />

                                {/* Box Body */}
                                <div className="absolute top-3.5 w-6 h-4 bg-gradient-to-br from-amber-400 to-amber-500 rounded-b-sm z-10 shadow" />

                                {/* Ribbons */}
                                <div className="absolute top-1.5 bottom-0.5 w-1.5 bg-red-500 left-1/2 -translate-x-1/2 z-20" />
                                <div className="absolute top-[17px] left-1 w-6 h-1 bg-red-500 z-20" />
                              </motion.div>
                            ) : (
                              <Icon className="h-6 w-6" />
                            )}
                          </div>
                        </div>

                        <div className="space-y-4 z-10">
                          <div className="min-h-[56px] flex items-end">
                            <h3 className={`font-hanken text-xl lg:text-2xl font-extrabold tracking-tight leading-tight ${domain.title === "Upcoming Products" ? 'text-black' : 'text-white'
                              }`}>
                              {domain.title}
                            </h3>
                          </div>
                          <div className="min-h-[110px]">
                            <p className={`max-w-xs text-xs sm:text-sm leading-6 ${domain.title === "Upcoming Products" ? 'text-blue-900 font-semibold' : 'text-white/80'
                              }`}>
                              {domain.description}
                            </p>
                          </div>
                          <Link
                            href={domain.link}
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition w-fit ${domain.title === "Upcoming Products"
                              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/10'
                              : 'border border-white/20 bg-white/10 text-white hover:bg-white hover:text-[#0B3D91]'
                              }`}
                          >
                            <span>View Equipment</span>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    }
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3 - CLIENT MARQUEE CAROUSEL */}
      <section className="relative overflow-hidden py-20 bg-[linear-gradient(135deg,rgba(8,35,74,0.96),rgba(11,61,145,0.94),rgba(22,119,255,0.9))]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-48 w-[32rem] -translate-x-1/2 rounded-full bg-[#1677ff]/15 blur-3xl" />
          <div className="absolute bottom-0 left-12 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="absolute right-10 top-16 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="Trusted Partners"
            title="Organizations We Proudly Serve"
            subtitle="Trusted by leading hospitals, research institutes, pharmaceutical companies, and government organizations across India."
            light
          />

          <div className="group relative mt-14 overflow-hidden rounded-[2rem] border border-white/20 bg-[linear-gradient(135deg,rgba(8,35,74,0.96),rgba(11,61,145,0.94),rgba(22,119,255,0.9))] py-6 shadow-[0_35px_120px_rgba(7,27,52,0.28)] backdrop-blur-xl md:py-7">
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_48%,rgba(125,211,252,0.18),transparent_36%),radial-gradient(circle_at_50%_110%,rgba(255,255,255,0.14),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.12),transparent_18%,transparent_78%,rgba(2,12,27,0.28)_100%)]" />
            <div className="pointer-events-none absolute inset-x-6 top-0 h-10 rounded-b-[2rem] bg-gradient-to-b from-white/18 to-transparent blur-md" />
            <div className="pointer-events-none absolute inset-x-8 bottom-0 h-14 rounded-t-[2rem] bg-gradient-to-t from-[#031120]/45 to-transparent blur-md" />
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] shadow-[inset_0_2px_0_rgba(255,255,255,0.16),inset_0_-18px_45px_rgba(3,17,32,0.34),inset_18px_0_30px_rgba(4,20,44,0.22),inset_-18px_0_30px_rgba(37,99,235,0.16)]" />

            <div className="flex w-max gap-5 whitespace-nowrap animate-[marquee_38s_linear_infinite] group-hover:[animation-play-state:paused] md:gap-7">
              {[0, 1].map((loop) => (
                <div key={loop} className="flex gap-5 md:gap-7">
                  {clientPartners.map((client) => (
                    <a
                      key={`${loop}-${client.name}`}
                      href={`https://www.google.com/search?q=${encodeURIComponent(client.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/card flex h-[196px] w-[214px] shrink-0 flex-col rounded-[1.75rem] border border-white/15 bg-gradient-to-br from-white/12 to-white/3 p-4 text-center shadow-[0_18px_40px_rgba(8,35,74,0.2)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:border-accent/40 hover:from-white/18 hover:to-white/6 hover:shadow-[0_24px_55px_rgba(22,119,255,0.35)] sm:h-[204px] sm:w-[228px] md:h-[216px] md:w-[240px] md:p-5 cursor-pointer block"
                    >
                      <div className="relative flex h-[118px] w-full items-center justify-center rounded-2xl border border-white/12 bg-white px-4 shadow-sm sm:h-[124px] md:h-[132px] overflow-hidden">
                        {client.logo ? (
                          <Image
                            src={client.logo}
                            alt={`${client.name} logo`}
                            width={140}
                            height={72}
                            className="max-h-[72px] w-auto max-w-full object-contain sm:max-h-[78px] md:max-h-[84px] group-hover/card:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center">
                            <span className="text-[#2563EB] font-bold text-3xl tracking-normal">
                              {client.name.split(/[\s-]/).filter(Boolean).map(w => w[0]).join('').slice(0, 3).toUpperCase()}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 max-w-[150px] truncate">
                              {client.name}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 items-center justify-center px-2">
                        <p className="font-hanken text-[15px] font-semibold leading-[1.35] tracking-[0.01em] text-white/95 [text-wrap:balance] sm:text-[15px] md:text-base">
                          {client.name}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* SECTION 4 - TESTIMONIALS SLIDER */}
      <section className="relative overflow-hidden py-24 bg-[linear-gradient(135deg,rgba(8,35,74,0.96),rgba(11,61,145,0.94),rgba(22,119,255,0.9))]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-16 h-64 w-[34rem] -translate-x-1/2 rounded-full bg-[#38bdf8]/12 blur-3xl" />
          <div className="absolute left-10 top-1/3 h-56 w-56 rounded-full bg-[#1677ff]/10 blur-3xl" />
          <div className="absolute bottom-8 right-12 h-60 w-60 rounded-full bg-cyan-200/10 blur-3xl" />
        </div>

        <div className="relative z-10 w-full px-6">
          <SectionHeading
            badge="Social Proof"
            title="Institutional Endorsements"
            subtitle="Read reports from clinical facility administrators, research laboratory directors, and cryogenic laboratory operators across the country."
            light
          />

          <div className="relative mt-14 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,18,34,0.92),rgba(14,24,46,0.88))] p-4 shadow-[0_28px_90px_rgba(7,27,52,0.28)] md:p-5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent)]" />
            <div className="relative z-10 h-[390px] md:h-[460px]">
              <CircularTestimonials items={testimonials} autoSpeed={0.035} bend={0} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

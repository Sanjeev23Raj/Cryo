'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  History,
  Target,
  Eye,
  Cpu,
  Users,
  ShieldCheck,
  Factory,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import SectionHeading from '@/components/common/SectionHeading';
import CTA from '@/components/common/CTA';
import dynamic from 'next/dynamic';
const AboutBackground = dynamic(() => import('@/components/animations/AboutBackground'), { ssr: false });


// Timeline milestones
const timelineData = [
  {
    year: "2001",
    title: "Company Founded",
    description: "Cryo Scientific Systems started operations in Chennai with a focus on importing and servicing high-performance research refrigeration systems."
  },
  {
    year: "2007",
    title: "First Manufacturing Facility",
    description: "Inaugurated our first local manufacturing plant to assemble blood bank refrigerators and supply dewars locally, ensuring high-quality domestic production."
  },
  {
    year: "2013",
    title: "ISO Certification & R&D Center",
    description: "Achieved ISO 9001 certification and established a state-of-the-art testing facility for multi-barrier thermal testing."
  },
  {
    year: "2019",
    title: "WHO-GMP & CE compliance",
    description: "Introduced smart microcontroller-controlled blood bank systems with CE markings, matching strict international medical standards."
  },
  {
    year: "2026",
    title: "Silver Jubilee: 25 Years",
    description: "Celebrating 25+ years of delivering cryo-preservation, healthcare storage, and research solutions across India with over 500 major installations."
  }
];

// Core Values
const coreValues = [
  {
    title: "Scientific Precision",
    description: "Designing temperature controls and airflows to precision decimals, because clinical trials demand absolute consistency.",
    icon: Cpu
  },
  {
    title: "Patient & Institution Safety",
    description: "Our dual-monitoring alarms and backup battery systems ensure that blood components and tissue samples remain safeguarded 24/7.",
    icon: ShieldCheck
  },
  {
    title: "Custom Engineering",
    description: "Providing bespoke cooling chambers and liquid nitrogen supply dewars tailored for specific university laboratory configurations.",
    icon: Factory
  }
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax shifts for a "million dollar" web experience
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  const storyY = useTransform(scrollYProgress, [0.1, 0.4], [30, -30]);
  const timelineY = useTransform(scrollYProgress, [0.3, 0.7], [40, -40]);
  const missionY = useTransform(scrollYProgress, [0.5, 0.8], [30, -30]);
  const leadershipY = useTransform(scrollYProgress, [0.7, 1], [30, 0]);

  return (
    <div ref={containerRef} className="relative font-sans pt-24 text-white min-h-screen bg-transparent overflow-hidden">
      {/* High-Contrast Blue/Cyan Wormhole/Funnel Loop Canvas */}
      <AboutBackground />

      {/* Hero Banner */}
      <motion.section
        style={{ y: heroY }}
        className="relative py-24 overflow-hidden z-10"
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
          >
            About Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-hanken font-extrabold text-4xl md:text-6xl tracking-tight leading-tight mt-6 text-white text-shadow-md"
          >
            25 Years of Engineering Trust
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-2xl mx-auto mt-6 text-base md:text-lg text-sky-200/90 leading-relaxed"
          >
            Discover the legacy of Chennai's premier scientific manufacturer designing and supplying world-class cryogenic equipment since 2001.
          </motion.p>
        </div>
      </motion.section>

      {/* Company Story Section */}
      <motion.section
        style={{ y: storyY }}
        className="py-24 relative z-10 bg-white/90 backdrop-blur-md border-y border-sky-500/10"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col gap-6"
          >
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Our Story</span>
            <h2 className="font-hanken font-extrabold text-black text-3xl md:text-4xl  tracking-tight">
              Pioneering Cryogenic Solutions for a Modern India
            </h2>
            <p className="text-black/80 text-sm md:text-base leading-relaxed">
              Founded at the turn of the century in Chennai, India, CRYO SCIENTIFIC SYSTEMS PVT LTD has grown from a specialized servicing contractor into a prominent nationwide manufacturer of high-security blood preservation refrigerators, clinical incubators, and biological safety cabinets.
            </p>
            <p className="text-black/80 text-sm md:text-base leading-relaxed">
              We operate on a simple principle: scientific research and clinical environments cannot afford temperature fluctuations. By combining local, precision manufacturing with international raw materials and compliance standards, we deliver robust equipment designed to perform under demanding power grid conditions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6 grid grid-cols-2 gap-4"
          >
            <div className="bg-[#090f26]/80 border border-sky-500/20 backdrop-blur-md p-6 rounded-2xl flex flex-col justify-center shadow-lg hover:border-sky-500/40 transition-all duration-300">
              <span className="text-5xl font-extrabold font-hanken text-sky-400 block">25+</span>
              <span className="text-xs font-semibold text-sky-200 uppercase tracking-wider mt-2">Years of Legacy</span>
            </div>
            <div className="bg-[#090f26]/80 border border-sky-500/20 backdrop-blur-md p-6 rounded-2xl flex flex-col justify-center shadow-lg hover:border-cyan-500/40 transition-all duration-300">
              <span className="text-5xl font-extrabold font-hanken text-cyan-400 block">500+</span>
              <span className="text-xs font-semibold text-cyan-200 uppercase tracking-wider mt-2">Facilities Equipped</span>
            </div>
            <div className="bg-[#090f26]/80 border border-sky-500/20 backdrop-blur-md p-6 rounded-2xl flex flex-col justify-center col-span-2 shadow-lg hover:border-sky-500/40 transition-all duration-300">
              <h4 className="font-hanken font-bold text-white text-base">Key Collaborations</h4>
              <p className="text-sky-100/70 text-xs mt-1 leading-relaxed">
                Supplying vital conservation chambers to IITs, Apollo, JIPMER, and research setups across India.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>
      {/* Mission, Vision, Values */}
      <motion.section
        style={{ y: missionY }}
        className="py-24 relative z-10 "
      >
        <div className="max-w-7xl mx-auto px-6">

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="p-8 md:p-12 bg-[#090f26]/80 border border-sky-500/20 rounded-3xl shadow-2xl hover:border-sky-500/40 transition-all duration-500 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/0 via-sky-500/5 to-cyan-500/0 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(14,165,233,0.5)]">
                  <Target className="w-6 h-6" />
                </div>

                <h3 className="font-hanken text-white font-bold text-2xl mb-4">
                  Our Mission
                </h3>

                <p className="text-sky-100/85 text-sm md:text-base leading-relaxed">
                  To build high-stability preservation, storage, and cultivation
                  equipment using local engineering capability to deliver unmatched
                  safety margins to India's medical and scientific community.
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="p-8 md:p-12 bg-[#090f26]/80 border border-sky-500/20 rounded-3xl shadow-2xl hover:border-cyan-500/40 transition-all duration-500 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-sky-500/0 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                  <Eye className="w-6 h-6" />
                </div>

                <h3 className="font-hanken font-bold text-white text-2xl mb-4">
                  Our Vision
                </h3>

                <p className="text-sky-100/85 text-sm md:text-base leading-relaxed">
                  To establish Cryo Scientific as the leading brand for advanced
                  cryogenic preservation systems and laboratory refrigeration across
                  South Asia, recognized for quality engineering and responsive
                  service.
                </p>
              </div>
            </motion.div>

          </div>

          {/* Core Values */}
          <div className="">

            <h3 className="font-hanken font-bold text-2xl text-center text-white mb-10">
              Our Core Principles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {coreValues.map((val) => {
                const Icon = val.icon;

                return (
                  <motion.div
                    key={val.title}
                    whileHover={{ y: -8 }}
                    className="flex flex-col items-center text-center p-6 border border-sky-500/20 rounded-2xl bg-[#090f26]/80 backdrop-blur-md shadow-2xl hover:border-sky-500/40 transition-all duration-300"
                  >
                    <div className="relative z-10">

                      <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-300 flex items-center justify-center mb-4 mx-auto border border-sky-500/20">
                        <Icon className="w-6 h-6" />
                      </div>

                      <h4 className="font-hanken font-bold text-white text-lg mb-2">
                        {val.title}
                      </h4>

                      <p className="text-sky-100/70 text-xs leading-relaxed">
                        {val.description}
                      </p>

                    </div>
                  </motion.div>
                );
              })}

            </div>

          </div>

        </div>
      </motion.section>

      {/* Leadership Profile */}
      <motion.section
        style={{ y: leadershipY }}
        className="py-24 relative z-10 bg-white/90 border-t border-slate-100 shadow-xl backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            badge="Leadership"
            title="Scientific Directors"
            subtitle="Led by expert technical minds with decades of design experience in cryogenics and blood bank refrigeration."
            light={false}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Leader 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-white border border-slate-100 rounded-3xl p-8 text-center flex flex-col items-center shadow-md hover:border-blue-200 transition-all duration-300"
            >
              <div className="w-24 h-24 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
                <Users className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="font-hanken font-extrabold text-xl text-black">Mr. Narayanan. A</h3>
              <span className="text-xs text-blue-800 font-bold uppercase tracking-widest mt-1 block">Managing Director</span>
            </motion.div>

            {/* Leader 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-slate-100 rounded-3xl p-8 text-center flex flex-col items-center shadow-md hover:border-cyan-200 transition-all duration-300"
            >
              <div className="w-24 h-24 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
                <Briefcase className="w-12 h-12 text-cyan-600" />
              </div>
              <h3 className="font-hanken font-extrabold text-xl text-black">Ms.Nandhini.N</h3>
              <span className="text-xs text-cyan-800 font-bold uppercase tracking-widest mt-1 block">Sales,Service Support</span>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

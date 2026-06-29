'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Eye,
  Award,
  Calendar,
  Briefcase,
  Upload,
  Send,
  CheckCircle2,
  FileText,
  Clock,
  Cpu,
  Layers,
  Zap,
  TrendingUp,
  MapPin,
  FlameKindling,
  Smartphone,
  ChevronRight,
  BookOpen,
  Atom,
  ShieldCheck
} from 'lucide-react';
import SectionHeading from '@/components/common/SectionHeading';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const Strands = dynamic(() => import('@/components/animations/Strands'), { ssr: false });


// --- DATA STRUCTURES (EASILY CONFIGURABLE FOR ADMIN CONTROLS) ---

const milestones = [
  {
    year: "2018",
    title: "Inception of R&D Division",
    description: "Established a dedicated thermal simulation laboratory and test facility to pioneer next-generation cryogenic solutions."
  },
  {
    year: "2020",
    title: "Green Refrigerant Shift",
    description: "Successfully transitioned our entire freezer catalog to eco-friendly natural refrigerants (R290/R170), reducing GWP to near zero."
  },
  {
    year: "2022",
    title: "Patented Cascade Cooling System",
    description: "Pioneered a proprietary dual-compressor cascade system ensuring continuous -86°C cooling even if one loop fails."
  },
  {
    year: "2024",
    title: "IoT & Cloud Telemetry Launch",
    description: "Deployed the Smart IoT Telemetry module, allowing real-time monitoring of clinical freezers from any web dashboard."
  },
  {
    year: "2026",
    title: "AI-Diagnostics Integration",
    description: "Integrating ML-driven predictive diagnostics on the edge to warn labs of potential compressor wear weeks in advance."
  }
];

const currentProjects = [
  {
    title: "RFID-Enabled Smart Cryo-Racks",
    tag: "RFID & Logistics",
    status: "Beta Testing",
    progress: 85,
    tech: "Ultra-High Frequency RFID, Cold-Resistant Tags (-196°C)",
    timeline: "Q3 2026 Completion",
    description: "Developing automated sample inventory racks that read and update biological vial metadata at liquid nitrogen temperatures without manual handling."
  },
  {
    title: "AI Predictive Compressor Analytics",
    tag: "Machine Learning",
    status: "Active R&D",
    progress: 60,
    tech: "Edge ML, TensorFlow Micro, Multi-Sensor Telemetry",
    timeline: "Q4 2026 Pilot",
    description: "Deploying deep learning models directly on the freezer microprocessor to analyze current spikes, vibration patterns, and temperature recovery rates."
  },
  {
    title: "Near-Zero Boil-Off Helium Dewar",
    tag: "Thermodynamics",
    status: "Prototype Validation",
    progress: 72,
    tech: "Super Vacuum Insulation, Multi-Layer Reflective Barriers",
    timeline: "Q2 2027 Production",
    description: "Refining vacuum jacket architectures to achieve ultra-low vapor escape rates for clinical liquid helium storage vessels."
  }
];

const upcomingProjects = [
  {
    title: "Self-Calibrating Thermal Arrays",
    tag: "Sensor Networks",
    timeline: "2027 Roadmap",
    description: "Autonomous multi-node sensors that cross-calibrate temperature data against internal reference values, removing human verification overhead.",
    icon: Atom
  },
  {
    title: "Sub-150°C Stirling Cycle Cryo-Coolers",
    tag: "Green Cooling",
    timeline: "2028 Vision",
    description: "Replacing cascade compressors with oil-free helium-based Stirling piston coolers to achieve ultra-low temperatures with half the carbon footprint.",
    icon: FlameKindling
  },
  {
    title: "Universal Lab-Telemetry API Hub",
    tag: "Cloud Infrastructure",
    timeline: "2027 Roadmap",
    description: "An open API gateway that aggregates real-time telemetry from refrigerators, incubators, and centrifuges into hospital management software.",
    icon: Smartphone
  }
];

const rdProducts = [
  {
    name: "NewGen Touchscreen -86°C Freezer",
    category: "Ultra-Low Freezers",
    description: "Our crown jewel of R&D: featuring a premium 10-inch capacitive touch screen, continuous data logging, and advanced dual cooling loops.",
    image: "/product logo/new_gen_ultra_-86.png",
    brochureUrl: "https://drive.google.com/file/d/1JNy-5Js6p2NpXr0Sd5d5aMlKwpkgde0k/view?usp=drive_link",
    features: ["Dual compressor cascade redundancy", "Capacitive 10-inch HD visual dashboard", "Cellular telemetry backup built-in"]
  },
  {
    name: "Smart Telemetry IoT Module",
    category: "Telemetry & Software",
    description: "An add-on cellular transmitter designed in-house to stream real-time temperature, power state, and door logs to clinical administrators.",
    image: "/product logo/data_logger.jpeg",
    brochureUrl: "https://drive.google.com/file/d/1uQAM3LUCazVVNvKj6L3wPA_kqFRzSzDi/view?usp=sharing",
    features: ["Battery backup for power loss alert", "AES-256 cloud encryption standard", "Plug-and-play installation"]
  }
];

const careerOpenings = [
  {
    title: "Senior Thermodynamic Research Engineer",
    department: "Cryogenic Systems Design",
    location: "R&D Facility (Bangalore)",
    type: "Full-Time",
    requirements: "Master's/PhD in Thermal Engineering + 5 years experience in vacuum science or cascade refrigeration cycles."
  },
  {
    title: "Embedded Systems & IoT Developer",
    department: "Digital Connectivity",
    location: "R&D Facility (Bangalore)",
    type: "Full-Time",
    requirements: "Proficiency in C/C++, RTOS, ESP32 platforms, cellular modem communication protocols, and telemetry security standards."
  }
];

const events = [
  {
    title: "National Cold Chain Innovation Symposium 2026",
    type: "Seminar / Guest Speaker",
    date: "August 12-14, 2026",
    location: "Bangalore Exhibition Centre",
    description: "Our R&D director will present our research paper on 'Eco-Friendly Gaseous Refrigerants in Ultra-Low Storage Applications'."
  },
  {
    title: "Interactive Workshop: Smart Biorepositories",
    type: "Workshop",
    date: "October 05, 2026",
    location: "Cryo-Engineering Research Lab",
    description: "A hands-on workshop detailing how RFID tracking and cloud telemetry secure biological research files and vaccine safety."
  }
];



export default function RDPage() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'upcoming'>('current');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    message: '',
  });
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        message: '',
      });
      setFileName('');
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-[#051026] text-slate-100 overflow-x-hidden pt-24 font-sans" style={{ backgroundImage: 'radial-gradient(circle at 50% 30%, #0c2045 0%, #030a17 100%)' }}>

      {/* WebGL Strands Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <Strands
          colors={['#06B6D4', '#3B82F6', '#6366F1', '#0EA5E9']}
          count={7}
          speed={0.35}
          amplitude={1.1}
          waviness={1.4}
          thickness={0.8}
          scale={1.4}
          opacity={0.38}
          glow={2.8}
        />
      </div>

      {/* Dark overlay to increase contrast of text against background particles */}
      <div className="absolute inset-0 bg-[#030a17]/55 pointer-events-none z-0" />

      {/* HERO SECTION */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-xs font-bold text-blue-400 tracking-widest uppercase mb-6"
          >
            <Atom className="w-3.5 h-3.5 animate-spin" />
            <span>CRYO R&D DIVISION</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-hanken font-extrabold text-4xl md:text-7xl tracking-tight leading-[1.1] mb-6 text-white"
          >
            Pioneering the Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
              Thermodynamic Engineering
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-3xl mx-auto text-base md:text-xl text-slate-400 leading-relaxed mb-10"
          >
            Developing patent-pending cascade refrigeration loops, secure IoT telemetry dashboards, and high-efficiency vacuum chambers trusted by leading clinical research centers globally.
          </motion.p>
        </div>
      </section>

      {/* DEPARTMENT OVERVIEW & OBJECTIVES */}
      <section className="py-20 relative z-10 border-t border-slate-900/30 bg-white/80">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-2">ABOUT THE R&D CENTRE</span>
            <h2 className="font-hanken font-extrabold text-3xl md:text-4xl text-black mb-6">
              Engineering Reliability When Every Degree Counts
            </h2>
            <p className="text-black text-sm md:text-base leading-relaxed mb-6">
              Our Research & Development division operates at the intersection of thermal science and digital telemetry. We are committed to pushing the boundaries of cold chain security, building fail-safe cooling systems that preserve biological assets with absolute temperature uniformity.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-500/10 border border-black-500/20 flex items-center justify-center text-black font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-black text-sm">Key Expertise</h4>
                  <p className="text-black text-xs mt-1">Multi-stage cascade systems, vacuum containment, eco-friendly refrigerants.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-cyan-500/10 border border-black-500/20 flex items-center justify-center text-black font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-black text-sm">Recognitions & Patents</h4>
                  <p className="text-black text-xs mt-1">Innovative dual compressor fail-safe models, national utility certifications.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 bg-gradient-to-b from-blue-950/40 to-slate-950/40 border border-blue-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
            <h3 className="font-hanken font-bold text-xl text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span>R&D Objectives</span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0" />
                <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-white">Attract Investment:</strong> Showcasing innovative hardware solutions to secure long-term infrastructure funding.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0" />
                <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-white">Demonstrate Innovation:</strong> Committing to high-reliability thermodynamic systems that protect vaccines and lab assets.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0" />
                <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-white">Recruit Engineering Talent:</strong> Welcoming specialists eager to solve deep cold chain problems.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0" />
                <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-white">Continuous Advancements:</strong> Translating prototype tests into deployed, commercial scientific hardware.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="py-20 relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ y: -6 }}
            className="p-8 md:p-10 bg-slate-900/60 border border-blue-500/10 rounded-3xl shadow-xl flex flex-col justify-between hover:border-blue-500/25 transition-all duration-300 relative group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-hanken font-bold text-2xl text-white mb-4">R&D Vision</h3>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                To engineer intelligent refrigeration architectures and cloud-connected telemetry systems that set the global benchmark for cold chain durability, safety, and energy efficiency.
              </p>
            </div>
            <div className="mt-8 text-xs text-blue-400 font-semibold tracking-wider uppercase">Long-Term Vision</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="p-8 md:p-10 bg-slate-900/60 border border-cyan-500/10 rounded-3xl shadow-xl flex flex-col justify-between hover:border-cyan-500/25 transition-all duration-300 relative group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-hanken font-bold text-2xl text-white mb-4">R&D Mission</h3>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Pioneering green refrigerants, developing redundant dual cascade compressors, and building automated tracking networks that safeguard vaccines, blood bags, and biorepository specimens against ambient temperature failures.
              </p>
            </div>
            <div className="mt-8 text-xs text-cyan-400 font-semibold tracking-wider uppercase">Operational Mission</div>
          </motion.div>
        </div>
      </section>

      {/* R&D BACKGROUND TIMELINE */}
      <section className="py-20 relative z-10 bg-white/80 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="OUR JOURNEY"
            title="Evolution & Milestones"
            subtitle="The growth and achievements of our dedicated R&D laboratory over the years."
            light={false}
          />
          <div className="relative mt-16 border-l-2 border-blue-500/40 pl-8 ml-4 md:ml-20 flex flex-col gap-12 max-w-4xl mx-auto">
            {milestones.map((m, index) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline node */}
                <div className="absolute -left-[49px] top-0.5 w-8 h-8 rounded-full flex items-center justify-center border-2 border-blue-400 bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20">
                  {m.year}
                </div>
                <h3 className="font-hanken font-bold text-lg text-slate-900 mb-2">{m.title}</h3>
                <p className="text-slate-700 text-sm leading-relaxed max-w-2xl">{m.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION (CURRENT vs UPCOMING ROADMAP) */}
      <section className="py-20 relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-2">RESEARCH PIPELINE</span>
            <h2 className="font-hanken font-extrabold text-3xl md:text-4xl text-white">Project Roadmap</h2>
          </div>
          <div className="flex border-b border-slate-800 mt-6 md:mt-0 p-1 bg-slate-900/60 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${activeTab === 'current' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
            >
              Current Projects
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${activeTab === 'upcoming' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
            >
              Upcoming Projects (AI & RFID)
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'current' ? (
            <motion.div
              key="current"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {currentProjects.map((proj, idx) => (
                <div
                  key={proj.title}
                  onClick={() => setSelectedProject(selectedProject === idx ? null : idx)}
                  className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 hover:border-blue-500/30 transition-all cursor-pointer relative group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-widest">{proj.tag}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">{proj.status}</span>
                    </div>
                    <h3 className="font-hanken font-bold text-lg text-white group-hover:text-blue-300 transition-colors leading-snug mb-3">
                      {proj.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed mb-6">
                      {proj.description}
                    </p>
                  </div>

                  <div>
                    {/* Progress Bar */}
                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500">Development Progress</span>
                        <span className="text-blue-400">{proj.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${proj.progress}%` }} />
                      </div>
                    </div>

                    <div className="border-t border-slate-800/60 pt-4 text-[10px] text-slate-500 flex flex-col gap-1">
                      <div><strong className="text-slate-400">Technology:</strong> {proj.tech}</div>
                      <div className="flex items-center gap-1.5 mt-1 text-slate-400 font-semibold"><Clock className="w-3.5 h-3.5 text-blue-400" /> {proj.timeline}</div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="upcoming"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {upcomingProjects.map((proj) => {
                const Icon = proj.icon;
                return (
                  <div
                    key={proj.title}
                    className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 hover:border-cyan-500/30 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest">{proj.tag}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-400/20">{proj.timeline}</span>
                      </div>
                      <h3 className="font-hanken font-bold text-lg text-white group-hover:text-cyan-300 transition-colors leading-snug mb-3">
                        {proj.title}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {proj.description}
                      </p>
                    </div>
                    <div className="border-t border-slate-800/60 pt-4 mt-6 flex justify-between items-center">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">Upcoming Innovation</span>
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* INNOVATIVE R&D PRODUCTS */}
      <section className="py-20 relative z-10 bg-transparent border-t border-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="DEVELOPMENT OUTCOMES"
            title="Highlighted R&D Prototypes"
            subtitle="Explore products developed directly from our active thermodynamic research projects, complete with digital brochures."
            light={true}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {rdProducts.map((p) => (
              <div
                key={p.name}
                className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 hover:border-blue-500/25 transition-all"
              >
                <div className="w-full md:w-1/3 shrink-0 flex items-center justify-center bg-slate-950/60 rounded-2xl p-4 border border-slate-800/60">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="max-h-[140px] w-auto object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-widest">{p.category}</span>
                    <h3 className="font-hanken font-bold text-xl text-white mt-1 mb-3">{p.name}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed mb-4">{p.description}</p>
                    <ul className="space-y-1.5 mb-6">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={p.brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download Brochure</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS & ACTIVITIES */}
      <section className="py-20 relative z-10 bg-white/80 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="COLLABORATIONS"
            title="Seminars & Product Launches"
            subtitle="Join us at industry exhibitions, workshops, and scientific product announcements."
            light={false}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {events.map((e) => (
              <div
                key={e.title}
                className="bg-white/95 border border-slate-200 rounded-3xl p-6 md:p-8 hover:border-blue-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
                    <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest">{e.type}</span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      <span>{e.date}</span>
                    </div>
                  </div>
                  <h3 className="font-hanken font-bold text-lg text-slate-900 mb-3">{e.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{e.description}</p>
                </div>
                <div className="border-t border-slate-150 pt-4 mt-6 text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{e.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAREERS IN R&D */}
      <section className="py-20 relative z-10 bg-transparent border-t border-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Job Openings Details */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-2">JOIN OUR ENGINEERING TEAM</span>
            <h2 className="font-hanken font-extrabold text-3xl md:text-4xl text-white mb-6">
              Build the Next Generation of Cold Storage Technology
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              We look for passionate engineers, thermodynamic researchers, and embedded developers eager to work on high-stability digital storage systems.
            </p>

            <div className="space-y-6">
              {careerOpenings.map((job) => (
                <div key={job.title} className="p-6 bg-slate-900/40 border border-slate-850 rounded-2xl">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-bold text-white text-base leading-snug">{job.title}</h3>
                    <span className="shrink-0 px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">{job.type}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.department}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed"><strong className="text-slate-350">Requirements:</strong> {job.requirements}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Careers Application Form */}
          <div className="lg:col-span-6 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
            <h3 className="font-hanken font-bold text-xl text-white mb-2">Application Desk</h3>
            <p className="text-xs text-slate-500 mb-6">Submit your resume directly to our R&D hiring committee. We respond within 5 business days.</p>

            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h4 className="font-bold text-white text-lg mb-2">Application Received!</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">Thank you for submitting your details. Our R&D team will review your credentials and get back to you shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
                      placeholder="name@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
                      placeholder="e.g. +91 9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Position Applied For</label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 text-xs focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
                  >
                    <option value="">Select a role</option>
                    <option value="thermodynamic-engineer">Senior Thermodynamic Research Engineer</option>
                    <option value="embedded-developer">Embedded Systems & IoT Developer</option>
                    <option value="other">Other Speculative Role</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Brief Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all resize-none"
                    placeholder="Tell us briefly about your R&D work or achievements..."
                  />
                </div>

                {/* Secure File Upload container */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Resume Upload (PDF only)</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf"
                    required
                    className="hidden"
                  />
                  <div
                    onClick={triggerFileSelect}
                    className="w-full px-4 py-4 rounded-xl border border-dashed border-slate-800 hover:border-blue-500/40 hover:bg-blue-500/5 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-1.5"
                  >
                    <Upload className="w-5 h-5 text-slate-500 group-hover:text-blue-400" />
                    {fileName ? (
                      <span className="text-xs text-blue-400 font-semibold">{fileName}</span>
                    ) : (
                      <>
                        <span className="text-xs text-slate-450">Drag & drop or <span className="text-blue-400 underline">browse</span></span>
                        <span className="text-[10px] text-slate-600">Supports PDF format, max 5MB</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Anti-spam declaration */}
                <div className="flex items-center gap-2 text-[10px] text-slate-650 bg-slate-950/50 p-2 rounded-lg border border-slate-900/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Secure spam protection enabled. We encrypt all uploads and files.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}

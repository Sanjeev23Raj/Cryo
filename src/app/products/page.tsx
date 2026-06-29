'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartPulse,
  FlaskConical,
  ThermometerSnowflake,
  Download,
  Info,
  CheckCircle,
  X,
  MailQuestion,
  Layers,
  Thermometer,
  Scale,
  Plus,
  Check,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { products, Product } from '@/data/products';
import dynamic from 'next/dynamic';

const Prism = dynamic(() => import('@/components/animations/Prism'), { ssr: false });

// Temperature range mapping for all products
const PRODUCT_TEMPS: Record<string, { min: number; max: number; rangeLabel: string }> = {
  "newgen-ultra-low-freezer": { min: -86, max: -50, rangeLabel: "-50°C to -86°C" },
  "standard-ultra-low-freezer": { min: -86, max: -86, rangeLabel: "-86°C" },
  "plasma-freezer": { min: -40, max: -40, rangeLabel: "-40°C" },
  "low-freezer-single-door": { min: -25, max: -10, rangeLabel: "-10°C to -25°C" },
  "low-freezer-double-door": { min: -20, max: -15, rangeLabel: "-15°C to -20°C" },
  "lab-pharma-refrigerator": { min: 2, max: 8, rangeLabel: "+2°C to +8°C" },
  "blood-bank-refrigerator": { min: 2, max: 6, rangeLabel: "+2°C to +6°C" },
  "ice-lined-refrigerator": { min: 2, max: 8, rangeLabel: "+2°C to +8°C" },
  "plasma-thawing-bath": { min: 37, max: 37, rangeLabel: "+37°C" },
  "cold-trap": { min: -80, max: 25, rangeLabel: "-80°C to Ambient" },
  "sub-zero-chiller-bath": { min: -20, max: 25, rangeLabel: "-20°C to Ambient" },
  "heating-cooling-circulator": { min: -40, max: 200, rangeLabel: "-40°C to +200°C" },
  "temp-data-loggers": { min: -100, max: 150, rangeLabel: "-100°C to +150°C" },
  "iot-realtime-monitors": { min: -200, max: 200, rangeLabel: "-200°C to +200°C" },
  "temperature-recorders": { min: -100, max: 20, rangeLabel: "-100°C to +20°C" },
  "cryoracks-cryoboxes": { min: -196, max: 121, rangeLabel: "-196°C to +121°C" },
  "cryopen-cryoapron": { min: -196, max: 25, rangeLabel: "-196°C" }
};

const TEMPERATURE_STOPS = [
  { value: 200, label: "Incubation/Thawing", tempLabel: "+200°C to +30°C", color: "from-amber-400 to-red-500", desc: "For dynamic heating, cooling, and plasma thawing bath systems." },
  { value: 4, label: "Refrigerated", tempLabel: "+2°C to +8°C", color: "from-emerald-400 to-cyan-500", desc: "For vaccine, chromatography, and blood bank storage." },
  { value: -20, label: "Standard Freezer", tempLabel: "-20°C", color: "from-cyan-400 to-blue-500", desc: "For general laboratory enzyme and pharmaceutical storage." },
  { value: -40, label: "Deep Freezing", tempLabel: "-40°C", color: "from-blue-500 to-indigo-600", desc: "For fresh frozen plasma and sub-zero chiller baths." },
  { value: -80, label: "Ultra-Low Temp", tempLabel: "-80°C", color: "from-indigo-500 to-violet-600", desc: "For cascade component storage and chemical vapor cold traps." },
  { value: -196, label: "Deep Cryo", tempLabel: "-196°C", color: "from-violet-600 to-fuchsia-800", desc: "For liquid nitrogen bio-preservation, Dewars, and Cryo PPE." }
];

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTempStop, setSelectedTempStop] = useState<number | null>(null);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [bgBlur, setBgBlur] = useState(6);
  const [bgOpacity, setBgOpacity] = useState(0.4);

  useEffect(() => {
    // Stage 1: Increase the blur to create an initial wash of ambient color
    const t1 = setTimeout(() => {
      setBgBlur(28);
      setBgOpacity(0.9);
    }, 150);

    // Stage 2: Reduce the blur to 0 so the wave shapes and details are clearly visible
    const t2 = setTimeout(() => {
      setBgBlur(0);
      setBgOpacity(0.85);
    }, 1300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Sync state if search params change
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
    const productId = searchParams.get('id');
    if (productId) {
      const prod = products.find(p => p.id === productId);
      if (prod) {
        setSelectedProduct(prod);
      }
    }
  }, [searchParams]);

  const categories = [
    { id: 'all', label: 'All Equipment', icon: Layers },
    { id: 'blood-bank', label: 'Blood Bank', icon: HeartPulse },
    { id: 'laboratory', label: 'Laboratory', icon: FlaskConical },
    { id: 'cryogenic-accessories', label: 'Cryogenic Accessories', icon: ThermometerSnowflake },
  ];

  // Helper to check temperature suitability
  const isProductSuitableForTemp = (product: Product, temp: number) => {
    const tempRange = PRODUCT_TEMPS[product.id];
    if (!tempRange) return true;
    return temp >= tempRange.min && temp <= tempRange.max;
  };

  // Filter products based on active tab AND selected temperature stop
  const filteredProducts = products.filter(p => {
    const matchesTab = activeTab === 'all' || p.categories.includes(activeTab as any);
    const matchesTemp = selectedTempStop === null || isProductSuitableForTemp(p, selectedTempStop);
    return matchesTab && matchesTemp;
  });

  const toggleCompare = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (compareList.some(item => item.id === product.id)) {
      setCompareList(compareList.filter(item => item.id !== product.id));
    } else {
      if (compareList.length >= 3) {
        alert("You can compare up to 3 products at a time.");
        return;
      }
      setCompareList([...compareList, product]);
    }
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const getActiveTempStopDetails = () => {
    if (selectedTempStop === null) return null;
    return TEMPERATURE_STOPS.find(s => s.value === selectedTempStop);
  };

  const activeTempDetails = getActiveTempStopDetails();

  return (
    <div className="relative font-sans pt-24 min-h-screen bg-[#020617] text-white overflow-hidden">
      {/* WebGL Prism Background with dynamic blur transitions */}
      <div 
        className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 transition-all duration-[1500ms] ease-out"
        style={{
          filter: `blur(${bgBlur}px)`,
          opacity: bgOpacity
        }}
      >
        <Prism 
          height={3.5}
          baseWidth={5.5}
          animationType="rotate"
          glow={1.0}
          noise={0.02}
          transparent={true}
          scale={3.6}
          bloom={1.0}
        />
      </div>

      {/* Decorative gradient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Page Hero */}
      <section className="relative py-16 bg-transparent text-white overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-cyan-300 border border-cyan-400/20 shadow-[0_0_20px_rgba(56,189,248,0.15)]"
          >
            Scientific Systems & Cryogenics
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-hanken font-extrabold text-4xl md:text-6xl tracking-tight leading-tight mt-6 bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent"
          >
            Cryo-Preservation Catalog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mt-6 text-base md:text-lg text-sky-200 leading-relaxed"
          >
            Explore our line of ISO certified cooling preservation systems, medical storage refrigerators, and specialized laboratory environmental chambers.
          </motion.p>
        </div>
      </section>

      {/* Thermoregulator: Interactive Temperature Slider (Unique Feature) */}
      <section className="py-8 bg-transparent z-20 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="glass-panel border-white/10 rounded-3xl p-6 md:p-8 bg-[#090f26]/80 backdrop-blur-xl shadow-2xl relative">
            <div className="absolute top-0 right-0 p-4">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="font-hanken font-bold text-lg md:text-xl text-white flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-cyan-400 animate-pulse" />
                  <span>Interactive Thermoregulator</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Drag or select a checkpoint to filter equipment by operating temperature.
                </p>
              </div>

              {selectedTempStop !== null && (
                <button
                  onClick={() => setSelectedTempStop(null)}
                  className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-cyan-300 text-xs font-semibold tracking-wide transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Show All Temps</span>
                </button>
              )}
            </div>

            {/* Slider track / indicators */}
            <div className="relative pt-6 pb-2">
              <div className="h-2 w-full rounded-full bg-slate-800 relative">
                {/* Visual hot-to-cold gradient line */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-amber-400 via-cyan-400 via-blue-500 via-indigo-600 to-violet-700 opacity-60" />
                
                {/* Dynamic selected bar */}
                {selectedTempStop !== null && (
                  <div 
                    className="absolute h-full rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]"
                    style={{
                      left: '0%',
                      right: `${((200 - (selectedTempStop)) / 396) * 100}%`
                    }}
                  />
                )}
              </div>

              {/* Checkpoints on the slider */}
              <div className="flex justify-between items-center mt-6 relative">
                {TEMPERATURE_STOPS.map((stop) => {
                  const isActive = selectedTempStop === stop.value;
                  return (
                    <button
                      key={stop.value}
                      onClick={() => setSelectedTempStop(stop.value)}
                      className="group flex flex-col items-center focus:outline-none cursor-pointer relative"
                    >
                      {/* Interactive node dot */}
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        isActive
                          ? 'bg-cyan-400 border-white scale-125 shadow-[0_0_15px_rgba(34,211,238,0.8)]'
                          : 'bg-slate-900 border-slate-700 group-hover:border-cyan-400/50 group-hover:scale-110'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-slate-900' : 'bg-slate-500 group-hover:bg-cyan-400'}`} />
                      </div>
                      
                      <span className={`text-[10px] font-bold mt-2 transition-colors duration-300 tracking-wider uppercase ${
                        isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}>
                        {stop.value > 0 ? `+${stop.value}°C` : `${stop.value}°C`}
                      </span>
                      <span className="hidden md:block text-[9px] text-slate-500 font-medium leading-none mt-0.5">
                        {stop.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic thermal zone description panel */}
            <AnimatePresence mode="wait">
              {activeTempDetails ? (
                <motion.div
                  key={selectedTempStop}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4 items-center"
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${activeTempDetails.color} text-white font-bold text-xs shrink-0 shadow-lg shadow-black/20`}>
                    {activeTempDetails.tempLabel}
                  </div>
                  <div>
                    <h3 className="font-hanken font-bold text-sm text-white">{activeTempDetails.label} Environment</h3>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{activeTempDetails.desc}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-3 items-center"
                >
                  <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <p className="text-xs text-slate-300">Currently showing all temperature ranges. Click a node above to view products for specific thermoregulator zones.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Tabs Filtering Bar */}
      <section className="py-6 bg-transparent z-10 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-3 items-center justify-center">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-cyan-400/30 shadow-lg shadow-blue-500/25 scale-105'
                    : 'bg-white/5 text-sky-200 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-transparent z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-slate-950/40 rounded-3xl border border-white/5">
              <ThermometerSnowflake className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white">No products found matching the criteria</h3>
              <p className="text-sm text-slate-400 mt-2">Try clearing your filters or choosing a different temperature zone.</p>
              <button
                onClick={() => {
                  setSelectedTempStop(null);
                  setActiveTab('all');
                }}
                className="mt-6 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((p) => {
                  const range = PRODUCT_TEMPS[p.id];
                  const inCompare = compareList.some(item => item.id === p.id);
                  const isCryoAccessory = p.categories.includes('cryogenic-accessories');

                  return (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="glass-panel rounded-3xl p-5 flex flex-col justify-between hover:shadow-2xl transition-all group relative bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 hover:border-blue-400 text-slate-900 shadow-blue-900/5"
                    >
                      {/* Compare Checkbox Pin */}
                      <button
                        onClick={(e) => toggleCompare(p, e)}
                        className={`absolute top-4 left-4 z-20 w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                          inCompare
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-blue-50/80 border-blue-400/40 text-blue-600 hover:border-blue-600'
                        }`}
                        title={inCompare ? "Remove from comparison" : "Compare this product"}
                      >
                        {inCompare ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>

                      {/* Temperature Range Indicator Tag */}
                      {range && (
                        <span className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wide border bg-blue-50/80 border-blue-400/40 text-blue-600">
                          {range.rangeLabel}
                        </span>
                      )}

                      <div>
                        {/* Product Image */}
                        <div 
                          className="w-full aspect-square bg-white rounded-2xl border border-blue-100 mb-5 relative overflow-hidden flex items-center justify-center cursor-pointer p-4 shadow-sm"
                          onClick={() => setSelectedProduct(p)}
                        >
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest leading-none text-blue-600">
                            {p.categoryLabel}
                          </span>
                          <h3 
                            className="font-hanken font-bold text-lg text-black hover:text-blue-700 leading-tight cursor-pointer transition-colors"
                            onClick={() => setSelectedProduct(p)}
                          >
                            {p.name}
                          </h3>
                          <p className="text-xs leading-relaxed mt-2 text-blue-900 font-medium">
                            {p.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 mt-6">
                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer shadow-md hover:shadow-lg bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>Specs & Details</span>
                        </button>

                        {!p.categories.includes('cryogenic-accessories') && (
                          <a
                            href={p.brochureUrl}
                            download={p.brochureUrl.startsWith('http') ? undefined : true}
                            target={p.brochureUrl.startsWith('http') ? "_blank" : undefined}
                            rel={p.brochureUrl.startsWith('http') ? "noopener noreferrer" : undefined}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!p.brochureUrl.startsWith('http')) {
                                alert(`Brochure download triggered for: ${p.name}`);
                              }
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-blue-300 hover:bg-blue-50 text-blue-700 font-semibold text-xs transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Brochure</span>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Floating Comparison Deck (Unique Feature) */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 inset-x-0 z-[100] px-4 flex justify-center pointer-events-none"
          >
            <div className="w-full max-w-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl rounded-2xl p-4 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4 pointer-events-auto">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300">
                  <Scale className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-hanken font-bold text-xs text-white uppercase tracking-wider">Product Comparison</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{compareList.length} of 3 items selected</p>
                </div>
              </div>

              {/* Minis */}
              <div className="flex items-center gap-2">
                {compareList.map((item) => (
                  <div key={item.id} className="relative group rounded-lg border border-white/10 bg-slate-950 p-1 flex items-center gap-2">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-8 h-8 rounded object-cover" 
                    />
                    <span className="hidden md:inline text-[9px] text-slate-300 max-w-[100px] truncate">{item.name}</span>
                    <button
                      onClick={() => setCompareList(compareList.filter(p => p.id !== item.id))}
                      className="w-4 h-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-[10px] cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
                {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                  <div key={idx} className="w-8 h-8 rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-slate-600 text-xs">
                    +
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={clearCompare}
                  className="flex-1 md:flex-none px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  disabled={compareList.length < 2}
                  onClick={() => setShowCompareModal(true)}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[11px] font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md ${
                    compareList.length >= 2
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-blue-500/20'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Compare Now</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Comparison Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
            onClick={() => setShowCompareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="w-full max-w-5xl bg-slate-900 border border-cyan-500/20 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-slate-950/80">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-cyan-400" />
                  <h2 className="font-hanken font-bold text-lg text-white">Compare Specifications</h2>
                </div>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-x-auto overflow-y-auto flex-grow">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="py-4 px-3 text-slate-400 font-semibold w-1/4">Specs</th>
                      {compareList.map((item) => (
                        <th key={item.id} className="py-4 px-3 w-1/4">
                          <div className="flex flex-col gap-2">
                            <img src={item.imageUrl} alt={item.name} className="w-20 aspect-video rounded-lg object-cover border border-white/10 bg-black/20" />
                            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{item.categoryLabel}</span>
                            <span className="font-bold text-white leading-tight max-w-[180px]">{item.name}</span>
                          </div>
                        </th>
                      ))}
                      {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                        <th key={idx} className="py-4 px-3 w-1/4 text-center text-slate-600 italic font-normal">
                          Slot Empty
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Tagline Row */}
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-3 font-semibold text-slate-400">Tagline</td>
                      {compareList.map((item) => (
                        <td key={item.id} className="py-4 px-3 text-slate-300 italic">{item.tagline}</td>
                      ))}
                      {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                        <td key={idx} className="py-4 px-3" />
                      ))}
                    </tr>

                    {/* Operating Temperature Row */}
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-3 font-semibold text-slate-400">Temp Range</td>
                      {compareList.map((item) => {
                        const temp = PRODUCT_TEMPS[item.id];
                        return (
                          <td key={item.id} className="py-4 px-3">
                            <span className="px-2.5 py-1 rounded bg-blue-500/20 text-cyan-300 font-bold border border-blue-500/10">
                              {temp ? temp.rangeLabel : "N/A"}
                            </span>
                          </td>
                        );
                      })}
                      {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                        <td key={idx} className="py-4 px-3" />
                      ))}
                    </tr>

                    {/* Specs Keys */}
                    {Array.from(new Set(compareList.flatMap(item => Object.keys(item.specs)))).map((specKey) => (
                      <tr key={specKey} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-3 font-semibold text-slate-400">{specKey}</td>
                        {compareList.map((item) => (
                          <td key={item.id} className="py-4 px-3 text-white font-medium">
                            {item.specs[specKey] || <span className="text-slate-600">—</span>}
                          </td>
                        ))}
                        {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                          <td key={idx} className="py-4 px-3" />
                        ))}
                      </tr>
                    ))}

                    {/* Features Row */}
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-3 font-semibold text-slate-400">Key Features</td>
                      {compareList.map((item) => (
                        <td key={item.id} className="py-4 px-3">
                          <ul className="flex flex-col gap-1.5">
                            {item.features.slice(0, 3).map((feat, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                      {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                        <td key={idx} className="py-4 px-3" />
                      ))}
                    </tr>

                    {/* Actions Row */}
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-3 font-semibold text-slate-400">Inquiry</td>
                      {compareList.map((item) => (
                        <td key={item.id} className="py-4 px-3">
                          <div className="flex flex-col gap-2">
                            <a
                              href={`/contact?requirement=${encodeURIComponent(item.name)}`}
                              className="py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-bold text-center block"
                            >
                              Inquire Now
                            </a>
                            {!item.categories.includes('cryogenic-accessories') && (
                              <a
                                href={item.brochureUrl}
                                download={item.brochureUrl.startsWith('http') ? undefined : true}
                                target={item.brochureUrl.startsWith('http') ? "_blank" : undefined}
                                rel={item.brochureUrl.startsWith('http') ? "noopener noreferrer" : undefined}
                                className="py-1.5 px-3 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 text-[10px] font-semibold text-center block"
                              >
                                PDF Brochure
                              </a>
                            )}
                          </div>
                        </td>
                      ))}
                      {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                        <td key={idx} className="py-4 px-3" />
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-slate-950/80">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {selectedProduct.categoryLabel}
                </span>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 md:p-8 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Info */}
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="font-hanken font-bold text-2xl md:text-3xl text-white leading-tight">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-cyan-300 font-medium text-xs md:text-sm mt-2 italic leading-relaxed">
                      {selectedProduct.tagline}
                    </p>
                  </div>

                  {/* Product Image */}
                  <div className="w-full bg-slate-950 rounded-2xl border border-white/10 overflow-hidden relative mb-4" style={{ aspectRatio: selectedProduct.aspectRatio || '1/1' }}>
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  <div>
                    <h4 className="font-hanken font-bold text-sm text-white uppercase tracking-wider mb-3">
                      Key Highlights
                    </h4>
                    <ul className="flex flex-col gap-2">
                      {selectedProduct.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Specs & Actions */}
                <div className="flex flex-col gap-6 justify-between bg-slate-950/40 p-6 rounded-2xl border border-white/5">
                  <div>
                    <h4 className="font-hanken font-bold text-sm text-white uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                      Technical Specifications
                    </h4>
                    <table className="w-full text-xs text-left text-slate-300">
                      <tbody>
                        {Object.entries(selectedProduct.specs).map(([key, val]) => (
                          <tr key={key} className="border-b border-white/5">
                            <td className="py-2.5 font-semibold text-slate-400 w-1/2">{key}</td>
                            <td className="py-2.5 text-white font-medium w-1/2">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col gap-3 mt-6">
                    <a
                      href={`/contact?requirement=${encodeURIComponent(selectedProduct.name)}`}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold text-center flex items-center justify-center gap-2 shadow-md shadow-blue-500/10"
                    >
                      <MailQuestion className="w-4 h-4" />
                      <span>Inquire About This Product</span>
                    </a>

                    {!selectedProduct.categories.includes('cryogenic-accessories') && (
                      <a
                        href={selectedProduct.brochureUrl}
                        download={selectedProduct.brochureUrl.startsWith('http') ? undefined : true}
                        target={selectedProduct.brochureUrl.startsWith('http') ? "_blank" : undefined}
                        rel={selectedProduct.brochureUrl.startsWith('http') ? "noopener noreferrer" : undefined}
                        onClick={() => {
                          if (!selectedProduct.brochureUrl.startsWith('http')) {
                            alert(`Brochure download triggered for: ${selectedProduct.name}`);
                          }
                        }}
                        className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white text-xs font-semibold text-center flex items-center justify-center gap-2 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download PDF Brochure</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">Loading Catalog...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}

'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  ArrowLeft, 
  CheckCircle2, 
  Mail,
  BellRing
} from 'lucide-react';

export default function NewArrivalsNotify() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
      }, 800);
    }
  };

  return (
    <main className="min-h-screen bg-[#020512] text-white flex flex-col justify-center items-center relative overflow-hidden font-sans px-6 py-12">
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="absolute top-12 w-[600px] h-[300px] bg-blue-500/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-12 w-[600px] h-[300px] bg-cyan-500/10 rounded-full filter blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!submitted ? (
          /* Subscription Form State */
          <motion.div
            key="subscribe-form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-md w-full text-center flex flex-col items-center justify-center z-10 p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 text-slate-900 shadow-xl relative overflow-hidden"
          >
            {/* Background looping video */}
            <video 
              src="/new arrival.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none z-0"
            />

            <div className="z-10 relative flex flex-col items-center w-full">
              {/* Animated Bell Icon */}
              <motion.div 
                className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center mb-6 text-amber-600"
                animate={{ rotate: [0, 10, -10, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, repeatDelay: 1 }}
              >
                <BellRing className="w-7 h-7" />
              </motion.div>

              <h1 className="font-hanken text-2xl sm:text-3xl font-extrabold text-black mb-2 tracking-tight">
                New Product Launch Notifications
              </h1>
              <p className="text-xs sm:text-sm text-blue-900 mb-8 leading-relaxed font-medium animate-pulse">
                We are engineering next-generation ultra-low cooling and laboratory systems. Submit your email below to get notified immediately upon official release.
              </p>

              <form onSubmit={handleSubscribe} className="w-full space-y-4 mb-6">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    required
                    placeholder="Enter your email address..." 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-blue-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white font-bold text-xs tracking-wider shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Registering...</span>
                  ) : (
                    <span>Notify Me On Launch</span>
                  )}
                </button>
              </form>

              <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Thank You / Confirmed State */
          <motion.div
            key="subscribe-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-md w-full text-center flex flex-col items-center justify-center z-10 p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 text-slate-900 shadow-xl"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mb-6 text-emerald-600 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h1 className="font-hanken text-2xl sm:text-3xl font-extrabold text-black mb-2 tracking-tight">
              Registration Complete!
            </h1>
            <p className="text-sm text-blue-900 mb-8 leading-relaxed font-medium">
              Thank you! You will be notified as soon as new products are launched.
            </p>

            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-all shadow-md hover:shadow-lg shadow-blue-500/15 cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

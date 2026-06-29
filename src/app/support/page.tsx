'use client';

import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  Send, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Tag, 
  FileQuestion,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { products } from '@/data/products';
import dynamic from 'next/dynamic';

const ProductsBackground = dynamic(() => import('@/components/animations/ProductsBackground'), { ssr: false });

function SupportFormContent() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    purchaseDate: '',
    productName: '',
    query: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Thank you! Your ticket has been logged successfully. Our support team will contact you shortly.'
        });
        setFormData({
          name: '',
          phone: '',
          email: '',
          purchaseDate: '',
          productName: '',
          query: ''
        });
      } else {
        setStatus({
          type: 'error',
          message: result.error || 'Failed to submit form. Please check the inputs.'
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: 'error',
        message: 'Something went wrong. Please check your network connection and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative font-sans pt-24 min-h-screen bg-[#020617] text-white overflow-hidden flex flex-col justify-center py-12">
      {/* Molecular particle background */}
      <ProductsBackground />

      {/* Decorative ambient blur spheres */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-950/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-xl mx-auto px-6 relative z-10 w-full">
        {/* Title Block */}
        <div className="text-center mb-10">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-cyan-300 border border-cyan-400/20 shadow-[0_0_20px_rgba(56,189,248,0.15)]"
          >
            Customer Care Support
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-hanken font-extrabold text-3xl md:text-5xl mt-6 bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent"
          >
            Product Query & Complaint Form
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs md:text-sm text-sky-200/60 mt-4 leading-relaxed"
          >
            Please provide details below regarding your product issues, operational queries, or complaints. We will address them immediately.
          </motion.p>
        </div>

        {/* Form Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel border-white/10 rounded-3xl p-6 md:p-8 bg-[#090f26]/80 backdrop-blur-xl shadow-2xl relative"
        >
          {status.type && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${
              status.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                : 'bg-red-500/10 border-red-500/20 text-red-300'
            }`}>
              {status.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <span className="text-xs leading-relaxed">{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Customer Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Name of the Customer *</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950/50 text-white placeholder-slate-500 text-xs focus:border-cyan-400 focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Phone Number */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Phone Number *</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950/50 text-white placeholder-slate-500 text-xs focus:border-cyan-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Mail ID */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Mail ID *</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950/50 text-white placeholder-slate-500 text-xs focus:border-cyan-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Product bought on date */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="purchaseDate" className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Product Bought On Date</span>
                </label>
                <input
                  type="date"
                  id="purchaseDate"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950/50 text-white text-xs focus:border-cyan-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Product Name Selection */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="productName" className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Product Name *</span>
                </label>
                <select
                  id="productName"
                  name="productName"
                  required
                  value={formData.productName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#090f26] text-white text-xs focus:border-cyan-400 focus:outline-none transition-colors"
                >
                  <option value="" disabled>Select your product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                  <option value="Other / Custom Cold Storage">Other / Custom Cold Storage</option>
                </select>
              </div>
            </div>

            {/* Product query / complaint */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="query" className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileQuestion className="w-3.5 h-3.5 text-cyan-400" />
                <span>Product Query or Complaint *</span>
              </label>
              <textarea
                id="query"
                name="query"
                required
                rows={4}
                value={formData.query}
                onChange={handleChange}
                placeholder="Describe your operational query, issue, or complaint in detail"
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950/50 text-white placeholder-slate-500 text-xs focus:border-cyan-400 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                loading 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-blue-500/25'
              }`}
            >
              {loading ? (
                <>
                  <Wrench className="w-4 h-4 animate-spin" />
                  <span>Logging Support Ticket...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Support Ticket</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function SupportFormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">Loading Support Center...</div>}>
      <SupportFormContent />
    </Suspense>
  );
}

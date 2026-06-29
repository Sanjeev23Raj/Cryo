'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, CheckCircle2, User, Building2, Layers, ShieldCheck } from 'lucide-react';

export default function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shouldShow, setShouldShow] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    requirement: '',
    contactInfo: ''
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if ((window as any).__introFinished || !(window as any).__introActive) {
        setShouldShow(true);
      } else {
        const handleFinished = () => {
          setShouldShow(true);
        };
        window.addEventListener('intro-finished', handleFinished);
        return () => {
          window.removeEventListener('intro-finished', handleFinished);
        };
      }
    } else {
      setShouldShow(true);
    }
  }, []);

  React.useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-assistant', handleOpen);
    return () => {
      window.removeEventListener('open-assistant', handleOpen);
    };
  }, []);

  if (!shouldShow) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.requirement || !formData.contactInfo) {
      setError('Please fill in Name, Requirement, and Contact Info.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', organization: '', requirement: '', contactInfo: '' });
      } else {
        const errData = await response.json();
        setError(errData.error || 'Failed to submit request.');
      }
    } catch (err) {
      setError('A connection error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] font-sans">
      {/* Floating Chat Bubble */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform cursor-pointer relative"
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
        )}
      </motion.button>

      {/* Chat Form Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="absolute bottom-18 right-0 w-[350px] md:w-[400px] glass-panel border border-primary/20 rounded-2xl shadow-2xl overflow-hidden p-6 z-50"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-gray-200/20 pb-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-secondary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-hanken font-bold text-dark text-sm leading-tight">
                  Lead Assistant
                </h4>
                <span className="text-[10px] text-gray-500 font-medium">
                  Cryo Scientific Systems
                </span>
              </div>
            </div>

            {/* Welcome Msg */}
            {!isSubmitted && (
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mb-4 text-xs text-dark leading-relaxed">
                Hello 👋 How can we assist you today? Please fill out your details, and our technical sales division will contact you shortly.
              </div>
            )}

            {/* Content Switch */}
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-10"
              >
                <CheckCircle2 className="w-16 h-16 text-secondary mb-4 animate-bounce" />
                <h5 className="font-hanken font-bold text-dark text-lg">
                  Submit Successful
                </h5>
                <p className="text-gray-600 text-sm mt-2 max-w-[280px]">
                  Thank you. Our team will contact you shortly.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setIsOpen(false);
                  }}
                  className="mt-6 text-xs text-secondary font-semibold hover:underline"
                >
                  Close Assistant
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* Field 1: Name */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name *"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/40 border border-gray-200 focus:border-secondary focus:bg-white rounded-xl py-3 pl-10 pr-4 text-sm text-dark placeholder-gray-400 outline-none transition-all"
                  />
                </div>

                {/* Field 2: Organization */}
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Organization / Institution"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full bg-white/40 border border-gray-200 focus:border-secondary focus:bg-white rounded-xl py-3 pl-10 pr-4 text-sm text-dark placeholder-gray-400 outline-none transition-all"
                  />
                </div>

                {/* Field 3: Equipment Requirement */}
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Equipment Requirement (e.g. Plasma Freezer) *"
                    required
                    value={formData.requirement}
                    onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                    className="w-full bg-white/40 border border-gray-200 focus:border-secondary focus:bg-white rounded-xl py-3 pl-10 pr-4 text-sm text-dark placeholder-gray-400 outline-none transition-all"
                  />
                </div>

                {/* Field 4: Phone + Email */}
                <div className="relative">
                  <Send className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Phone + Email (e.g. +91 9999999999 / user@mail.com) *"
                    required
                    value={formData.contactInfo}
                    onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                    className="w-full bg-white/40 border border-gray-200 focus:border-secondary focus:bg-white rounded-xl py-3 pl-10 pr-4 text-sm text-dark placeholder-gray-400 outline-none transition-all"
                  />
                </div>

                {error && <span className="text-red-500 text-xs mt-1">{error}</span>}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-accent text-white font-medium text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{loading ? 'Submitting...' : 'Request Info'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

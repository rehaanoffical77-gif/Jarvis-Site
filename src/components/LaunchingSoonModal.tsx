import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Bell, CheckCircle2, Bot, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface LaunchingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LaunchingSoonModal: React.FC<LaunchingSoonModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsSubmitted(false);
      setEmail('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur & Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-black/95 text-white border border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(195,121,255,0.25)] z-10 overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-purple-600/30 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-blue-600/30 rounded-full blur-[80px] pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all duration-200 cursor-pointer z-20 group"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Content Body */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              
              {/* Top Animated Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-purple-300">
                  SYSTEM STATUS: IN FINAL CALIBRATION
                </span>
              </div>

              {/* JARVIS Icon Avatar */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-white/10 via-purple-500/10 to-white/5 border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
                <Sparkles className="w-4 h-4 text-purple-300 absolute -top-1 -right-1" />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-purple-200">
                  JARVIS is Launching Soon
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-md">
                  We are fine-tuning our on-device voice & vision neural models for Android. Be the first to experience true autonomous mobile AI.
                </p>
              </div>

              {/* Interactive Form / Confirmation State */}
              <div className="w-full pt-2">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 sm:p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex flex-col items-center space-y-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    <span className="text-sm font-bold uppercase tracking-wider text-emerald-300">
                      You're on the VIP Waitlist!
                    </span>
                    <p className="text-xs text-emerald-300/80">
                      We'll dispatch an invite code to <span className="underline font-mono text-emerald-200">{email}</span> as soon as early access opens.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email for early access..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-purple-400 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all"
                    />
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-xs uppercase tracking-wider shrink-0 transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>GET NOTIFIED</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>

              {/* Highlights list */}
              <div className="grid grid-cols-2 gap-3 w-full pt-2 text-left">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-purple-400 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Latency</span>
                    <span className="text-xs font-semibold text-white">&lt;200ms Voice Live</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Platform</span>
                    <span className="text-xs font-semibold text-white">Android 10+ Ready</span>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase pt-2">
                No spam ever. Unsubscribe anytime.
              </p>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

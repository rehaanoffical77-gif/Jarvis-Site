import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, CheckCircle2, Bot, ArrowRight, ShieldCheck, Zap, Download, HardDrive, Smartphone, Check } from 'lucide-react';
import { JARVIS_APK_URL, triggerApkDownload } from '../utils/download';

interface LaunchingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LaunchingSoonModal: React.FC<LaunchingSoonModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsSubmitted(false);
      setEmail('');
      setDownloadStarted(false);
    }
  }, [isOpen]);

  const handleDownloadClick = () => {
    triggerApkDownload();
    setDownloadStarted(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur & Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-black/95 text-white border border-white/20 rounded-3xl p-5 sm:p-8 shadow-[0_0_50px_rgba(195,121,255,0.25)] z-10 overflow-hidden my-auto"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-purple-600/30 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-slate-400 hover:text-white transition-all cursor-pointer z-20"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content Body */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-5">
              
              {/* Top Animated Version Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/50 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-purple-200">
                  ✨ Version 1.4.0 (Latest Release)
                </span>
              </div>

              {/* Bot Icon Frame */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-white/10 via-purple-500/10 to-white/5 border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
                <Sparkles className="w-4 h-4 text-purple-300 absolute -top-1 -right-1" />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-purple-200">
                  JARVIS AI Voice Assistant
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-md">
                  Experience instantaneous continuous wake-word voice execution on Android 10.0+ devices.
                </p>
              </div>

              {/* Direct APK Download Button */}
              <div className="w-full space-y-2">
                <a
                  href={JARVIS_APK_URL}
                  download="Jarvis-AI-v1.4.0.apk"
                  onClick={handleDownloadClick}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-white via-slate-100 to-purple-200 hover:from-purple-100 hover:to-white text-black font-extrabold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:shadow-[0_0_35px_rgba(195,121,255,0.6)] active:scale-98 cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 text-black group-hover:bounce transition-transform" />
                  <span>{downloadStarted ? 'DOWNLOADING APK FILE...' : 'DOWNLOAD JARVIS AI APK'}</span>
                </a>

                {downloadStarted && (
                  <p className="text-[11px] font-mono text-emerald-400 flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Download started! Check your browser downloads folder.
                  </p>
                )}
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-3 gap-2 w-full text-left">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
                  <HardDrive className="w-3.5 h-3.5 text-purple-400 mb-1" />
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Size</span>
                  <span className="text-xs font-bold text-white">5.2 MB</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
                  <Smartphone className="w-3.5 h-3.5 text-blue-400 mb-1" />
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Package</span>
                  <span className="text-[10px] font-bold text-slate-200 truncate max-w-full">com.jarvis</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mb-1" />
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Safety</span>
                  <span className="text-xs font-bold text-emerald-300">Verified</span>
                </div>
              </div>

              {/* VIP Waitlist / Early Access Form */}
              <div className="w-full pt-1 border-t border-white/10">
                <p className="text-[11px] text-slate-400 mb-2">Want cloud sync & early beta updates?</p>
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex flex-col items-center space-y-1 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      VIP Waitlist Confirmed
                    </span>
                    <p className="text-[11px] text-emerald-300/80">
                      We will send updates to <span className="underline font-mono text-emerald-200">{email}</span>.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
                    <input
                      type="email"
                      required
                      placeholder="Enter email for VIP updates..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-purple-400 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>SUBSCRIBE</span>
                    </button>
                  </form>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

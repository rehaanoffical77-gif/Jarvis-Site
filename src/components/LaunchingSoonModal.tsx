import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Bot,
  ShieldCheck,
  Download,
  HardDrive,
  Smartphone,
  Check,
  Loader2,
} from 'lucide-react';
import { LightningCanvas } from './LightningCanvas';
import {
  AppVersionInfo,
  DEFAULT_APP_VERSION,
  JARVIS_APK_URL,
  fetchLatestAppVersion,
  triggerApkDownload,
} from '../utils/download';

interface LaunchingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LaunchingSoonModal: React.FC<LaunchingSoonModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [versionInfo, setVersionInfo] = useState<AppVersionInfo>(DEFAULT_APP_VERSION);
  const [isLoadingVersion, setIsLoadingVersion] = useState(true);

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

  // Prevent body scroll and fetch version when modal is opened
  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsLoadingVersion(true);
      setDownloadStarted(false);

      fetchLatestAppVersion()
        .then((data) => {
          if (isMounted) {
            setVersionInfo(data);
            setIsLoadingVersion(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setIsLoadingVersion(false);
          }
        });
    } else {
      document.body.style.overflow = '';
      setIsSubmitted(false);
      setEmail('');
      setDownloadStarted(false);
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleDownloadClick = () => {
    const targetUrl = versionInfo.downloadUrl || versionInfo.apkUrl || JARVIS_APK_URL;
    triggerApkDownload(targetUrl);
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
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="jarvis-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop Blur & Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity cursor-pointer"
          />

          {/* Modal Container with full-box Lightning Background */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-black text-white border border-white/20 rounded-3xl p-4 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.95)] z-10 overflow-hidden my-auto"
          >
            {/* Total Box WebGL Lightning Effect */}
            <LightningCanvas
              hue={230}
              xOffset={0.0}
              speed={1.0}
              intensity={1.15}
              size={1.0}
              transparent={false}
              hueCycleSpeed={18}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Dark contrast scrim to keep text and controls crisp over lightning */}
            <div className="absolute inset-0 bg-black/65 backdrop-blur-[0.5px] pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 border border-white/15 hover:bg-white/15 text-slate-300 hover:text-white transition-all cursor-pointer z-30 backdrop-blur-md"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content Body */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              
              {/* Top Animated Version Badge with Dynamic Version Fetching */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-black/60 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                {isLoadingVersion ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-slate-300 animate-spin" />
                    <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                      Fetching latest version...
                    </span>
                  </>
                ) : (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-white">
                      ✨ Version {versionInfo.versionName} {versionInfo.versionCode ? `(Build ${versionInfo.versionCode})` : '(Latest Release)'}
                    </span>
                  </>
                )}
              </div>

              {/* Bot Icon Frame */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black/50 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.8)]">
                <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
                <Sparkles className="w-4 h-4 text-white absolute -top-1 -right-1" />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5 max-w-md">
                <h2
                  id="jarvis-modal-title"
                  className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
                >
                  JARVIS AI Assistant
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.95)]">
                  Experience instantaneous continuous wake-word voice execution on Android 10.0+ devices.
                </p>
              </div>

              {/* Direct Download Option Button */}
              <div className="w-full space-y-2.5 pt-1">
                <button
                  type="button"
                  id="download-jarvis-app-button"
                  onClick={handleDownloadClick}
                  className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-100 text-black font-extrabold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:shadow-[0_0_35px_rgba(255,255,255,0.6)] active:scale-98 cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 text-black group-hover:translate-y-0.5 transition-transform" />
                  <span>
                    {downloadStarted
                      ? 'Downloading Jarvis AI App...'
                      : 'Download Jarvis AI App'}
                  </span>
                </button>

                {downloadStarted && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2.5 rounded-xl bg-black/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-center gap-1.5 backdrop-blur-md"
                  >
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Download started! Check your downloads folder.</span>
                  </motion.div>
                )}
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-3 gap-2 w-full text-left">
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/15 backdrop-blur-md flex flex-col items-center text-center">
                  <HardDrive className="w-3.5 h-3.5 text-slate-300 mb-1" />
                  <span className="text-[9px] font-mono text-slate-400 uppercase">File</span>
                  <span className="text-xs font-bold text-white truncate max-w-full">
                    {versionInfo.apkName || 'Jarvis-AI.apk'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/15 backdrop-blur-md flex flex-col items-center text-center">
                  <Smartphone className="w-3.5 h-3.5 text-slate-300 mb-1" />
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Platform</span>
                  <span className="text-xs font-bold text-slate-200">Android 10+</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/15 backdrop-blur-md flex flex-col items-center text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mb-1" />
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Safety</span>
                  <span className="text-xs font-bold text-emerald-300">Verified</span>
                </div>
              </div>

              {/* VIP Waitlist / Early Access Form */}
              <div className="w-full pt-1 border-t border-white/15">
                <p className="text-[11px] text-slate-300 mb-2 font-medium">Want cloud sync & early beta updates?</p>
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 rounded-xl bg-black/80 border border-emerald-500/50 text-emerald-200 flex flex-col items-center space-y-1 shadow-[0_0_20px_rgba(16,185,129,0.2)] backdrop-blur-md"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 focus:border-white text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-white/50 backdrop-blur-md transition-all"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 backdrop-blur-md"
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

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, Youtube, Github, X } from 'lucide-react';
import { FallingBeamsCanvas } from './FallingBeamsCanvas';

interface FooterSectionProps {
  onGetJarvis?: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onGetJarvis }) => {
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  const handleGetJarvis = () => {
    if (onGetJarvis) {
      onGetJarvis();
    }
  };

  const handleScroll = (id?: string) => {
    if (!id || id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer id="footer" className="relative z-30 w-full bg-black text-white border-t border-white/10 overflow-hidden">
      {/* Falling Beams Background */}
      <FallingBeamsCanvas color="#c379ff" className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40 mix-blend-screen" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 lg:px-16 pt-16 sm:pt-20 pb-12 space-y-16">
        
        {/* COMPACT FOOTER CTA - Centered & Close Proximity to resolve Issue 11, Sentence Case for Issue 8, H2 for Issue 10, Solid button for Issue 15 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 pb-12 border-b border-white/10 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Ready to meet JARVIS?
          </h2>
          <button
            onClick={handleGetJarvis}
            className="px-7 py-3 rounded-full bg-white hover:bg-slate-100 text-black text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.45)] hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
          >
            GET JARVIS
          </button>
        </div>

        {/* FOOTER COLUMNS - Proper H3 levels for Issue 10 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* LEFT — BRAND (Spans 2 columns on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-2xl font-black tracking-widest uppercase text-white">
              JARVIS
            </h3>
            <p className="text-sm text-slate-300 font-light">
              Your AI companion for Android.
            </p>
            <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">
              Voice. Vision. Control.
            </p>
          </div>

          {/* EXPLORE */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono tracking-[0.2em] text-slate-300 uppercase font-semibold">
              EXPLORE
            </h3>
            <ul className="space-y-2.5 text-sm font-light text-slate-300">
              <li>
                <button
                  onClick={() => handleScroll('home')}
                  className="hover:text-white transition-colors duration-200 cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('features')}
                  className="hover:text-white transition-colors duration-200 cursor-pointer text-left"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('vision')}
                  className="hover:text-white transition-colors duration-200 cursor-pointer text-left"
                >
                  Vision
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('control')}
                  className="hover:text-white transition-colors duration-200 cursor-pointer text-left"
                >
                  Control
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('features')}
                  className="hover:text-white transition-colors duration-200 cursor-pointer text-left"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* PRODUCT */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono tracking-[0.2em] text-slate-300 uppercase font-semibold">
              JARVIS
            </h3>
            <ul className="space-y-2.5 text-sm font-light text-slate-300">
              <li>
                <button
                  onClick={handleGetJarvis}
                  className="hover:text-white transition-colors duration-200 cursor-pointer text-left"
                >
                  Get JARVIS
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('JARVIS requires Android 10+ and Accessibility Permissions.')}
                  className="hover:text-white transition-colors duration-200 cursor-pointer text-left"
                >
                  Configuration
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Privacy: JARVIS processes voice and visual inputs securely on-device and via encrypted API streams.')}
                  className="hover:text-white transition-colors duration-200 cursor-pointer text-left"
                >
                  Privacy
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Permissions: Requires Microphone, Camera, and Accessibility service permissions on Android.')}
                  className="hover:text-white transition-colors duration-200 cursor-pointer text-left"
                >
                  Permissions
                </button>
              </li>
            </ul>
          </div>

          {/* CONNECT */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono tracking-[0.2em] text-slate-300 uppercase font-semibold">
              CONNECT
            </h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsGitHubModalOpen(true)}
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200 cursor-pointer"
                aria-label="GitHub Repository"
                title="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </button>
              <a
                href="https://www.youtube.com/@TechGPTX"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200"
                aria-label="YouTube Channel (@TechGPTX)"
                title="YouTube (@TechGPTX)"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/techgptx.ai"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200"
                aria-label="Instagram (@techgptx.ai)"
                title="Instagram (@techgptx.ai)"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM FOOTER */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <p>© 2026 JARVIS. All rights reserved.</p>
          <p>Built for Android · Powered by Gemini Live</p>
        </div>

      </div>

      {/* GitHub Not Added Yet Notice Modal */}
      <AnimatePresence>
        {isGitHubModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGitHubModalOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm bg-black text-white border border-white/20 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.95)] z-10 overflow-hidden my-auto text-center"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsGitHubModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 border border-white/15 hover:bg-white/20 text-slate-400 hover:text-white transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon Frame */}
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-3.5 shadow-[0_0_20px_rgba(255,255,255,0.08)]">
                <Github className="w-7 h-7 text-white" />
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider mb-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                </span>
                <span>Adding Soon</span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-extrabold uppercase tracking-tight text-white mb-2">
                GitHub Not Added Yet
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xs mx-auto mb-6">
                The official GitHub repository for JARVIS AI has not been added yet. We are preparing the public codebase and documentation — it will be added very soon!
              </p>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => setIsGitHubModalOpen(false)}
                className="w-full py-3 px-6 rounded-xl bg-white hover:bg-slate-200 text-black font-extrabold text-xs uppercase tracking-widest transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.45)] active:scale-98 cursor-pointer"
              >
                Got It
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Youtube, Github } from 'lucide-react';
import { FallingBeamsCanvas } from './FallingBeamsCanvas';

interface FooterSectionProps {
  onGetJarvis?: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onGetJarvis }) => {
  const handleGetJarvis = () => {
    if (onGetJarvis) {
      onGetJarvis();
    } else {
      alert('Downloading JARVIS...');
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
              <a
                href="https://github.com/rehaanoffical77-gif/Jarvis-Ai"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200"
                aria-label="Instagram"
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
    </footer>
  );
};

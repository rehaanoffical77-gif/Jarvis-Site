import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GalaxyCanvas } from './components/GalaxyCanvas';
import { HeroContent } from './components/HeroContent';
import { FeaturesSection } from './components/FeaturesSection';
import { DEFAULT_GALAXY_OPTIONS } from './presets';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');

  const navItems = ['Home', 'Features', 'Vision', 'Control', 'How It Works'];

  const handleNavClick = (item: string) => {
    setActiveTab(item);
    if (item === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById('features');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden overflow-y-auto select-none scroll-smooth">
      {/* Section 1: Hero Section with Galaxy Canvas */}
      <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">
        <GalaxyCanvas options={DEFAULT_GALAXY_OPTIONS} />

        {/* Fully Responsive Header Bar (Desktop, Tablet, Mobile) */}
        <header className="absolute top-4 sm:top-6 inset-x-0 z-30 px-4 sm:px-8 md:px-12 lg:px-16">
          <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4 lg:gap-0 min-h-[48px]">
            
            {/* Top Row on Mobile/Tablet / Left on Desktop: Brand Logo + Download Button on mobile */}
            <div className="w-full lg:w-1/4 flex items-center justify-between lg:justify-start shrink-0">
              <span className="text-xl sm:text-2xl font-extrabold tracking-widest uppercase animate-shiny drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                JARVIS
              </span>

              {/* Mobile/Tablet Download Button (Hidden on Desktop) */}
              <button
                onClick={() => alert('Downloading JARVIS...')}
                className="lg:hidden px-4 py-1.5 rounded-full border border-white/40 bg-black/80 hover:bg-white/10 text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_12px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] active:scale-95 cursor-pointer whitespace-nowrap"
              >
                DOWNLOAD JARVIS
              </button>
            </div>

            {/* Center: Navigation Links (Centered on all screen sizes) */}
            <nav className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 overflow-x-auto no-scrollbar py-1 max-w-full">
              {navItems.map((item) => {
                const isActive = activeTab === item;

                return (
                  <button
                    key={item}
                    onClick={() => handleNavClick(item)}
                    className={`relative py-1 text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                      item === 'Vision' ? 'hidden sm:block' : ''
                    } ${
                      isActive
                        ? 'text-white font-bold'
                        : 'text-slate-400 hover:text-slate-100'
                    }`}
                  >
                    <span>{item}</span>
                    {isActive && (
                      <motion.div
                        layoutId="active-underline"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right: Desktop Download Button (Hidden on Mobile/Tablet) */}
            <div className="hidden lg:flex items-center lg:w-1/4 justify-end shrink-0">
              <button
                onClick={() => alert('Downloading JARVIS...')}
                className="px-5 py-2 rounded-full border border-white/40 bg-black/80 hover:bg-white/10 text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_12px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                DOWNLOAD JARVIS
              </button>
            </div>
          </div>
        </header>

        {/* Home Hero Content */}
        <HeroContent
          onExploreFeatures={() => handleNavClick('Features')}
        />
      </section>

      {/* Section 2: Clean Minimal Features Showcase Section */}
      <FeaturesSection />
    </div>
  );
}




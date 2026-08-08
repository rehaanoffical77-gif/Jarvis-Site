import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GalaxyCanvas } from './components/GalaxyCanvas';
import { HeroContent } from './components/HeroContent';
import { FeaturesSection } from './components/FeaturesSection';
import { VisionSection } from './components/VisionSection';
import { ControlSection } from './components/ControlSection';
import { FooterSection } from './components/FooterSection';
import { LaunchingSoonModal } from './components/LaunchingSoonModal';
import { DEFAULT_GALAXY_OPTIONS } from './presets';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = ['Home', 'Features', 'Vision', 'Control', 'How It Works'];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleNavClick = (item: string) => {
    setActiveTab(item);
    if (item === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item === 'Vision') {
      const el = document.getElementById('vision');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (item === 'Control') {
      const el = document.getElementById('control');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const el = document.getElementById('features');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden overflow-y-auto select-none scroll-smooth">
      {/* Launching Soon Modal Popup */}
      <LaunchingSoonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Section 1: Hero Section with Galaxy Canvas */}
      <section className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
        <GalaxyCanvas options={DEFAULT_GALAXY_OPTIONS} />

        {/* Fully Responsive Header Bar (Desktop, Tablet, Mobile) */}
        <header className="absolute top-0 inset-x-0 z-30 pt-3 sm:pt-6 pb-4 px-4 sm:px-8 md:px-12 lg:px-16 bg-gradient-to-b from-black/90 via-black/60 to-transparent backdrop-blur-[2px]">
          <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-2.5 sm:gap-4 lg:gap-0 min-h-[48px]">
            
            {/* Top Row on Mobile/Tablet / Left on Desktop: Brand Logo + Download Button on mobile */}
            <div className="w-full lg:w-1/4 flex items-center justify-between lg:justify-start shrink-0">
              <span className="text-xl sm:text-2xl font-extrabold tracking-widest uppercase animate-shiny drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                JARVIS
              </span>

              {/* Mobile/Tablet Download Button (Hidden on Desktop) */}
              <button
                onClick={handleOpenModal}
                className="lg:hidden px-3.5 py-1.5 rounded-full border border-white/40 bg-black/80 hover:bg-white/10 text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_12px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] active:scale-95 cursor-pointer whitespace-nowrap"
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
                onClick={handleOpenModal}
                className="px-5 py-2 rounded-full border border-white/40 bg-black/80 hover:bg-white/10 text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_12px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                DOWNLOAD JARVIS
              </button>
            </div>
          </div>
        </header>

        {/* Home Hero Content */}
        <HeroContent
          onGetJarvis={handleOpenModal}
          onExploreFeatures={() => handleNavClick('Features')}
        />
      </section>

      {/* Section 2: Clean Minimal Features Showcase Section */}
      <FeaturesSection />

      {/* Section 3: Vision Section with Silk WebGL Background */}
      <VisionSection />

      {/* Section 4: Control Section with Clean Black Screen */}
      <ControlSection />

      {/* Section 5: Empty Footer Space */}
      <FooterSection onGetJarvis={handleOpenModal} />
    </div>
  );
}




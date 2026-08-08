import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CinematicJarvisTitle } from './CinematicJarvisTitle';

interface HeroContentProps {
  onGetJarvis?: () => void;
  onExploreFeatures?: () => void;
}

interface BoxButtonProps {
  onClick: () => void;
  primary?: boolean;
  children: React.ReactNode;
}

const BoxButton: React.FC<BoxButtonProps> = ({ onClick, primary = false, children }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Disable magnetic motion on mobile screens (< 640px)
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Magnetic pull towards cursor relative to center of button (PC/Tablet)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = (x - centerX) * 0.35; // Strength multiplier
    const deltaY = (y - centerY) * 0.35;
    setOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setOffset({ x: 0, y: 0 });
  };

  const handleTouchStart = () => {
    setIsTapped(true);
  };

  const handleTouchEnd = () => {
    setTimeout(() => setIsTapped(false), 300);
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      animate={{ x: offset.x, y: offset.y }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      className={`relative group overflow-hidden w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 cursor-pointer border select-none active:scale-95 ${
        primary
          ? 'bg-white text-black border-white hover:border-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.45)]'
          : 'bg-black/60 text-white border-white/30 hover:border-white/70 shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-sm'
      }`}
    >
      {/* Mobile-only ambient pulse shimmer animation */}
      <span className="sm:hidden absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse pointer-events-none" />

      {/* Mobile-only touch ripple/flash feedback animation on tap */}
      {isTapped && (
        <motion.span
          initial={{ opacity: 0.6, scale: 0.8 }}
          animate={{ opacity: 0, scale: 1.4 }}
          transition={{ duration: 0.4 }}
          className={`sm:hidden absolute inset-0 rounded-2xl pointer-events-none ${
            primary ? 'bg-black/25' : 'bg-white/35'
          }`}
        />
      )}

      {/* Mouse Tracker Glow Effect - Hidden on Mobile */}
      {isHovered && (
        <span
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-2xl hidden sm:block"
          style={{
            background: primary
              ? `radial-gradient(130px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0.18), transparent 70%)`
              : `radial-gradient(140px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.28), transparent 70%)`,
          }}
        />
      )}

      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export const HeroContent: React.FC<HeroContentProps> = ({
  onGetJarvis,
  onExploreFeatures,
}) => {
  const handleGetJarvis = () => {
    if (onGetJarvis) {
      onGetJarvis();
    } else {
      alert('Downloading JARVIS...');
    }
  };

  const handleExploreFeatures = () => {
    if (onExploreFeatures) {
      onExploreFeatures();
    } else {
      alert('Exploring JARVIS features...');
    }
  };

  return (
    <section className="relative z-20 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 pointer-events-none pt-12 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-5 sm:space-y-6 md:space-y-7 pointer-events-auto"
      >
        {/* Cinematic Title & A.I. CHARACTER Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-full"
        >
          <CinematicJarvisTitle />
        </motion.div>

        {/* Primary Subheading / Product Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-base sm:text-2xl md:text-3xl font-light text-slate-200 tracking-tight leading-snug px-2"
        >
          Your voice. Your device. One intelligent assistant.
        </motion.p>

        {/* Compact Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="max-w-[560px] text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed font-normal px-4"
        >
          Talk naturally. Let JARVIS see, understand, research, and take action across your Android device.
        </motion.p>

        {/* Magnetic CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 pt-2 w-full sm:w-auto"
        >
          {/* Primary CTA */}
          <BoxButton onClick={handleGetJarvis} primary>
            GET JARVIS
          </BoxButton>

          {/* Secondary CTA */}
          <BoxButton onClick={handleExploreFeatures}>
            EXPLORE FEATURES
          </BoxButton>
        </motion.div>

        {/* Capability Metadata Line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="pt-2 sm:pt-3 text-[10px] sm:text-xs font-medium tracking-[0.22em] uppercase text-slate-500 flex items-center justify-center gap-2 sm:gap-3 flex-wrap"
        >
          <span>VOICE</span>
          <span className="text-slate-700">·</span>
          <span>VISION</span>
          <span className="text-slate-700">·</span>
          <span>RESEARCH</span>
          <span className="text-slate-700">·</span>
          <span>ANDROID CONTROL</span>
        </motion.div>
      </motion.div>
    </section>
  );
};


import React from 'react';

export const CinematicJarvisTitle: React.FC = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center select-none py-1 px-0 sm:px-1">
      {/* Background ambient light streak behind title - ultra subtle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:w-3/4 h-24 bg-white/[0.03] blur-3xl rounded-full pointer-events-none" />

      {/* Semantic Accessible H1 Heading for screen readers and search engines */}
      <h1 className="sr-only">JARVIS AI — Intelligent Assistant for Android</h1>

      {/* SVG Cinematic Textured Title - Larger on Mobile */}
      <svg
        viewBox="0 0 920 200"
        className="w-[108%] -mx-[4%] sm:w-full sm:mx-0 h-auto max-h-[210px] xs:max-h-[230px] sm:max-h-[230px] md:max-h-[280px] overflow-visible drop-shadow-[0_0_25px_rgba(255,255,255,0.12)]"
        aria-hidden="true"
      >
        <defs>
          {/* Weathered Metallic Micro-Noise Texture */}
          <filter id="metal-grain" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves="4"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="
                0.25 0.25 0.25 0 0
                0.25 0.25 0.25 0 0
                0.25 0.25 0.25 0 0
                0 0 0 0.35 0
              "
              result="monoNoise"
            />
            <feComposite operator="in" in2="SourceGraphic" result="texturedGraphic" />
          </filter>

          {/* Silver/Off-White Metallic Base Gradient */}
          <linearGradient id="silver-base" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="20%" stopColor="#F1F5F9" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="80%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>

          {/* Animated Sheen / Moving Light Highlight Sweep */}
          <linearGradient id="light-sweep" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            <animate
              attributeName="x1"
              from="-150%"
              to="250%"
              dur="7s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              from="-50%"
              to="350%"
              dur="7s"
              repeatCount="indefinite"
            />
          </linearGradient>

          {/* Subtle Directional Bevel Highlight */}
          <linearGradient id="bevel-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <g textAnchor="middle" x="460" y="150">
          {/* Layer 1: Ambient Rim / Shadow Glow */}
          <text
            x="460"
            y="150"
            fontSize="188"
            fontWeight="900"
            fontFamily="Oswald, 'Bebas Neue', 'Plus Jakarta Sans', sans-serif"
            letterSpacing="18"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeOpacity="0.12"
          >
            JARVIS
          </text>

          {/* Layer 2: Main Weathered Metallic Text */}
          <text
            x="460"
            y="150"
            fontSize="188"
            fontWeight="900"
            fontFamily="Oswald, 'Bebas Neue', 'Plus Jakarta Sans', sans-serif"
            letterSpacing="18"
            fill="url(#silver-base)"
            filter="url(#metal-grain)"
          >
            JARVIS
          </text>

          {/* Layer 3: Moving Light Shimmer Overlay */}
          <text
            x="460"
            y="150"
            fontSize="188"
            fontWeight="900"
            fontFamily="Oswald, 'Bebas Neue', 'Plus Jakarta Sans', sans-serif"
            letterSpacing="18"
            fill="url(#light-sweep)"
            style={{ mixBlendMode: 'screen' }}
          >
            JARVIS
          </text>

          {/* Layer 4: Crisp Edge Outline Highlight */}
          <text
            x="460"
            y="150"
            fontSize="188"
            fontWeight="900"
            fontFamily="Oswald, 'Bebas Neue', 'Plus Jakarta Sans', sans-serif"
            letterSpacing="18"
            fill="none"
            stroke="url(#bevel-highlight)"
            strokeWidth="1.2"
            strokeOpacity="0.65"
          >
            JARVIS
          </text>
        </g>
      </svg>

      {/* Subtitle Badge: ──── A.I. CHARACTER ──── */}
      <div className="mt-2 sm:mt-3 flex items-center justify-center gap-3 sm:gap-5 w-full max-w-md px-4">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-white/40" />
        <span className="text-[11px] sm:text-xs md:text-sm font-medium tracking-[0.35em] uppercase text-slate-300/90 whitespace-nowrap">
          A.I. CHARACTER
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-white/20 to-white/40" />
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { StarrySkyCanvas } from './StarrySkyCanvas';
import {
  Mic,
  Camera,
  Smartphone,
  Pointer,
  Play,
  Phone,
  Globe,
  Bot,
  Sliders,
  ArrowUpRight
} from 'lucide-react';

interface FeatureItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    id: '01',
    icon: Mic,
    title: 'Real-Time Voice',
    description:
      'Talk naturally with JARVIS through fast, bidirectional voice conversations powered by Gemini Live.',
  },
  {
    id: '02',
    icon: Camera,
    title: 'Camera Vision',
    description:
      'Let JARVIS see through your camera and understand the visual context around you.',
  },
  {
    id: '03',
    icon: Smartphone,
    title: 'Screen Vision',
    description:
      "Give JARVIS visual context from your Android screen so it can better understand what you're doing.",
  },
  {
    id: '04',
    icon: Pointer,
    title: 'Android Control',
    description:
      'JARVIS can interact with supported Android interfaces through accessibility-based actions.',
  },
  {
    id: '05',
    icon: Play,
    title: 'YouTube Control',
    description:
      'Search, play, pause, skip, seek and control supported YouTube actions using your voice.',
  },
  {
    id: '06',
    icon: Phone,
    title: 'Smart Calling',
    description:
      'Call contacts naturally by name with contact matching and supported SIM selection.',
  },
  {
    id: '07',
    icon: Globe,
    title: 'Web Research',
    description:
      'Ask JARVIS to search the web and bring useful information back into your conversation.',
  },
  {
    id: '08',
    icon: Bot,
    title: 'Floating Assistant',
    description:
      'Keep JARVIS available through the floating assistant while you use other apps.',
  },
  {
    id: '09',
    icon: Sliders,
    title: 'Personalized Experience',
    description:
      'Choose your preferred voice, personality and assistant settings to make JARVIS feel more personal.',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section
      id="features"
      className="relative z-30 w-full text-white py-16 sm:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-16 border-t border-white/[0.08] overflow-hidden bg-[#121218]"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #1a1a22 0%, #121218 70%)',
      }}
    >
      {/* Animated Starry Sky Canvas Background */}
      <StarrySkyCanvas />

      <div className="relative z-10 max-w-7xl mx-auto space-y-16 sm:space-y-20">
        
        {/* SECTION INTRO */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto space-y-4"
        >
          {/* Small Label */}
          <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-slate-300">
            Capabilities
          </span>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Everything you need. <br className="hidden sm:inline" />
            <span className="text-slate-400 font-bold">One intelligent assistant.</span>
          </h2>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed pt-1 max-w-xl mx-auto">
            JARVIS combines real-time voice, vision, research, and Android control in one assistant.
          </p>
        </motion.div>

        {/* FEATURE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.5,
                  delay: (index % 3) * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/25 hover:bg-white/[0.06] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,255,255,0.08)]"
              >
                <div className="space-y-4">
                  {/* Icon & Arrow Header */}
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-sm shadow-black/40 group-hover:scale-105 group-hover:bg-white group-hover:text-black transition-all duration-300">
                      <Icon className="w-5 h-5 stroke-[2.25]" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 transition-colors duration-300" />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2 pt-1">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

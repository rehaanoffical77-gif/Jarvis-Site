import React from 'react';
import { motion } from 'motion/react';
import {
  LayoutGrid,
  MousePointer,
  Scroll,
  Play,
  Phone,
  Bot,
  ArrowUpRight,
} from 'lucide-react';
import { ParticlesCanvas } from './ParticlesCanvas';

interface ControlSectionProps {
  onGetJarvis?: () => void;
}

export const ControlSection: React.FC<ControlSectionProps> = ({ onGetJarvis }) => {
  const handleGetJarvis = () => {
    if (onGetJarvis) {
      onGetJarvis();
    } else {
      alert('Downloading JARVIS...');
    }
  };

  const cards = [
    {
      icon: LayoutGrid,
      title: 'Open Apps',
      description: 'Open supported Android apps instantly with a simple voice command.',
      example: '“Open YouTube.”',
    },
    {
      icon: MousePointer,
      title: 'Tap & Navigate',
      description: 'Interact with supported app interfaces using voice-directed taps and navigation.',
      example: '“Tap Login.” • “Go back.” • “Open Recents.”',
    },
    {
      icon: Scroll,
      title: 'Scroll & Type',
      description: 'Ask JARVIS to scroll through supported screens or enter text for you.',
      example: '“Scroll down.” • “Type this message.”',
    },
    {
      icon: Play,
      title: 'YouTube Control',
      description: 'Search and control supported YouTube actions using your voice.',
      example: '“Play this video.” • “Pause.” • “Skip ahead.”',
    },
    {
      icon: Phone,
      title: 'Smart Calling',
      description: 'Call contacts naturally by name with contact matching and supported SIM selection.',
      example: '“Call Mom.”',
    },
    {
      icon: Bot,
      title: 'Floating Assistant',
      description: 'Keep JARVIS available while you use other apps through the floating assistant.',
      example: 'Available anywhere on screen',
    },
  ];

  return (
    <section
      id="control"
      className="relative z-30 w-full min-h-screen bg-black text-white py-20 sm:py-28 lg:py-36 px-6 md:px-12 lg:px-16 border-t border-white/10 overflow-hidden"
    >
      {/* Interactive Particles Background */}
      <ParticlesCanvas />

      {/* Foreground Container */}
      <div className="relative z-10 max-w-6xl mx-auto space-y-20 sm:space-y-28">
        
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-left space-y-4 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-slate-300 uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>JARVIS Control</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase leading-tight">
            Say it. <span className="text-slate-400">JARVIS does it.</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-2xl">
            Control supported apps and Android interfaces using your voice. JARVIS understands your command and performs the action for you.
          </p>
        </motion.div>

        {/* CONTROL FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/25 backdrop-blur-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:bg-white/[0.06]"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:scale-105 group-hover:bg-white group-hover:text-black transition-all duration-300 mb-6">
                    <Icon className="w-5 h-5 stroke-[2.25]" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 tracking-wide">
                    {card.title}
                  </h3>

                  <p className="text-slate-300 text-sm font-light leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                  <span className="text-xs font-mono text-slate-200 bg-white/[0.05] border border-white/10 px-2.5 py-1.5 rounded-lg leading-snug">
                    {card.example}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* SMALL SUPPORTING SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="pt-12 border-t border-white/10 text-center space-y-4 max-w-2xl mx-auto"
        >
          <span className="text-xs font-mono tracking-[0.2em] text-slate-300 uppercase font-semibold">
            Voice → Action
          </span>

          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Your phone, at your command.
          </h3>

          <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
            Speak naturally. JARVIS interprets your request and uses supported Android capabilities to perform the action.
          </p>

          <p className="text-xs font-mono text-slate-400 uppercase tracking-wider pt-2">
            Powered by Android Accessibility
          </p>
        </motion.div>

        {/* FINAL CTA - Standardized solid primary button to resolve Issue 15 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="pt-12 border-t border-white/10 text-center space-y-6"
        >
          <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Ready to put JARVIS in control?
          </h3>

          <div>
            <button
              onClick={handleGetJarvis}
              className="px-7 py-3 rounded-full bg-white hover:bg-slate-100 text-black text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.45)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              GET JARVIS
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

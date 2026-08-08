import React from 'react';
import { motion } from 'motion/react';
import { Camera, Smartphone, Eye, Sparkles } from 'lucide-react';
import { SilkCanvas } from './SilkCanvas';

export const VisionSection: React.FC = () => {
  const capabilities = [
    {
      icon: Camera,
      number: '01',
      title: 'Camera Vision',
      description: "Use your camera to give JARVIS visual context and ask questions about what you're looking at.",
    },
    {
      icon: Smartphone,
      number: '02',
      title: 'Screen Vision',
      description: "Let JARVIS understand what's happening on your Android screen and use it as context for your conversation.",
    },
    {
      icon: Eye,
      number: '03',
      title: 'Visual Understanding',
      description: 'Combine what you say with what JARVIS can see for more contextual responses.',
    },
  ];

  const examplePrompts = [
    '“What am I looking at?”',
    '“What’s on my screen?”',
    '“Read this for me.”',
    '“What does this say?”',
  ];

  return (
    <section
      id="vision"
      className="relative z-30 w-full bg-[#0c0c0e] text-white py-24 sm:py-32 lg:py-40 px-6 md:px-12 lg:px-16 border-t border-white/10 overflow-hidden"
    >
      {/* Silk WebGL Shader Background */}
      <SilkCanvas />

      {/* Subtle Futuristic Radial Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-white/[0.06] via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-20 sm:space-y-28">
        
        {/* HEADER SECTION - Ultra Minimalist & High Contrast */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="space-y-6 text-left max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-slate-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>JARVIS VISION</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase leading-[1.05]">
            JARVIS <span className="text-slate-400">can see.</span>
          </h2>

          <p className="text-slate-300 text-lg sm:text-2xl font-light leading-relaxed max-w-2xl">
            Give JARVIS visual context. Let it understand what you show it.
          </p>
        </motion.div>

        {/* 3 MAIN CAPABILITIES - Sleek Minimalist Cards with Hairline Borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/30 backdrop-blur-md transition-all duration-300 flex flex-col justify-between hover:bg-white/[0.04]"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-105 group-hover:bg-white group-hover:text-black transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono tracking-widest text-slate-500 font-bold">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-wide">
                    {item.title}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* SMALL EXAMPLES SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="pt-8 border-t border-white/10 space-y-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              Show it. Ask it. Understand it.
            </h3>
            <span className="text-xs font-mono tracking-widest text-slate-500 uppercase">
              EXAMPLE PROMPTS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {examplePrompts.map((prompt, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/25 transition-all duration-200 group"
              >
                <p className="text-sm font-mono text-slate-300 group-hover:text-white transition-colors">
                  {prompt}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* BOTTOM STATEMENT */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="pt-12 text-center border-t border-white/10"
        >
          <p className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase">
            See the context. <span className="text-slate-500">Understand the intent.</span>
          </p>
        </motion.div>

      </div>
    </section>
  );
};


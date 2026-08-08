import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  MousePointer,
  RotateCw,
  Palette,
  Maximize2,
  Minimize2,
  RotateCcw,
  Code,
  Camera,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Play,
  Pause
} from 'lucide-react';
import { GalaxyOptions, Preset } from '../types';
import { GALAXY_PRESETS, DEFAULT_GALAXY_OPTIONS } from '../presets';

interface ControlPanelProps {
  options: GalaxyOptions;
  onChange: (options: GalaxyOptions) => void;
  onReset: () => void;
  onOpenExport: () => void;
  onTakeScreenshot: () => void;
  activePresetId?: string;
  onSelectPreset: (preset: Preset) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  options,
  onChange,
  onReset,
  onOpenExport,
  onTakeScreenshot,
  activePresetId,
  onSelectPreset,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'color' | 'motion' | 'interaction'>('presets');

  const updateOption = <K extends keyof GalaxyOptions>(key: K, value: GalaxyOptions[K]) => {
    onChange({
      ...options,
      [key]: value
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-none font-sans">
      {/* Floating Toggle Button when Minimized */}
      {isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/80 backdrop-blur-xl border border-white/15 text-white shadow-2xl hover:bg-black/90 hover:border-cyan-500/50 transition-all duration-200 group cursor-pointer"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <Sliders className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform" />
          <span className="text-xs font-semibold tracking-wide uppercase">Galaxy Controls</span>
        </button>
      )}

      {/* Main Control Panel Card */}
      {!isMinimized && (
        <div className="pointer-events-auto w-[360px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-3rem)] flex flex-col bg-slate-950/85 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl text-slate-100 overflow-hidden transition-all duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  Galaxy Studio
                </h2>
                <p className="text-[10px] text-slate-400">Interactive WebGL Shader</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onTakeScreenshot}
                title="Capture Screenshot"
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenExport}
                title="Export Code"
                className="p-1.5 rounded-lg hover:bg-white/10 text-cyan-400 transition-colors cursor-pointer"
              >
                <Code className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                title="Minimize Panel"
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-white/10 bg-slate-900/60 p-1 gap-1">
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Presets
            </button>
            <button
              onClick={() => setActiveTab('color')}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'color'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Visuals
            </button>
            <button
              onClick={() => setActiveTab('motion')}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'motion'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              Motion
            </button>
            <button
              onClick={() => setActiveTab('interaction')}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'interaction'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <MousePointer className="w-3.5 h-3.5" />
              Physics
            </button>
          </div>

          {/* Scrollable Tab Content */}
          <div className="p-4 space-y-4 overflow-y-auto max-h-[360px] custom-scrollbar">
            
            {/* PRESETS TAB */}
            {activeTab === 'presets' && (
              <div className="space-y-2">
                <p className="text-xs text-slate-400 mb-2">Select a galaxy atmosphere preset:</p>
                <div className="grid grid-cols-1 gap-2">
                  {GALAXY_PRESETS.map((preset) => {
                    const isSelected = activePresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => onSelectPreset(preset)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-950/50'
                            : 'bg-white/5 border-white/10 hover:border-white/20 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-cyan-300">{preset.name}</span>
                          {isSelected && (
                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-400 text-black">
                              Active
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 line-clamp-1">
                          {preset.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VISUALS & COLOR TAB */}
            {activeTab === 'color' && (
              <div className="space-y-3.5 text-xs">
                {/* Hue Shift Slider */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Hue Shift</span>
                    <span className="font-mono text-cyan-400">{Math.round(options.hueShift)}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={options.hueShift}
                    onChange={(e) => updateOption('hueShift', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div
                    className="h-1.5 w-full rounded-full mt-1.5 opacity-80"
                    style={{
                      background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
                    }}
                  />
                </div>

                {/* Saturation */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Color Saturation</span>
                    <span className="font-mono text-cyan-400">{options.saturation.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={options.saturation}
                    onChange={(e) => updateOption('saturation', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Glow Intensity */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Glow Intensity</span>
                    <span className="font-mono text-cyan-400">{options.glowIntensity.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.05"
                    value={options.glowIntensity}
                    onChange={(e) => updateOption('glowIntensity', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Star Density */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Star Density</span>
                    <span className="font-mono text-cyan-400">{options.density.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="3"
                    step="0.1"
                    value={options.density}
                    onChange={(e) => updateOption('density', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Transparent Canvas Toggle */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-slate-200 font-medium">Transparent Canvas</span>
                    <p className="text-[10px] text-slate-400">Allow background color overlay</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={options.transparent}
                    onChange={(e) => updateOption('transparent', e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-400 cursor-pointer accent-cyan-400"
                  />
                </div>
              </div>
            )}

            {/* MOTION TAB */}
            {activeTab === 'motion' && (
              <div className="space-y-3.5 text-xs">
                {/* Animation Pause/Play */}
                <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl border border-white/10">
                  <span className="text-slate-200 font-medium">Shader Animation</span>
                  <button
                    onClick={() => updateOption('disableAnimation', !options.disableAnimation)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      options.disableAnimation
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {options.disableAnimation ? (
                      <>
                        <Play className="w-3 h-3" /> Paused
                      </>
                    ) : (
                      <>
                        <Pause className="w-3 h-3" /> Playing
                      </>
                    )}
                  </button>
                </div>

                {/* Overall Speed */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Overall Speed</span>
                    <span className="font-mono text-cyan-400">{options.speed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={options.speed}
                    onChange={(e) => updateOption('speed', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Star Speed */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Layer Depth Speed</span>
                    <span className="font-mono text-cyan-400">{options.starSpeed.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.05"
                    value={options.starSpeed}
                    onChange={(e) => updateOption('starSpeed', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Rotation Speed */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Rotation Speed</span>
                    <span className="font-mono text-cyan-400">{options.rotationSpeed.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-0.5"
                    max="0.5"
                    step="0.01"
                    value={options.rotationSpeed}
                    onChange={(e) => updateOption('rotationSpeed', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Twinkle Intensity */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Twinkle Intensity</span>
                    <span className="font-mono text-cyan-400">{options.twinkleIntensity.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={options.twinkleIntensity}
                    onChange={(e) => updateOption('twinkleIntensity', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              </div>
            )}

            {/* INTERACTION & PHYSICS TAB */}
            {activeTab === 'interaction' && (
              <div className="space-y-3.5 text-xs">
                {/* Mouse Interaction Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-200 font-medium">Mouse Interaction</span>
                    <p className="text-[10px] text-slate-400">Respond to cursor movements</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={options.mouseInteraction}
                    onChange={(e) => updateOption('mouseInteraction', e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-400 cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Mouse Repulsion Toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div>
                    <span className="text-slate-200 font-medium">Mouse Repulsion</span>
                    <p className="text-[10px] text-slate-400">Push stars away from cursor</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={options.mouseRepulsion}
                    onChange={(e) => updateOption('mouseRepulsion', e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-400 cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Repulsion Strength */}
                {options.mouseRepulsion && (
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Repulsion Strength</span>
                      <span className="font-mono text-cyan-400">{options.repulsionStrength.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="8"
                      step="0.1"
                      value={options.repulsionStrength}
                      onChange={(e) => updateOption('repulsionStrength', parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                )}

                {/* Auto Center Repulsion */}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Auto Center Force</span>
                    <span className="font-mono text-cyan-400">{options.autoCenterRepulsion.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={options.autoCenterRepulsion}
                    onChange={(e) => updateOption('autoCenterRepulsion', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Applies central gravitational radial force outward
                  </p>
                </div>

                {/* Focal Offset */}
                <div className="pt-2 border-t border-white/10">
                  <span className="text-slate-200 font-medium block mb-2">Focal Center Point</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400">X Position ({options.focal[0].toFixed(2)})</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={options.focal[0]}
                        onChange={(e) => updateOption('focal', [parseFloat(e.target.value), options.focal[1]])}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Y Position ({options.focal[1].toFixed(2)})</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={options.focal[1]}
                        onChange={(e) => updateOption('focal', [options.focal[0], parseFloat(e.target.value)])}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Reset & Export */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-slate-900/80">
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>

            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Code className="w-3.5 h-3.5" />
              Get Code
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

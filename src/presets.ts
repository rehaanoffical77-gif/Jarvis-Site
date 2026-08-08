import { GalaxyOptions, Preset } from './types';

export const DEFAULT_GALAXY_OPTIONS: GalaxyOptions = {
  focal: [0.5, 0.5],
  rotation: [1.0, 0.0],
  starSpeed: 0.12,
  density: 1,
  hueShift: 0,
  disableAnimation: false,
  speed: 0.25,
  mouseInteraction: false,
  glowIntensity: 0.3,
  saturation: 0.0,
  mouseRepulsion: false,
  twinkleIntensity: 0.2,
  rotationSpeed: 0.02,
  repulsionStrength: 0,
  autoCenterRepulsion: 0,
  transparent: false
};

export const GALAXY_PRESETS: Preset[] = [
  {
    id: 'original',
    name: 'Original Cyan Glow',
    description: 'The iconic default starfield with balanced hue shift and gentle rotation',
    options: { ...DEFAULT_GALAXY_OPTIONS }
  },
  {
    id: 'hyper-drive',
    name: 'Hyper Warp Drive',
    description: 'Fast moving dense starfield with high twinkle and intense spin',
    options: {
      starSpeed: 2.2,
      density: 1.8,
      speed: 2.5,
      hueShift: 210,
      glowIntensity: 0.8,
      twinkleIntensity: 0.7,
      rotationSpeed: 0.45,
      repulsionStrength: 4.0,
      saturation: 0.4
    }
  },
  {
    id: 'deep-nebula',
    name: 'Magenta Deep Space',
    description: 'Rich violet/magenta star cluster with subtle drift and soft glow',
    options: {
      hueShift: 280,
      saturation: 0.7,
      glowIntensity: 0.5,
      starSpeed: 0.3,
      rotationSpeed: 0.05,
      density: 1.3,
      twinkleIntensity: 0.4,
      repulsionStrength: 1.5
    }
  },
  {
    id: 'emerald-aurora',
    name: 'Emerald Aurora',
    description: 'Vibrant green cosmic dust drifting gently through space',
    options: {
      hueShift: 90,
      saturation: 0.8,
      glowIntensity: 0.45,
      starSpeed: 0.4,
      speed: 0.8,
      density: 1.1,
      rotationSpeed: -0.08,
      twinkleIntensity: 0.5
    }
  },
  {
    id: 'supernova',
    name: 'Golden Supernova',
    description: 'Blazing golden star explosion with auto-center repulsion force',
    options: {
      hueShift: 30,
      saturation: 0.9,
      glowIntensity: 0.9,
      density: 2.0,
      starSpeed: 1.2,
      speed: 1.5,
      autoCenterRepulsion: 1.5,
      rotationSpeed: 0.2,
      twinkleIntensity: 0.6
    }
  },
  {
    id: 'cyberpunk-violet',
    name: 'Cyberpunk Pulse',
    description: 'High saturation neon stars reacting strongly to cursor movements',
    options: {
      hueShift: 310,
      saturation: 1.0,
      glowIntensity: 0.6,
      density: 1.5,
      mouseRepulsion: true,
      repulsionStrength: 5.0,
      rotationSpeed: 0.15,
      speed: 1.2
    }
  },
  {
    id: 'minimal-cosmos',
    name: 'Zen Starfield',
    description: 'Sparse, slow-twinkling stars for ambient minimal backgrounds',
    options: {
      density: 0.5,
      starSpeed: 0.2,
      speed: 0.5,
      glowIntensity: 0.2,
      twinkleIntensity: 0.8,
      rotationSpeed: 0.02,
      saturation: 0.1,
      hueShift: 180
    }
  }
];

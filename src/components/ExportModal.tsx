import React, { useState } from 'react';
import { X, Copy, Check, Code, FileText, Sparkles } from 'lucide-react';
import { GalaxyOptions } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: GalaxyOptions;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, options }) => {
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<'html' | 'react'>('html');

  if (!isOpen) return null;

  const htmlSnippet = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Galaxy Background</title>
<style>
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    background: #000;
    overflow: hidden;
  }

  #galaxy-wrapper {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
  }

  #galaxy-container {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  #galaxy-container canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
</head>
<body>

<div id="galaxy-wrapper">
  <div id="galaxy-container"></div>
</div>

<script type="module">
import { Renderer, Triangle, Program, Vec3, Mesh } from "https://esm.sh/ogl@1.0.11";

const options = ${JSON.stringify(options, null, 2)};

const vertexShader = \`
  attribute vec2 uv;
  attribute vec2 position;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
\`;

const fragmentShader = \`
  precision highp float;

  uniform float uTime;
  uniform vec3 uResolution;
  uniform vec2 uFocal;
  uniform vec2 uRotation;
  uniform float uStarSpeed;
  uniform float uDensity;
  uniform float uHueShift;
  uniform float uSpeed;
  uniform vec2 uMouse;
  uniform float uGlowIntensity;
  uniform float uSaturation;
  uniform bool uMouseRepulsion;
  uniform float uTwinkleIntensity;
  uniform float uRotationSpeed;
  uniform float uRepulsionStrength;
  uniform float uMouseActiveFactor;
  uniform float uAutoCenterRepulsion;
  uniform bool uTransparent;

  varying vec2 vUv;

  #define NUM_LAYER 4.0
  #define STAR_COLOR_CUTOFF 0.2
  #define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
  #define PERIOD 3.0

  float Hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float tri(float x) {
    return abs(fract(x) * 2.0 - 1.0);
  }

  float tris(float x) {
    float t = fract(x);
    return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
  }

  float trisn(float x) {
    float t = fract(x);
    return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
  }

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  float Star(vec2 uv, float flare) {
    float d = length(uv);
    float m = (0.05 * uGlowIntensity) / d;
    float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
    m += rays * flare * uGlowIntensity;
    uv *= MAT45;
    rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
    m += rays * 0.3 * flare * uGlowIntensity;
    m *= smoothstep(1.0, 0.2, d);
    return m;
  }

  vec3 StarLayer(vec2 uv) {
    vec3 col = vec3(0.0);

    vec2 gv = fract(uv) - 0.5;
    vec2 id = floor(uv);

    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 offset = vec2(float(x), float(y));
        vec2 si = id + vec2(float(x), float(y));
        float seed = Hash21(si);
        float size = fract(seed * 345.32);
        float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
        float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

        float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
        float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
        float grn = min(red, blu) * seed;
        vec3 base = vec3(red, grn, blu);

        float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
        hue = fract(hue + uHueShift / 360.0);
        float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
        float val = max(max(base.r, base.g), base.b);
        base = hsv2rgb(vec3(hue, sat, val));

        vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;

        float star = Star(gv - offset - pad, flareSize);
        vec3 color = base;

        float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
        twinkle = mix(1.0, twinkle, uTwinkleIntensity);
        star *= twinkle;

        col += star * size * color;
      }
    }

    return col;
  }

  void main() {
    vec2 focalPx = uFocal * uResolution.xy;
    vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

    vec2 mouseNorm = uMouse - vec2(0.5);

    if (uAutoCenterRepulsion > 0.0) {
      vec2 centerUV = vec2(0.0, 0.0);
      float centerDist = length(uv - centerUV);
      vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
      uv += repulsion * 0.05;
    } else if (uMouseRepulsion) {
      vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
      float mouseDist = length(uv - mousePosUV);
      vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
      uv += repulsion * 0.05 * uMouseActiveFactor;
    } else {
      vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
      uv += mouseOffset;
    }

    float autoRotAngle = uTime * uRotationSpeed;
    mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
    uv = autoRot * uv;

    uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

    vec3 col = vec3(0.0);

    for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
      float depth = fract(i + uStarSpeed * uSpeed);
      float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
      float fade = depth * smoothstep(1.0, 0.9, depth);
      col += StarLayer(uv * scale + i * 453.32) * fade;
    }

    if (uTransparent) {
      float alpha = length(col);
      alpha = smoothstep(0.0, 0.3, alpha);
      alpha = min(alpha, 1.0);
      gl_FragColor = vec4(col, alpha);
    } else {
      gl_FragColor = vec4(col, 1.0);
    }
  }
\`;

const wrapper = document.getElementById('galaxy-wrapper');
const container = document.getElementById('galaxy-container');

const renderer = new Renderer({
  alpha: options.transparent,
  premultipliedAlpha: false
});
const gl = renderer.gl;

if (options.transparent) {
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);
} else {
  gl.clearColor(0, 0, 0, 1);
}

container.appendChild(gl.canvas);

const geometry = new Triangle(gl);
const program = new Program(gl, {
  vertex: vertexShader,
  fragment: fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: new Vec3(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height) },
    uFocal: { value: new Float32Array(options.focal) },
    uRotation: { value: new Float32Array(options.rotation) },
    uStarSpeed: { value: options.starSpeed },
    uDensity: { value: options.density },
    uHueShift: { value: options.hueShift },
    uSpeed: { value: options.speed },
    uMouse: { value: new Float32Array([0.5, 0.5]) },
    uGlowIntensity: { value: options.glowIntensity },
    uSaturation: { value: options.saturation },
    uMouseRepulsion: { value: options.mouseRepulsion },
    uTwinkleIntensity: { value: options.twinkleIntensity },
    uRotationSpeed: { value: options.rotationSpeed },
    uRepulsionStrength: { value: options.repulsionStrength },
    uMouseActiveFactor: { value: 0.0 },
    uAutoCenterRepulsion: { value: options.autoCenterRepulsion },
    uTransparent: { value: options.transparent }
  }
});
const mesh = new Mesh(gl, { geometry, program });

function resize() {
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  const w = gl.canvas.width;
  const h = gl.canvas.height;
  program.uniforms.uResolution.value.set(w, h, w / h);
}
window.addEventListener('resize', resize, false);
resize();

let targetMousePos = { x: 0.5, y: 0.5 };
let smoothMousePos = { x: 0.5, y: 0.5 };
let targetMouseActive = 0.0;
let smoothMouseActive = 0.0;

if (options.mouseInteraction) {
  const onPointerMove = (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height;
    targetMousePos = { x, y };
    targetMouseActive = 1.0;
  };
  const onPointerLeave = () => {
    targetMouseActive = 0.0;
  };
  wrapper.addEventListener('pointermove', onPointerMove, { passive: true });
  wrapper.addEventListener('pointerleave', onPointerLeave, { passive: true });
  wrapper.addEventListener('pointerdown', onPointerMove, { passive: true });
}

function loop(t) {
  requestAnimationFrame(loop);

  if (!options.disableAnimation) {
    program.uniforms.uTime.value = t * 0.001;
    program.uniforms.uStarSpeed.value = (t * 0.001 * options.starSpeed) / 10.0;
  }

  const lerp = 0.05;
  smoothMousePos.x += (targetMousePos.x - smoothMousePos.x) * lerp;
  smoothMousePos.y += (targetMousePos.y - smoothMousePos.y) * lerp;
  smoothMouseActive += (targetMouseActive - smoothMouseActive) * lerp;

  program.uniforms.uMouse.value[0] = smoothMousePos.x;
  program.uniforms.uMouse.value[1] = smoothMousePos.y;
  program.uniforms.uMouseActiveFactor.value = smoothMouseActive;

  renderer.render({ scene: mesh });
}
requestAnimationFrame(loop);
</script>

</body>
</html>`;

  const reactSnippet = `// React Component with 'ogl' dependency installed
import React from 'react';
import { GalaxyCanvas } from './GalaxyCanvas';

export const App = () => {
  const options = ${JSON.stringify(options, null, 2)};

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <GalaxyCanvas options={options} />
      
      {/* Your application content overlays here */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white pointer-events-none">
        <h1 className="text-5xl font-bold tracking-widest uppercase">Galaxy</h1>
      </div>
    </div>
  );
};`;

  const codeToCopy = exportFormat === 'html' ? htmlSnippet : reactSnippet;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-white/15 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Export Galaxy Shader Code</h2>
              <p className="text-xs text-slate-400">Copy standalone HTML or React component with your custom settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-white/10 bg-slate-950/40">
          <button
            onClick={() => setExportFormat('html')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              exportFormat === 'html'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <FileText className="w-4 h-4" /> Standalone HTML/JS
          </button>
          <button
            onClick={() => setExportFormat('react')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              exportFormat === 'react'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <Code className="w-4 h-4" /> React + OGL Component
          </button>
        </div>

        {/* Code View */}
        <div className="relative flex-1 p-4 overflow-hidden bg-slate-950/90 font-mono text-xs">
          <pre className="h-full overflow-auto p-4 text-cyan-300/90 leading-relaxed rounded-xl bg-black/50 border border-white/5 custom-scrollbar">
            <code>{codeToCopy}</code>
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-white/10 bg-slate-950/60">
          <span className="text-xs text-slate-400">
            {exportFormat === 'html' ? 'Includes standalone OGL module CDN script' : 'Requires npm install ogl'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="px-5 py-2 text-xs font-bold text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-900" /> Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy Code
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

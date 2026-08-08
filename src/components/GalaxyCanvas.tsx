import React, { useEffect, useRef } from 'react';
import { Renderer, Triangle, Program, Vec3, Mesh } from 'ogl';
import { GalaxyOptions } from '../types';

const vertexShader = `
  attribute vec2 uv;
  attribute vec2 position;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`;

const fragmentShader = `
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
`;

interface GalaxyCanvasProps {
  options: GalaxyOptions;
  className?: string;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export const GalaxyCanvas: React.FC<GalaxyCanvasProps> = ({ options, className = '', onCanvasReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const programRef = useRef<Program | null>(null);
  const rendererRef = useRef<Renderer | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Remove any previously appended canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const renderer = new Renderer({
      alpha: options.transparent,
      premultipliedAlpha: false,
      webgl: 2
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;

    if (options.transparent) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
    } else {
      gl.clearColor(0, 0, 0, 1);
    }

    container.appendChild(gl.canvas);
    if (onCanvasReady) {
      onCanvasReady(gl.canvas);
    }

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
    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!container) return;
      const width = container.offsetWidth || window.innerWidth;
      const height = container.offsetHeight || window.innerHeight;
      renderer.setSize(width, height);
      const w = gl.canvas.width;
      const h = gl.canvas.height;
      program.uniforms.uResolution.value.set(w, h, w / h);
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);
    window.addEventListener('resize', resize, false);
    resize();

    let targetMousePos = { x: 0.5, y: 0.5 };
    let smoothMousePos = { x: 0.5, y: 0.5 };
    let targetMouseActive = 0.0;
    let smoothMouseActive = 0.0;

    const onPointerMove = (e: PointerEvent) => {
      if (!optionsRef.current.mouseInteraction) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMousePos = { x, y };
      targetMouseActive = 1.0;
    };

    const onPointerLeave = () => {
      targetMouseActive = 0.0;
    };

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerleave', onPointerLeave, { passive: true });
    container.addEventListener('pointerdown', onPointerMove, { passive: true });

    let animationFrameId: number;

    function loop(t: number) {
      animationFrameId = requestAnimationFrame(loop);

      const opts = optionsRef.current;

      if (!opts.disableAnimation) {
        program.uniforms.uTime.value = t * 0.001;
        program.uniforms.uStarSpeed.value = (t * 0.001 * opts.starSpeed) / 10.0;
      }

      // Sync updated reactive uniforms
      program.uniforms.uFocal.value[0] = opts.focal[0];
      program.uniforms.uFocal.value[1] = opts.focal[1];
      program.uniforms.uRotation.value[0] = opts.rotation[0];
      program.uniforms.uRotation.value[1] = opts.rotation[1];
      program.uniforms.uDensity.value = opts.density;
      program.uniforms.uHueShift.value = opts.hueShift;
      program.uniforms.uSpeed.value = opts.speed;
      program.uniforms.uGlowIntensity.value = opts.glowIntensity;
      program.uniforms.uSaturation.value = opts.saturation;
      program.uniforms.uMouseRepulsion.value = opts.mouseRepulsion;
      program.uniforms.uTwinkleIntensity.value = opts.twinkleIntensity;
      program.uniforms.uRotationSpeed.value = opts.rotationSpeed;
      program.uniforms.uRepulsionStrength.value = opts.repulsionStrength;
      program.uniforms.uAutoCenterRepulsion.value = opts.autoCenterRepulsion;
      program.uniforms.uTransparent.value = opts.transparent;

      if (opts.transparent) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0, 0, 0, 0);
      } else {
        gl.clearColor(0, 0, 0, 1);
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

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('pointerdown', onPointerMove);
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-full overflow-hidden bg-black select-none ${className}`}
    />
  );
};

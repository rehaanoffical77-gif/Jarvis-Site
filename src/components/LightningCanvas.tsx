import React, { useEffect, useRef } from 'react';

export interface LightningCanvasProps {
  hue?: number;
  xOffset?: number;
  speed?: number;
  intensity?: number;
  size?: number;
  transparent?: boolean;
  hueCycleSpeed?: number;
  flashTimeOut?: number;
  className?: string;
}

export const LightningCanvas: React.FC<LightningCanvasProps> = ({
  hue = 230,
  xOffset = 0.0,
  speed = 1.0,
  intensity = 1.35,
  size = 1.0,
  transparent = true,
  hueCycleSpeed = 20,
  flashTimeOut,
  className = 'absolute inset-0 w-full h-full pointer-events-none',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let running = true;
    let animationFrameId: number | null = null;
    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let vertexShader: WebGLShader | null = null;
    let fragmentShader: WebGLShader | null = null;
    let vertexBuffer: WebGLBuffer | null = null;

    interface UniformLocations {
      iResolution: WebGLUniformLocation | null;
      iTime: WebGLUniformLocation | null;
      uHue: WebGLUniformLocation | null;
      uXOffset: WebGLUniformLocation | null;
      uSpeed: WebGLUniformLocation | null;
      uIntensity: WebGLUniformLocation | null;
      uSize: WebGLUniformLocation | null;
    }

    let locs: UniformLocations = {
      iResolution: null,
      iTime: null,
      uHue: null,
      uXOffset: null,
      uSpeed: null,
      uIntensity: null,
      uSize: null,
    };

    let startTime = performance.now();
    let frameCount = 0;

    const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
      #else
      precision mediump float;
      #endif

      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uHue;
      uniform float uXOffset;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uSize;
      #define OCTAVE_COUNT 10

      vec3 hsv2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        return c.z * mix(vec3(1.0), rgb, c.y);
      }

      float hash11(float p) {
        p = mod(p, 1000.0);
        p = fract(p * .1031);
        p *= p + 33.33;
        p *= p + p;
        return fract(p);
      }

      float hash12(vec2 p) {
        p = mod(p, vec2(1000.0));
        vec3 p3 = fract(vec3(p.xyx) * .1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }

      mat2 rotate2d(float theta) {
        float c = cos(theta);
        float s = sin(theta);
        return mat2(c, -s, s, c);
      }

      float noise(vec2 p) {
        vec2 ip = floor(p);
        vec2 fp = fract(p);
        float a = hash12(ip);
        float b = hash12(ip + vec2(1.0, 0.0));
        float c = hash12(ip + vec2(0.0, 1.0));
        float d = hash12(ip + vec2(1.0, 1.0));
        vec2 t = smoothstep(0.0, 1.0, fp);
        return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < OCTAVE_COUNT; ++i) {
          value += amplitude * noise(p);
          p *= rotate2d(0.45);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec2 uv = fragCoord / iResolution.xy;
        uv = 2.0 * uv - 1.0;
        float aspect = iResolution.x / iResolution.y;
        uv.x *= max(aspect, 1.4);
        uv.x += uXOffset;
        uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;
        float dist = abs(uv.x);
        vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
        vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
        col = pow(col, vec3(1.0));

        ${
          transparent
            ? `
          float alpha = clamp(1.0 - dist * 3.0, 0.0, 1.0);
          fragColor = vec4(col, alpha);
        `
            : 'fragColor = vec4(col, 1.0);'
        }
      }

      void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `;

    function compileShader(src: string, type: number): WebGLShader | null {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Lightning shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function resizeCanvas() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2.0);
      const width = Math.floor((rect.width || 300) * dpr);
      const height = Math.floor((rect.height || 150) * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    }

    function setup() {
      if (!canvas) return;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      resizeCanvas();

      gl = canvas.getContext('webgl', {
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: 'high-performance',
      });

      if (!gl) {
        console.warn('WebGL not supported for Lightning effect');
        return;
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
      fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
      if (!vertexShader || !fragmentShader) return;

      program = gl.createProgram();
      if (!program) return;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Lightning program link error:', gl.getProgramInfoLog(program));
        return;
      }
      gl.useProgram(program);

      const vertices = new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]);

      vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      const aPosition = gl.getAttribLocation(program, 'aPosition');
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

      locs = {
        iResolution: gl.getUniformLocation(program, 'iResolution'),
        iTime: gl.getUniformLocation(program, 'iTime'),
        uHue: gl.getUniformLocation(program, 'uHue'),
        uXOffset: gl.getUniformLocation(program, 'uXOffset'),
        uSpeed: gl.getUniformLocation(program, 'uSpeed'),
        uIntensity: gl.getUniformLocation(program, 'uIntensity'),
        uSize: gl.getUniformLocation(program, 'uSize'),
      };

      startTime = performance.now();
      frameCount = 0;
      render();
    }

    function render() {
      if (!running || !gl || !program) return;

      resizeCanvas();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (locs.iResolution) {
        gl.uniform2f(locs.iResolution, canvas.width, canvas.height);
      }

      const t = (performance.now() - startTime) / 1000.0;
      if (locs.iTime) gl.uniform1f(locs.iTime, t);

      const currentHue = (t * hueCycleSpeed) % 360;
      if (locs.uHue) gl.uniform1f(locs.uHue, currentHue);
      if (locs.uXOffset) gl.uniform1f(locs.uXOffset, xOffset);
      if (locs.uSpeed) gl.uniform1f(locs.uSpeed, speed);
      if (locs.uIntensity) gl.uniform1f(locs.uIntensity, intensity);
      if (locs.uSize) gl.uniform1f(locs.uSize, size);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!flashTimeOut) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      frameCount++;
      const activeFrames = 75;
      if (frameCount < activeFrames) {
        const factor = activeFrames / frameCount;
        if (locs.uIntensity) gl.uniform1f(locs.uIntensity, intensity * factor);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        animationFrameId = requestAnimationFrame(render);
      } else {
        frameCount = 0;
        if (locs.uIntensity) gl.uniform1f(locs.uIntensity, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        setTimeout(() => {
          animationFrameId = requestAnimationFrame(render);
        }, flashTimeOut);
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(canvas);

    setup();

    return () => {
      running = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      if (gl) {
        if (vertexBuffer) gl.deleteBuffer(vertexBuffer);
        if (vertexShader) gl.deleteShader(vertexShader);
        if (fragmentShader) gl.deleteShader(fragmentShader);
        if (program) gl.deleteProgram(program);
      }
    };
  }, [hue, xOffset, speed, intensity, size, transparent, hueCycleSpeed, flashTimeOut]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block bg-transparent pointer-events-none"
      />
    </div>
  );
};

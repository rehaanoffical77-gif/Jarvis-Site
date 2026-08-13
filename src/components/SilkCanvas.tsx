import React, { useEffect, useRef } from 'react';
import { getOptimalDPR } from '../utils/performance';

export const SilkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vertSrc = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragSrc = `
      precision highp float;
      uniform vec2 uRes;
      uniform float uTime;
      uniform float uSpeed;
      uniform float uScale;
      uniform vec3 uColor;
      uniform float uRotation;
      uniform float uNoiseIntensity;

      const float e = 2.71828182845904523536;

      float noise(vec2 texCoord) {
        float G = e;
        vec2 r = (G * sin(G * texCoord));
        return fract(r.x * r.y * (1.0 + texCoord.x));
      }

      vec2 rotateUvs(vec2 uv, float angle) {
        float c = cos(angle);
        float s = sin(angle);
        mat2 rot = mat2(c, s, -s, c);
        return rot * uv;
      }

      void main() {
        vec2 vUv = gl_FragCoord.xy / uRes.xy;

        float rnd = noise(gl_FragCoord.xy);
        vec2 uv = rotateUvs(vUv * uScale, uRotation);
        vec2 tex = uv * uScale;
        float tOffset = uSpeed * uTime;

        tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

        float pattern = 0.6 + 0.4 * sin(
          5.0 * (tex.x + tex.y +
                 cos(3.0 * tex.x + 5.0 * tex.y) +
                 0.02 * tOffset) +
          sin(20.0 * (tex.x + tex.y - 0.1 * tOffset))
        );

        vec3 col = uColor * (pattern - rnd / 15.0 * uNoiseIntensity);
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type: number, src: string) {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(shader));
      }
      return shader;
    }

    const vertShader = compile(gl.VERTEX_SHADER, vertSrc);
    const fragShader = compile(gl.FRAGMENT_SHADER, fragSrc);

    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'uRes');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uSpeed = gl.getUniformLocation(program, 'uSpeed');
    const uScale = gl.getUniformLocation(program, 'uScale');
    const uColor = gl.getUniformLocation(program, 'uColor');
    const uRotation = gl.getUniformLocation(program, 'uRotation');
    const uNoiseIntensity = gl.getUniformLocation(program, 'uNoiseIntensity');

    gl.uniform1f(uSpeed, 1.2);
    gl.uniform1f(uScale, 1.0);
    gl.uniform3f(uColor, 0.40, 0.37, 0.45); // Dark luxury silk tone
    gl.uniform1f(uRotation, 0.0);
    gl.uniform1f(uNoiseIntensity, 1.4);

    let animId: number;

    const resize = () => {
      if (!canvas.parentElement) return;
      const dpr = getOptimalDPR(1.0);
      const width = canvas.parentElement.clientWidth || window.innerWidth;
      const height = canvas.parentElement.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize);
    const resizeObserver = new ResizeObserver(() => resize());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    resize();

    let isVisible = true;
    const intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          animId = requestAnimationFrame(render);
        }
      }
    }, { threshold: 0.02 });

    if (canvas.parentElement) {
      intersectionObserver.observe(canvas.parentElement);
    }

    const render = (time: number) => {
      if (!isVisible) {
        animId = 0;
        return;
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      intersectionObserver.disconnect();
      window.removeEventListener('resize', resize);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40 mix-blend-screen"
    />
  );
};

import React, { useEffect, useRef } from 'react';

export const ParticlesCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const BASE_SIZE = 0.7;
    const CIRCLE_COLOR = '255, 255, 255';
    const EASE = 24;
    const REPEL_RADIUS = 140;
    const REPEL_STRENGTH = 55;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const mouse = { x: -9999, y: -9999 };

    interface Particle {
      x: number;
      y: number;
      translateX: number;
      translateY: number;
      size: number;
      alpha: number;
      targetAlpha: number;
      dx: number;
      dy: number;
    }

    let particles: Particle[] = [];
    let animId: number;

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const createParticle = (): Particle => {
      const size = rand(BASE_SIZE * 0.6, BASE_SIZE * 2);
      return {
        x: rand(0, w),
        y: rand(0, h),
        translateX: 0,
        translateY: 0,
        size: size,
        alpha: 0,
        targetAlpha: rand(0.15, 1),
        dx: rand(-0.06, 0.06),
        dy: rand(-0.06, 0.06),
      };
    };

    const initParticles = () => {
      particles = [];
      const quantity = Math.round((w * h) / 2200);
      for (let i = 0; i < quantity; i++) {
        particles.push(createParticle());
      }
    };

    const remapValue = (value: number, start1: number, end1: number, start2: number, end2: number) => {
      const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
      return remapped > 0 ? remapped : 0;
    };

    const resize = () => {
      if (!canvas.parentElement) return;
      w = canvas.parentElement.clientWidth;
      h = canvas.parentElement.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      initParticles();
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Fade in
        if (p.alpha < p.targetAlpha) {
          p.alpha += 0.02;
          if (p.alpha > p.targetAlpha) p.alpha = p.targetAlpha;
        }

        // Drift
        p.x += p.dx;
        p.y += p.dy;

        // Wrap around edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Edge fade
        const edgeFade = Math.min(
          remapValue(p.x, 0, 20, 0, 1),
          remapValue(p.x, w, w - 20, 0, 1),
          remapValue(p.y, 0, 20, 0, 1),
          remapValue(p.y, h, h - 20, 0, 1)
        );

        // Mouse repulsion
        const ddx = p.x - mouse.x;
        const ddy = p.y - mouse.y;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
        let targetX = 0;
        let targetY = 0;

        if (dist < REPEL_RADIUS) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
          const angle = Math.atan2(ddy, ddx);
          targetX = Math.cos(angle) * force;
          targetY = Math.sin(angle) * force;
        }

        p.translateX += (targetX - p.translateX) / EASE;
        p.translateY += (targetY - p.translateY) / EASE;

        ctx.beginPath();
        ctx.arc(p.x + p.translateX, p.y + p.translateY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CIRCLE_COLOR}, ${p.alpha * edgeFade})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    };

    const parent = canvas.parentElement;

    const handleMouseMove = (e: MouseEvent) => {
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    const resizeObserver = new ResizeObserver(() => resize());
    if (parent) {
      resizeObserver.observe(parent);
    }

    resize();
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

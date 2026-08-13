import React, { useEffect, useRef } from 'react';
import { checkIsLowEndDevice } from '../utils/performance';

export const StarrySkyCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    interface Star {
      x: number;
      y: number;
      radius: number;
      baseAlpha: number;
      twinkleSpeed: number;
      phase: number;
    }

    interface ShootingStar {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      length: number;
    }

    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];

    const generateStars = (w: number, h: number) => {
      const isLowEnd = checkIsLowEndDevice();
      const densityDivider = isLowEnd ? 7000 : 3500;
      const count = Math.floor((w * h) / densityDivider);
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 1.3 + 0.3,
          baseAlpha: Math.random() * 0.5 + 0.3,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const resize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
      generateStars(width, height);
    };

    const spawnShootingStar = () => {
      const startX = Math.random() * width * 0.6 + width * 0.1;
      const startY = Math.random() * height * 0.3;
      const angle = Math.PI / 4 + (Math.random() * 0.3 - 0.15);
      const speed = Math.random() * 14 + 22;
      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        length: Math.random() * 80 + 60,
      });
    };

    let isVisible = true;
    const intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          animId = requestAnimationFrame(draw);
        }
      }
    }, { threshold: 0.02 });

    if (canvas.parentElement) {
      intersectionObserver.observe(canvas.parentElement);
    }

    let startTime = performance.now();

    const draw = (currentTime: number) => {
      if (!isVisible) {
        animId = 0;
        return;
      }

      const elapsed = (currentTime - startTime) * 0.05;
      ctx.clearRect(0, 0, width, height);

      // Twinkling stars
      for (const s of stars) {
        const alpha = s.baseAlpha + Math.sin(elapsed * s.twinkleSpeed + s.phase) * 0.3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, alpha))})`;
        ctx.fill();
      }

      // Occasionally spawn a shooting star
      if (Math.random() < 0.003) spawnShootingStar();

      // Draw + update shooting stars
      shootingStars = shootingStars.filter((sh) => sh.life > 0);
      for (const sh of shootingStars) {
        const tailX = sh.x - sh.vx * (sh.length / 12);
        const tailY = sh.y - sh.vy * (sh.length / 12);
        const grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255,255,255,${sh.life})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life -= 0.035;
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    animId = requestAnimationFrame(draw);

    window.addEventListener('resize', resize);
    const resizeObserver = new ResizeObserver(() => resize());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

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
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
    />
  );
};

'use client';

import React, { useEffect, useRef } from 'react';

/**
 * modules/dashboard/components/stats-section/confetti-burst.tsx
 *
 * Lightweight canvas confetti (no external dependency). Covers the
 * full viewport (fixed, high z-index) so it plays across the whole
 * dashboard regardless of where it's triggered from.
 */

const COLORS = ['#FFD88A', '#C6EB8B', '#31C3EE', '#D8C6E8', '#F43F87'];

export function ConfettiBurst({ onDone }: { onDone?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 160 }).map(() => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.6,
      r: 4 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vy: 2.5 + Math.random() * 3,
      vx: -1.5 + Math.random() * 3,
      rot: Math.random() * 360,
      vr: -6 + Math.random() * 12,
    }));

    let frame = 0;
    let animId: number;

    function tick() {
      frame++;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate((p.rot * Math.PI) / 180);
        ctx!.fillStyle = p.color;
        ctx!.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
        ctx!.restore();
      });

      if (frame < 220) {
        animId = requestAnimationFrame(tick);
      } else {
        onDone?.();
      }
    }
    tick();

    return () => cancelAnimationFrame(animId);
  }, [onDone]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[100] pointer-events-none" />;
}
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface ParticleTextProps {
  text: string;
  fontSize?: number;
  particleSize?: number;
  particleGap?: number;
  mouseRadius?: number;
  returnSpeed?: number;
}

export function ParticleText({
  text,
  fontSize = 80,
  particleSize = 2,
  particleGap = 3,
  mouseRadius = 100,
  returnSpeed = 0.05,
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number | undefined>(undefined);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initParticles = () => {
      const dpr = window.devicePixelRatio || 1;

      // Create offscreen canvas to render text
      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      // Measure text
      offCtx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
      const metrics = offCtx.measureText(text);
      const textWidth = metrics.width;
      const textHeight = fontSize * 1.2;

      // Set canvas size
      const padding = mouseRadius * 2;
      canvas.width = (textWidth + padding * 2) * dpr;
      canvas.height = (textHeight + padding * 2) * dpr;
      canvas.style.width = `${textWidth + padding * 2}px`;
      canvas.style.height = `${textHeight + padding * 2}px`;

      // Set offscreen canvas size
      offscreen.width = textWidth + padding * 2;
      offscreen.height = textHeight + padding * 2;

      // Draw text on offscreen canvas
      offCtx.fillStyle = "white";
      offCtx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
      offCtx.textBaseline = "middle";
      offCtx.fillText(text, padding, (textHeight + padding * 2) / 2);

      // Get pixel data
      const imageData = offCtx.getImageData(
        0,
        0,
        offscreen.width,
        offscreen.height
      );
      const pixels = imageData.data;

      // Create particles from text pixels
      const particles: Particle[] = [];
      for (let y = 0; y < offscreen.height; y += particleGap) {
        for (let x = 0; x < offscreen.width; x += particleGap) {
          const index = (y * offscreen.width + x) * 4;
          const alpha = pixels[index + 3];

          if (alpha > 128) {
            particles.push({
              x: x * dpr,
              y: y * dpr,
              originX: x * dpr,
              originY: y * dpr,
              vx: 0,
              vy: 0,
              size: particleSize * dpr,
              color: `rgba(255, 255, 255, ${alpha / 255})`,
            });
          }
        }
      }

      particlesRef.current = particles;
      setIsReady(true);
    };

    initParticles();

    const handleResize = () => {
      initParticles();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [text, fontSize, particleSize, particleGap, mouseRadius]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isReady) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (const particle of particles) {
        // Calculate distance to mouse
        const dx = mouse.x * dpr - particle.x;
        const dy = mouse.y * dpr - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = mouseRadius * dpr;

        if (distance < maxDistance) {
          // Push particles away from mouse
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          const pushX = Math.cos(angle) * force * 15;
          const pushY = Math.sin(angle) * force * 15;

          particle.vx -= pushX;
          particle.vy -= pushY;
        }

        // Apply velocity
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Return to origin with easing
        const returnX = (particle.originX - particle.x) * returnSpeed;
        const returnY = (particle.originY - particle.y) * returnSpeed;
        particle.vx += returnX;
        particle.vy += returnY;

        // Apply friction
        particle.vx *= 0.92;
        particle.vy *= 0.92;

        // Draw particle with glow effect
        const distFromOrigin = Math.sqrt(
          Math.pow(particle.x - particle.originX, 2) +
            Math.pow(particle.y - particle.originY, 2)
        );

        // Add green glow when dispersed (matches favicon color #22c55e)
        if (distFromOrigin > 5) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = "rgba(34, 197, 94, 1)";
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isReady, mouseRadius, returnSpeed]);

  // Use global mouse tracking to avoid blocking scroll
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{ display: "block" }}
      />
    </motion.div>
  );
}

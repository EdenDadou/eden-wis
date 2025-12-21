"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  opacity: number;
  targetOpacity: number;
}

interface RotatingParticleTextProps {
  texts: string[];
  fontSize?: number;
  particleSize?: number;
  particleGap?: number;
  mouseRadius?: number;
  returnSpeed?: number;
  rotationInterval?: number;
}

export function RotatingParticleText({
  texts,
  fontSize = 40,
  particleSize = 2,
  particleGap = 3,
  mouseRadius = 40,
  returnSpeed = 0.05,
  rotationInterval = 3000,
}: RotatingParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number | undefined>(undefined);
  const currentIndexRef = useRef(0);
  const canvasSizeRef = useRef({ width: 0, height: 0 });
  const dprRef = useRef(1);

  // Get particle positions for a given text
  const getTextParticles = useCallback((text: string) => {
    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return null;

    const dpr = dprRef.current;

    // Calculate canvas size based on the longest text
    offCtx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
    let maxWidth = 0;
    for (const t of texts) {
      const width = offCtx.measureText(t.toUpperCase()).width;
      if (width > maxWidth) maxWidth = width;
    }

    const textHeight = fontSize * 1.2;
    const paddingX = mouseRadius;
    const paddingY = mouseRadius * 0.5;
    const totalWidth = maxWidth + paddingX * 2;
    const totalHeight = textHeight + paddingY * 2;

    offscreen.width = totalWidth;
    offscreen.height = totalHeight;

    offCtx.fillStyle = "white";
    offCtx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
    offCtx.textBaseline = "middle";
    offCtx.textAlign = "center";
    offCtx.fillText(text.toUpperCase(), totalWidth / 2, totalHeight / 2);

    const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
    const pixels = imageData.data;

    const positions: { x: number; y: number; alpha: number }[] = [];
    for (let y = 0; y < offscreen.height; y += particleGap) {
      for (let x = 0; x < offscreen.width; x += particleGap) {
        const index = (y * offscreen.width + x) * 4;
        const alpha = pixels[index + 3];
        if (alpha > 128) {
          positions.push({ x: x * dpr, y: y * dpr, alpha: alpha / 255 });
        }
      }
    }

    return { positions, canvasSize: { width: totalWidth, height: totalHeight } };
  }, [fontSize, particleGap, mouseRadius, texts]);

  // Morph particles to new text
  const morphToText = useCallback((textIndex: number) => {
    const result = getTextParticles(texts[textIndex]);
    if (!result) return;

    const { positions: targetPositions } = result;
    const particles = particlesRef.current;
    const dpr = dprRef.current;
    const centerX = (canvasSizeRef.current.width / 2) * dpr;
    const centerY = (canvasSizeRef.current.height / 2) * dpr;

    const maxParticles = Math.max(particles.length, targetPositions.length);

    // Resize particles array
    while (particles.length < maxParticles) {
      particles.push({
        x: centerX,
        y: centerY,
        targetX: centerX,
        targetY: centerY,
        size: particleSize * dpr,
        opacity: 0,
        targetOpacity: 0,
      });
    }

    // Assign targets - simple index-based matching
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];

      if (i < targetPositions.length) {
        const target = targetPositions[i];
        particle.targetX = target.x;
        particle.targetY = target.y;
        particle.targetOpacity = target.alpha;
      } else {
        // Extra particles - fade out
        particle.targetX = centerX + (Math.random() - 0.5) * 30;
        particle.targetY = centerY + (Math.random() - 0.5) * 30;
        particle.targetOpacity = 0;
      }
    }
  }, [texts, getTextParticles, particleSize]);

  // Initialize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    dprRef.current = window.devicePixelRatio || 1;
    const dpr = dprRef.current;

    const result = getTextParticles(texts[0]);
    if (!result) return;

    const { positions, canvasSize } = result;

    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;
    canvas.style.width = `${canvasSize.width}px`;
    canvas.style.height = `${canvasSize.height}px`;
    canvasSizeRef.current = canvasSize;

    // Initialize particles
    particlesRef.current = positions.map((pos) => ({
      x: pos.x,
      y: pos.y,
      targetX: pos.x,
      targetY: pos.y,
      size: particleSize * dpr,
      opacity: pos.alpha,
      targetOpacity: pos.alpha,
    }));

    // Start rotation
    const rotationTimer = setInterval(() => {
      currentIndexRef.current = (currentIndexRef.current + 1) % texts.length;
      morphToText(currentIndexRef.current);
    }, rotationInterval);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const morphSpeed = 0.06; // Smooth interpolation speed

      for (const particle of particles) {
        // Smoothly interpolate towards target
        particle.x += (particle.targetX - particle.x) * morphSpeed;
        particle.y += (particle.targetY - particle.y) * morphSpeed;
        particle.opacity += (particle.targetOpacity - particle.opacity) * morphSpeed;

        // Mouse repulsion
        const dx = mouse.x * dpr - particle.x;
        const dy = mouse.y * dpr - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = mouseRadius * dpr;

        if (distance < maxDistance && distance > 0) {
          const force = ((maxDistance - distance) / maxDistance) * 10;
          const angle = Math.atan2(dy, dx);
          particle.x -= Math.cos(angle) * force;
          particle.y -= Math.sin(angle) * force;
        }

        // Skip invisible particles
        if (particle.opacity < 0.01) continue;

        // Glow effect
        const distFromTarget = Math.sqrt(
          Math.pow(particle.x - particle.targetX, 2) +
          Math.pow(particle.y - particle.targetY, 2)
        );

        if (distFromTarget > 3) {
          const glowIntensity = Math.min(1, distFromTarget / 20);
          ctx.shadowBlur = 12 * glowIntensity;
          ctx.shadowColor = `rgba(0, 212, 255, ${0.8 * glowIntensity})`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      clearInterval(rotationTimer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [texts, fontSize, particleSize, particleGap, mouseRadius, rotationInterval, getTextParticles, morphToText]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex justify-center -mt-8"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{ display: "block" }}
      />
    </motion.div>
  );
}

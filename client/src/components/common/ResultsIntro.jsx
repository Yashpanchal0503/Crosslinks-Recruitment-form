import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles } from "lucide-react";

/**
 * Premium Pre-Animation Component for 2026 Recruitment Final Results
 * Styled strictly to match the CrossLinks NSUT results page palette:
 * - Obsidian dark background (matching var(--background))
 * - Signature CrossLinks emerald accent (var(--accent) / #2DA049)
 * - Matching font-display + font-instrument typography pairing
 * - HTML5 canvas with emerald & crystal glowing particles and light streaks
 * - Duration: ~5.8 seconds, transitioning seamlessly into the final results
 */
const ResultsIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState(1); // 1: The Wait Is Over, 2: 2026 Final Results, 3: Suspense, 4: Reveal Exit
  const canvasRef = useRef(null);

  // Cinematic Phase Sequencer (~5.8s total duration)
  useEffect(() => {
    // Phase 1 -> Phase 2 at 2.4s
    const t1 = setTimeout(() => {
      setPhase(2);
    }, 2400);

    // Phase 2 -> Phase 3 (Suspenseful breathing pause) at 4.3s
    const t2 = setTimeout(() => {
      setPhase(3);
    }, 4300);

    // Phase 3 -> Phase 4 (Exit dissolve) at 5.2s
    const t3 = setTimeout(() => {
      setPhase(4);
    }, 5200);

    // Complete at 5.8s
    const t4 = setTimeout(() => {
      onComplete();
    }, 5800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  // Canvas Particle & Light Streak Rendering (Color-matched to results page)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Floating emerald and subtle pearl particles (exact palette as Confetti)
    const particleCount = 60;
    const particles = [];
    const colors = ["#2DA049", "#34D399", "#10B981", "#059669", "#A7F3D0", "#FFFFFF"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.65 - 0.2, // Drifting smoothly upwards
        alpha: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.035 + 0.015,
        pulseVal: Math.random() * Math.PI,
      });
    }

    // Emerald & white ambient light streaks gliding horizontally
    const streaks = [
      { y: canvas.height * 0.32, height: 2, speed: 1.6, progress: -0.15, color: "rgba(45, 160, 73, 0.45)" },
      { y: canvas.height * 0.5, height: 2.5, speed: 2.2, progress: -0.5, color: "rgba(52, 211, 153, 0.35)" },
      { y: canvas.height * 0.68, height: 1.5, speed: 1.4, progress: -0.3, color: "rgba(45, 160, 73, 0.35)" },
    ];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw glowing particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulseVal += p.pulseSpeed;

        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulseVal));

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      });

      // 2. Draw light streaks
      streaks.forEach((streak) => {
        streak.progress += 0.0032 * streak.speed;
        if (streak.progress > 1.4) streak.progress = -0.4;

        const streakWidth = canvas.width * 0.5;
        const startX = streak.progress * canvas.width - streakWidth / 2;

        const gradient = ctx.createLinearGradient(startX, 0, startX + streakWidth, 0);
        gradient.addColorStop(0, "rgba(45, 160, 73, 0)");
        gradient.addColorStop(0.5, streak.color);
        gradient.addColorStop(1, "rgba(45, 160, 73, 0)");

        ctx.save();
        ctx.fillStyle = gradient;
        ctx.fillRect(startX, streak.y, streakWidth, streak.height);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{
        opacity: phase === 4 ? 0 : 1,
        scale: phase === 4 ? 1.04 : 1,
        filter: phase === 4 ? "blur(14px)" : "blur(0px)",
      }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 bg-[#07070b] text-foreground flex flex-col items-center justify-center overflow-hidden select-none pointer-events-auto font-sans"
    >
      {/* Background Particle & Streak Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full z-0" />

      {/* Atmospheric Background Glows matching FinalResults */}
      <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[750px] h-[550px] rounded-full bg-accent/20 blur-[160px]" />
      <div className="pointer-events-none absolute top-[380px] -right-36 w-[480px] h-[480px] rounded-full bg-accent/15 blur-[140px]" />
      <div className="pointer-events-none absolute top-[700px] -left-36 w-[420px] h-[420px] rounded-full bg-accent/10 blur-[130px]" />

      {/* Subtle Dotted Background Overlay */}
      <div className="dotted-bg-overlay opacity-40 pointer-events-none" />

      {/* Top Brand Indicator (No skip button) */}
      <header className="absolute top-5 sm:top-8 inset-x-4 sm:inset-x-10 flex items-center justify-center z-20">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent font-mono text-[10px] sm:text-xs font-semibold tracking-wider uppercase backdrop-blur-md whitespace-nowrap"
        >
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent animate-pulse shrink-0" />
          <span className="hidden sm:inline">CROSSLINKS NSUT • OFFICIAL INDUCTION 2026</span>
          <span className="sm:hidden">CROSSLINKS • INDUCTION 2026</span>
        </motion.div>
      </header>

      {/* Center Cinematic Stage */}
      <main className="relative z-10 max-w-4xl w-full px-4 sm:px-6 text-center flex flex-col items-center justify-center min-h-[280px] sm:min-h-[300px]">
        <AnimatePresence mode="wait">
          {/* ================= PHASE 1: THE WAIT IS OVER ================= */}
          {phase === 1 && (
            <motion.div
              key="phase-1-wait"
              initial={{ opacity: 0, y: 22, scale: 0.95, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -22, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <motion.p
                initial={{ opacity: 0, letterSpacing: "0.25em" }}
                animate={{ opacity: 1, letterSpacing: "0.18em" }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="font-mono text-[10px] sm:text-sm text-accent font-semibold uppercase mb-3 sm:mb-4 tracking-wider sm:tracking-widest"
              >
                // RECRUITMENT DRIVE COMPLETE
              </motion.p>

              <motion.h1
                initial={{ letterSpacing: "0.08em" }}
                animate={{ letterSpacing: "0.15em" }}
                transition={{ duration: 2.0, ease: "easeOut" }}
                className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-sans uppercase tracking-[0.14em] sm:tracking-[0.22em] text-foreground select-none leading-tight drop-shadow-[0_0_35px_rgba(255,255,255,0.25)] px-2"
              >
                <span>THE WAIT</span>
                <br />
                <span className="font-instrument italic font-normal text-accent lowercase text-[1.25em] tracking-normal drop-shadow-[0_0_40px_rgba(45,160,73,0.6)]">
                  is over
                </span>
              </motion.h1>

              {/* Accent Line */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100px", opacity: 1 }}
                transition={{ duration: 1.0, delay: 0.3 }}
                className="h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent mt-5 sm:mt-7"
              />
            </motion.div>
          )}

          {/* ================= PHASE 2 & 3: 2026 FINAL RESULTS & SUSPENSE ================= */}
          {(phase === 2 || phase === 3) && (
            <motion.div
              key="phase-2-results"
              initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)" }}
              animate={{
                opacity: 1,
                scale: phase === 3 ? [1, 1.025, 1] : 1,
                filter: "blur(0px)",
              }}
              exit={{ opacity: 0, scale: 1.12, filter: "blur(14px)" }}
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
                scale: {
                  repeat: phase === 3 ? Infinity : 0,
                  duration: 1.0,
                  ease: "easeInOut",
                },
              }}
              className="flex flex-col items-center"
            >
              {/* Batch Capsule */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-3 sm:mb-4 shadow-[0_0_20px_rgba(45,160,73,0.2)] whitespace-nowrap"
              >
                <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent shrink-0" />
                <span>BATCH OF 2026</span>
              </motion.div>

              {/* Title: 2026 Final results */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.15 }}
                className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-sans uppercase tracking-tight text-foreground leading-none flex flex-wrap items-baseline justify-center gap-x-2 sm:gap-x-3.5 select-none px-2"
              >
                <span className="font-display font-black tracking-tight uppercase">
                  2026 Final
                </span>
                <span className="font-instrument italic font-normal text-accent lowercase text-[1.15em] drop-shadow-[0_0_35px_rgba(45,160,73,0.5)]">
                  results
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.3 }}
                className="mt-4 sm:mt-5 text-[11px] sm:text-sm font-mono text-muted-foreground tracking-wider uppercase max-w-xs sm:max-w-md px-3 leading-relaxed"
              >
                {phase === 3 ? (
                  <span className="text-accent font-semibold animate-pulse flex items-center justify-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span>Unveiling Selected Candidates</span>
                    <Sparkles className="w-3 h-3 shrink-0" />
                  </span>
                ) : (
                  <span>Welcome to CrossLinks NSUT</span>
                )}
              </motion.p>

              {/* Progress Beam matching theme */}
              <div className="mt-6 sm:mt-7 w-44 sm:w-64 h-[2px] bg-muted/60 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.1, ease: "easeInOut" }}
                  className="h-full bg-accent shadow-[0_0_12px_var(--accent)]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default ResultsIntro;

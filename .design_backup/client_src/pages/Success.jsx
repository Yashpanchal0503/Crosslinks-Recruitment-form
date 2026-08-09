import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Home } from "lucide-react";
import Navbar from "../components/common/Navbar";
import CursorBlob from "../components/common/CursorBlob";

const Confetti = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#8B5CF6", "#A78BFA", "#C084FC", "#3B82F6", "#EC4899"];
    const particles = [];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 4 + 2,
        d: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.07 + 0.02,
        tiltAngle: 0,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 25;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();

        if (p.y > canvas.height) {
          particles[idx] = {
            ...p,
            x: Math.random() * canvas.width,
            y: -20,
            tilt: Math.random() * 10 - 5,
          };
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full z-0 opacity-70" />;
};

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name = "Applicant", department = "Crosslinks" } = location.state || {};

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 relative overflow-hidden transition-colors duration-300">
      <CursorBlob />
      <Navbar />
      <Confetti />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg w-full glass-card rounded-3xl p-8 sm:p-10 text-center relative z-10 shadow-2xl"
      >
        {/* Animated Checkmark Badge */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center relative shadow-[0_0_30px_var(--accent)]">
            <svg
              className="w-10 h-10 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="3.5"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <p className="font-mono text-xs text-accent font-semibold tracking-widest uppercase mb-1">// APPLICATION RECEIVED</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3 tracking-tight font-sans">
          Thank you, {name}!
        </h2>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          Your recruitment form for the <strong className="text-accent font-semibold">{department}</strong> domain has been submitted successfully to the Crosslinks core team.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto h-11 px-6 inline-flex items-center justify-center gap-2 rounded-full bg-accent text-accent-foreground font-semibold text-sm shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            Submit Another Form <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Success;

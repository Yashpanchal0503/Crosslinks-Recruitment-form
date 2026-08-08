import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Independent Canvas-based Confetti Particle Emitter for superior UX
const Confetti = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#8B5CF6", "#A78BFA", "#C084FC", "#3B82F6", "#60A5FA"];
    const particles = [];

    for (let i = 0; i < 120; i++) {
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

        // Recycle particles
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

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full z-0" />;
};

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Extract name & department from navigation state (fallbacks if undefined)
  const { name = "Applicant", department = "" } = location.state || {};

  const handleNewApplication = () => {
    navigate("/");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 relative overflow-hidden">
      {/* Confetti Background Layer */}
      <Confetti />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg w-full bg-card/70 backdrop-blur-md rounded-2xl p-8 text-center border border-border/30 shadow-2xl relative z-10"
      >
        {/* Glowing self-drawing checkmark icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center relative shadow-[0_0_20px_rgba(139,92,246,0.15)]">
            <svg
              className="w-10 h-10 text-violet-400"
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

        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
          Thank you, {name}!
        </h2>
        <p className="text-slate-300 mb-6 text-sm leading-relaxed">
          Your application for the <strong className="text-violet-400 font-semibold">{department}</strong> department has been received successfully.
        </p>
        <button
          onClick={handleNewApplication}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium text-sm py-3 px-8 rounded-full shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          Submit Another Application <ArrowRight size={16} />
        </button>
      </motion.div>
    </section>
  );
};

export default Success;

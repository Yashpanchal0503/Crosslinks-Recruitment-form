import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CursorBlob() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isArrowHovered, setIsArrowHovered] = useState(false);

  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);

  // Precision inner dot (snappy spring)
  const dotX = useSpring(mouseX, { stiffness: 900, damping: 40 });
  const dotY = useSpring(mouseY, { stiffness: 900, damping: 40 });

  // Outer halo follower circle (smooth spring)
  const haloX = useSpring(mouseX, { stiffness: 340, damping: 14, mass: 0.5 });
  const haloY = useSpring(mouseY, { stiffness: 340, damping: 14, mass: 0.5 });

  useEffect(() => {
    if (reduced) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    const move = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target;
      const arrowTarget = target && (
        target.closest("[data-hover-arrow='true']") ||
        target.closest("[data-hover-icon='arrow']")
      );
      setIsArrowHovered(!!arrowTarget);
    };
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
    };
  }, [enabled, mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <>
      {/* 1. Ambient Background Spotlight Glow */}
      <motion.div
        aria-hidden
        style={{ x: haloX, y: haloY, translateX: "-50%", translateY: "-50%" }}
        className="pointer-events-none fixed left-0 top-0 z-[9990] h-64 w-64 rounded-full bg-accent/10 blur-3xl transition-opacity duration-500"
        animate={{ opacity: visible ? 1 : 0 }}
      />

      {/* 2. Compact White Follower Outer Circle Ring matching crosslinks-5 */}
      <motion.div
        aria-hidden
        style={{ x: haloX, y: haloY, translateX: "-50%", translateY: "-50%" }}
        className="pointer-events-none fixed left-0 top-0 z-[9998] flex items-center justify-center rounded-full border border-white/70 bg-white/10 backdrop-blur-[2px] shadow-[0_0_12px_rgba(255,255,255,0.25)] transition-colors duration-300"
        animate={{
          width: isArrowHovered ? 36 : 32,
          height: isArrowHovered ? 36 : 32,
          opacity: visible ? 1 : 0,
          scale: 1,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      >
        <AnimatePresence>
          {isArrowHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              className="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]"
            >
              <ArrowRight className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 3. Purple Accent Inner Precision Dot */}
      <motion.div
        aria-hidden
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]"
        animate={{
          opacity: visible ? (isArrowHovered ? 0 : 1) : 0,
          scale: isArrowHovered ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}

export default CursorBlob;

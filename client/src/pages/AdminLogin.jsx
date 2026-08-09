import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import { ArrowRight, Lock, ShieldAlert } from "lucide-react";
import * as z from "zod";
import Navbar from "../components/common/Navbar";
import CursorBlob from "../components/common/CursorBlob";

const schema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [authError, setAuthError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setAuthError("");
    const result = await login(data.email, data.password);
    if (result.success) {
      navigate("/admin/dashboard");
    } else {
      setAuthError(result.error || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300">
      <CursorBlob />
      <Navbar />

      {/* Top Ambient Glow Background Circle */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/10 blur-[130px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 border border-border/80 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4 text-accent">
            <Lock className="w-6 h-6" />
          </div>
          <p className="font-mono text-xs text-accent font-semibold tracking-widest uppercase mb-1">// ADMIN ACCESS</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-sans">
            Admin Portal Login
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Sign in to review applicant submissions and manage recruitment statuses.
          </p>
        </div>

        {authError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-semibold flex items-center gap-2.5"
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="input-label" htmlFor="email">
              // ADMIN EMAIL
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@crosslinks.com"
              {...register("email")}
              className="input-field"
            />
            {errors.email && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-xs font-semibold mt-1">
                ⚠️ {errors.email.message}
              </motion.p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="input-label" htmlFor="password">
              // PASSWORD
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="input-field"
            />
            {errors.password && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-xs font-semibold mt-1">
                ⚠️ {errors.password.message}
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-full bg-accent text-accent-foreground font-semibold text-sm shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-[1.02] transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                <span>Authenticating...</span>
              </div>
            ) : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

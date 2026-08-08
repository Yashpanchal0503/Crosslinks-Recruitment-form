import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import * as z from "zod";

const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      navigate("/admin/dashboard");
    } else {
      alert(result.error);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card/70 backdrop-blur-sm rounded-2xl p-8 border border-border/30 shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-1">
            <label className="input-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@crosslinks.com"
              {...register("email")}
              className="input-field"
            />
            {errors.email && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </motion.p>
            )}
          </div>
          {/* Password */}
          <div className="space-y-1">
            <label className="input-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="********"
              {...register("password")}
              className="input-field"
            />
            {errors.password && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </motion.p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-xl transition-colors disabled:opacity-60"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Login <ArrowRight size={16} /></>
            )}
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default AdminLogin;

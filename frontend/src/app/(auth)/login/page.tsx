"use client";

import type React from "react";
import { blanka } from "../../fonts";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // API base URL (set NEXT_PUBLIC_API_BASE_URL in .env.local)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, form: "" }));

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (res.ok) {
        // Redirect to dashboard or home page
        window.location.href = "/dashboard";
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (res.status === 400 || res.status === 401) {
        setErrors((prev) => ({
          ...prev,
          form: data?.message || "Invalid credentials. Please try again.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          form: data?.message || "Login failed. Try again.",
        }));
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        form: "Network error. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-[#131314] text-white overflow-hidden relative">
      {/* Shadow Effect */}
      <div className="fixed h-full right-5 w-900px shadow-[-50px_0px_100px_50px_rgba(0,0,0,0.8)] z-5" />
      {/* RSGA Text */}
      <div className="fixed right-10 top-0 h-screen w-[130px] flex items-center justify-center z-10">
        <h1
          className={`font-display font-light text-[200px] opacity-40 text-gray-400 whitespace-nowrap ${blanka.className}`}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "center center",
          }}>
          RSGA
        </h1>
      </div>

      {/* Animated Rectangle */}
      <div
        className="fixed w-[280px] h-[280px] bg-[#29313f] rounded-[20px] animate-rect-spin z-0"
        style={{
          left: "calc(50% + 50px)",
          top: "calc(55% + 50px)",
        }}
      />

      {/* Form Container */}
      <div className="relative h-screen flex items-center justify-start pl-16">
        <div className="w-full max-w-[500px] h-auto max-h-[85vh] bg-white/5 backdrop-blur-[6.5px] border-2 border-[#303030] rounded-[10px] flex flex-col items-center justify-center overflow-y-auto">
          <div className="w-full px-8 py-8 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl bg-gradient-to-r from-[#809bc8] to-[#a76fb8] bg-clip-text text-transparent uppercase font-bold text-center leading-tight mb-8">
              Welcome Back!
            </h1>

            <form
              onSubmit={handleSubmit}
              className="w-full max-w-[400px] space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-lg opacity-85 mb-2 font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-3 text-lg bg-transparent border-[3px] border-white/80 rounded-[12px] text-white placeholder:text-gray-400 focus:border-[#809bc8] transition-all duration-300 h-12 focus:outline-none"
                  autoComplete="off"
                  autoFocus
                />
                {errors.email && (
                  <div className="mt-2 border border-red-500/50 bg-red-500/10 backdrop-blur-sm rounded-md p-3">
                    <div className="text-red-400 text-sm">{errors.email}</div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-lg opacity-85 mb-2 font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="w-full px-4 py-3 text-lg bg-transparent border-[3px] border-white/80 rounded-[12px] text-white placeholder:text-gray-400 focus:border-[#809bc8] transition-all duration-300 h-12 focus:outline-none"
                  autoComplete="off"
                />
                {errors.password && (
                  <div className="mt-2 border border-red-500/50 bg-red-500/10 backdrop-blur-sm rounded-md p-3">
                    <div className="text-red-400 text-sm">
                      {errors.password}
                    </div>
                  </div>
                )}
              </div>

              {/* Top-level form error */}
              {errors.form && (
                <div className="mt-4 border border-red-500/50 bg-red-500/10 rounded-md p-3">
                  <div className="text-red-400 text-sm">{errors.form}</div>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#303030] hover:bg-[#404040] text-white px-8 py-3 text-lg font-medium border-none rounded-[10px] shadow-[0px_0px_7px_#809bc8] transition-all duration-300 hover:shadow-[0px_0px_15px_#809bc8] disabled:opacity-50 disabled:cursor-not-allowed h-12 cursor-pointer">
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </div>

              <div className="text-center pt-4">
                <Link
                  href="/register"
                  className="text-[#809bc8] hover:text-[#a76fb8] transition-colors duration-300 text-base">
                  {"Don't have an account? Register here"}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes rect-spin {
          0% {
            transform: rotate(70deg);
            border-radius: 20px;
            background-color: #29313f;
          }
          25% {
            transform: rotate(140deg);
            border-radius: 5px;
            background-color: #809bc8;
          }
          50% {
            transform: rotate(-15deg);
            border-radius: 10px;
            background-color: #a76fb8;
          }
          75% {
            transform: rotate(35deg);
            border-radius: 70px;
            background-color: #809bc8;
          }
          100% {
            transform: rotate(70deg);
            border-radius: 20px;
            background-color: #29313f;
          }
        }
        .animate-rect-spin {
          animation: rect-spin 20s infinite;
        }
      `}</style>
    </div>
  );
}

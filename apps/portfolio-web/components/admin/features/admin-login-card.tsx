"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AdminButton, AdminInput, AdminCard } from "../ui";

export const AdminLoginCard: React.FC = () => {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage("Please enter your username or email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data?.message || data?.error?.message || "Invalid credentials provided.");
        toast.error("Authentication failed. Please verify credentials.");
        return;
      }

      // Successful login
      toast.success("Welcome back! Redirecting to Dashboard...");
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Unable to connect to the authentication service. Please check your database connection.");
      toast.error("Network or database connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Top Back Navigation to Landing Page */}
      <div className="flex items-center justify-between px-1">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[var(--accent-gold)]" />
          <span>Back to Landing Page</span>
        </Link>
        <span className="text-[11px] text-[var(--text-muted)]">Secure TLS</span>
      </div>

      <AdminCard className="border-[var(--border-card)] shadow-2xl">
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-gold)] text-[var(--btn-primary-text)] mx-auto flex items-center justify-center font-bold shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
              Executive Administration
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Sign in with your administrator credentials
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminInput
              label="Username or Email"
              type="text"
              placeholder="admin@keshabbhatt.com.np"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              autoComplete="username"
              required
            />

            <AdminInput
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-[var(--text-main)] transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              autoComplete="current-password"
              required
            />

            <div className="pt-2">
              <AdminButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Access Administration
              </AdminButton>
            </div>
          </form>

          {/* Footer Back Link */}
          <div className="pt-4 text-center border-t border-[var(--border-subtle)]">
            <Link
              href="/"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors inline-flex items-center gap-1.5"
            >
              <span>Return to Keshab Bhatt Portfolio Website</span>
            </Link>
          </div>
        </div>
      </AdminCard>
    </div>
  );
};

export default AdminLoginCard;

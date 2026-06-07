"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ParentLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");

    // Simulate login for now
    setTimeout(() => {
      if (form.email === "parent@test.com" && form.password === "password123") {
        router.push("/parent/dashboard");
      } else {
        setError("Wrong email or password. Try again.");
        setLoading(false);
      }
    }, 1000);
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white flex flex-col items-center justify-center p-6">

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-700 opacity-20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-cyan-700 opacity-20 rounded-full blur-[120px]" />
      </div>

      {/* Logo */}
      <Link href="/" className="text-2xl font-black tracking-tight mb-3">
        Re<span className="text-cyan-400">define</span>
      </Link>
      <p className="text-gray-400 text-sm mb-10">Parent login</p>

      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
        <h2 className="text-3xl font-black mb-1">Welcome back 👋</h2>
        <p className="text-gray-400 text-sm mb-8">Log in to manage your kid's account.</p>

        <div className="flex flex-col gap-4">

          {/* Email */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Password</label>
            <input
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <button className="text-blue-400 text-sm hover:underline">
              Forgot password?
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-center">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={loading || !form.email || !form.password}
            className="w-full bg-blue-600 hover:bg-blue-500 transition text-white font-black py-4 rounded-xl text-lg disabled:opacity-40"
          >
            {loading ? "Logging in..." : "Log In →"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-500 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Sign up link */}
          <Link
            href="/parent/signup"
            className="w-full bg-white/5 border border-white/10 hover:bg-white/10 transition text-white font-bold py-4 rounded-xl text-center"
          >
            Create an account
          </Link>

        </div>
      </div>

      {/* Test credentials hint */}
      <div className="mt-6 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center max-w-sm">
        <p className="text-gray-400 text-xs mb-1">Test credentials:</p>
        <p className="text-gray-300 text-xs">Email: <span className="text-cyan-400">parent@test.com</span></p>
        <p className="text-gray-300 text-xs">Password: <span className="text-cyan-400">password123</span></p>
      </div>

      <Link href="/kid/login" className="text-cyan-400 text-sm mt-4 hover:underline">
        I'm a kid →
      </Link>

    </main>
  );
}
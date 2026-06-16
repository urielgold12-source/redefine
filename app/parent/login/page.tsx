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
    if (!form.email || !form.password) { setError("Please enter your email and password."); return; }
    setLoading(true); setError("");
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
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#faf9ff" }}>
      <header className="h-16 flex items-center justify-between px-5 border-b" style={{ backgroundColor: "#ffffff", borderColor: "#e1e8ff" }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm" style={{ backgroundColor: "#003d9b", color: "#ffffff" }}>R</div>
          <span className="font-black text-base" style={{ color: "#003d9b", fontFamily: "'Hanken Grotesk', sans-serif" }}>Redefine</span>
        </Link>
        <Link href="/kid/login" className="text-sm font-medium flex items-center gap-1" style={{ color: "#434654" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>child_care</span>
          Kid login
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#e9edff" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 32, color: "#003d9b" }}>shield_person</span>
            </div>
            <h1 className="font-black text-3xl mb-1" style={{ color: "#051a3e", fontFamily: "'Hanken Grotesk', sans-serif" }}>Parent sign in</h1>
            <p className="text-sm" style={{ color: "#434654" }}>Access your family dashboard</p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: "#434654", fontFamily: "'JetBrains Mono', monospace" }}>Email address</label>
                <input type="email" placeholder="your@email.com" value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                  style={{ borderColor: "#c3c6d6", backgroundColor: "#ffffff", color: "#051a3e" }} />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs uppercase tracking-wider" style={{ color: "#434654", fontFamily: "'JetBrains Mono', monospace" }}>Password</label>
                  <button className="text-xs font-medium" style={{ color: "#003d9b" }}>Forgot password?</button>
                </div>
                <input type="password" placeholder="Your password" value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                  style={{ borderColor: "#c3c6d6", backgroundColor: "#ffffff", color: "#051a3e" }} />
              </div>

              {error && (
                <div className="rounded-xl px-4 py-3 text-sm flex items-center gap-2" style={{ backgroundColor: "#ffdad6", color: "#ba1a1a" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
                  {error}
                </div>
              )}

              <button onClick={handleLogin} disabled={loading || !form.email || !form.password}
                className="w-full font-black py-3.5 rounded-xl text-sm transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2 mt-1"
                style={{ backgroundColor: "#003d9b", color: "#ffffff", fontFamily: "'Hanken Grotesk', sans-serif" }}>
                {loading ? "Signing in..." : <><span>Sign In</span><span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span></>}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ backgroundColor: "#e1e8ff" }} />
                <span className="text-xs" style={{ color: "#737685", fontFamily: "'JetBrains Mono', monospace" }}>or</span>
                <div className="flex-1 h-px" style={{ backgroundColor: "#e1e8ff" }} />
              </div>

              <Link href="/parent/signup"
                className="block text-center font-bold py-3 rounded-xl border text-sm transition-all active:scale-[0.98]"
                style={{ borderColor: "#c3c6d6", color: "#003d9b", backgroundColor: "transparent" }}>
                Create an account
              </Link>
            </div>
          </div>

          <div className="mt-4 rounded-xl px-4 py-3 text-center" style={{ backgroundColor: "#e9edff", border: "1px solid #c4d2ff" }}>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#003d9b", fontFamily: "'JetBrains Mono', monospace" }}>Test credentials</p>
            <p className="text-xs" style={{ color: "#434654" }}>Email: <strong>parent@test.com</strong> · Password: <strong>password123</strong></p>
          </div>
        </div>
      </div>
    </main>
  );
}

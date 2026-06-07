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
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#F8F4ED" }}>
      <nav className="border-b px-8 py-4 flex items-center justify-between" style={{ backgroundColor: "#1B4332", borderColor: "#2D6A4F" }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm" style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>R</div>
          <span className="text-lg font-bold" style={{ color: "#FFFDF9" }}>Redefine</span>
        </Link>
        <Link href="/parent/signup" className="text-sm font-medium" style={{ color: "#A7C4B5" }}>No account? Sign up</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black mb-2" style={{ color: "#1B4332" }}>Welcome back</h1>
            <p className="text-base" style={{ color: "#6B7280" }}>Sign in to your parent account</p>
          </div>

          <div className="rounded-2xl border p-8" style={{ backgroundColor: "#FFFDF9", borderColor: "#E5E7EB" }}>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-semibold block mb-1.5" style={{ color: "#1B4332" }}>Email address</label>
                <input type="email" placeholder="your@email.com" value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                  style={{ borderColor: "#D1D5DB", backgroundColor: "#FFFFFF", color: "#1A1A2E" }} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-semibold" style={{ color: "#1B4332" }}>Password</label>
                  <button className="text-xs font-medium" style={{ color: "#2D6A4F" }}>Forgot password?</button>
                </div>
                <input type="password" placeholder="Your password" value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                  style={{ borderColor: "#D1D5DB", backgroundColor: "#FFFFFF", color: "#1A1A2E" }} />
              </div>

              {error && <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: "#FEF2F2", color: "#DC2626" }}>{error}</div>}

              <button onClick={handleLogin} disabled={loading || !form.email || !form.password}
                className="w-full font-black py-3.5 rounded-xl text-sm transition hover:opacity-90 disabled:opacity-40 mt-2"
                style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>
                {loading ? "Signing in..." : "Sign In →"}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ backgroundColor: "#E5E7EB" }} />
                <span className="text-xs" style={{ color: "#9CA3AF" }}>or</span>
                <div className="flex-1 h-px" style={{ backgroundColor: "#E5E7EB" }} />
              </div>

              <Link href="/parent/signup" className="block text-center font-semibold py-3 rounded-xl border text-sm"
                style={{ borderColor: "#C8B89A", color: "#1B4332" }}>Create an account</Link>
            </div>
          </div>

          <div className="mt-4 rounded-xl border px-4 py-3 text-center" style={{ borderColor: "#D1E8D1", backgroundColor: "#EBF5EE" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: "#2D6A4F" }}>Test credentials</p>
            <p className="text-xs" style={{ color: "#4A6741" }}>Email: <span className="font-bold">parent@test.com</span> · Password: <span className="font-bold">password123</span></p>
          </div>

          <p className="text-center text-sm mt-6" style={{ color: "#9CA3AF" }}>
            Are you a kid? <Link href="/kid/login" className="font-semibold" style={{ color: "#2D6A4F" }}>Sign in here</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

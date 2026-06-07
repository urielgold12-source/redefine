"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function KidLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", pin: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!form.username || !form.pin) { setError("Please enter your username and PIN."); return; }
    setLoading(true); setError("");
    setTimeout(() => {
      if (form.username === "jake" && form.pin === "1234") {
        router.push("/kid/dashboard");
      } else {
        setError("Wrong username or PIN. Ask your parent for help.");
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
        <Link href="/parent/login" className="text-sm font-medium" style={{ color: "#A7C4B5" }}>I am a parent</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black mb-2" style={{ color: "#1B4332" }}>Hey, welcome back</h1>
            <p className="text-base" style={{ color: "#6B7280" }}>Enter your username and PIN to continue</p>
          </div>

          <div className="rounded-2xl border p-8" style={{ backgroundColor: "#FFFDF9", borderColor: "#E5E7EB" }}>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-semibold block mb-1.5" style={{ color: "#1B4332" }}>Username</label>
                <input type="text" placeholder="e.g. jake" value={form.username}
                  onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                  style={{ borderColor: "#D1D5DB", backgroundColor: "#FFFFFF", color: "#1A1A2E" }} />
              </div>

              <div>
                <label className="text-sm font-semibold block mb-1.5" style={{ color: "#1B4332" }}>PIN</label>
                <input type="password" placeholder="4-digit PIN" maxLength={4} value={form.pin}
                  onChange={(e) => setForm((p) => ({ ...p, pin: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 text-center text-2xl tracking-widest focus:outline-none"
                  style={{ borderColor: "#D1D5DB", backgroundColor: "#FFFFFF", color: "#1A1A2E" }} />
              </div>

              {/* PIN pad */}
              <div className="grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6,7,8,9,"←",0,"OK"].map((key) => (
                  <button key={key}
                    onClick={() => {
                      if (key === "←") setForm((p) => ({ ...p, pin: p.pin.slice(0, -1) }));
                      else if (key === "OK") handleLogin();
                      else if (form.pin.length < 4) setForm((p) => ({ ...p, pin: p.pin + key }));
                    }}
                    className="py-3.5 rounded-xl text-sm font-bold border transition hover:opacity-80"
                    style={{
                      backgroundColor: key === "OK" ? "#FF9900" : key === "←" ? "#F3F4F6" : "#FFFDF9",
                      borderColor: key === "OK" ? "#FF9900" : "#E5E7EB",
                      color: key === "OK" ? "#1B4332" : "#1A1A2E",
                    }}>
                    {key}
                  </button>
                ))}
              </div>

              {error && <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: "#FEF2F2", color: "#DC2626" }}>{error}</div>}

              <button onClick={handleLogin} disabled={loading || !form.username || form.pin.length < 4}
                className="w-full font-black py-3.5 rounded-xl text-sm transition hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>
                {loading ? "Signing in..." : "Sign In →"}
              </button>
            </div>
          </div>

          <p className="text-center text-sm mt-6" style={{ color: "#9CA3AF" }}>
            Don&apos;t know your PIN? Ask your parent.
          </p>
        </div>
      </div>
    </main>
  );
}

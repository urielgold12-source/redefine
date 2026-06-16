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
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#faf9ff" }}>
      <header className="h-16 flex items-center justify-between px-5 border-b" style={{ backgroundColor: "#ffffff", borderColor: "#e1e8ff" }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm" style={{ backgroundColor: "#003d9b", color: "#ffffff" }}>R</div>
          <span className="font-black text-base" style={{ color: "#003d9b", fontFamily: "'Hanken Grotesk', sans-serif" }}>Redefine</span>
        </Link>
        <Link href="/parent/login" className="text-sm font-medium flex items-center gap-1" style={{ color: "#434654" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>shield_person</span>
          Parent login
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#e9edff" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 32, color: "#003d9b" }}>waving_hand</span>
            </div>
            <h1 className="font-black text-3xl mb-1" style={{ color: "#051a3e", fontFamily: "'Hanken Grotesk', sans-serif" }}>Hey, welcome back</h1>
            <p className="text-sm" style={{ color: "#434654" }}>Enter your username and PIN</p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: "#434654", fontFamily: "'JetBrains Mono', monospace" }}>Username</label>
                <input type="text" placeholder="e.g. jake" value={form.username}
                  onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                  style={{ borderColor: "#c3c6d6", backgroundColor: "#ffffff", color: "#051a3e" }} />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: "#434654", fontFamily: "'JetBrains Mono', monospace" }}>PIN</label>
                <div className="flex gap-3 justify-center mb-4">
                  {[0,1,2,3].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-xl border-2 flex items-center justify-center font-black text-xl transition-all"
                      style={{
                        borderColor: form.pin.length > i ? "#003d9b" : "#c3c6d6",
                        backgroundColor: form.pin.length > i ? "#e9edff" : "#ffffff",
                        color: "#003d9b",
                        fontFamily: "'Hanken Grotesk', sans-serif",
                      }}>
                      {form.pin[i] ? "•" : ""}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6,7,8,9,"⌫",0,"✓"].map((key) => (
                  <button key={key}
                    onClick={() => {
                      if (key === "⌫") setForm((p) => ({ ...p, pin: p.pin.slice(0, -1) }));
                      else if (key === "✓") handleLogin();
                      else if (form.pin.length < 4) setForm((p) => ({ ...p, pin: p.pin + key }));
                    }}
                    className="py-4 rounded-xl text-base font-bold border transition-all active:scale-95"
                    style={{
                      backgroundColor: key === "✓" ? "#003d9b" : key === "⌫" ? "#f1f3ff" : "#ffffff",
                      borderColor: key === "✓" ? "#003d9b" : "#e1e8ff",
                      color: key === "✓" ? "#ffffff" : "#051a3e",
                      fontFamily: "'Hanken Grotesk', sans-serif",
                    }}>
                    {key}
                  </button>
                ))}
              </div>

              {error && (
                <div className="rounded-xl px-4 py-3 text-sm flex items-center gap-2" style={{ backgroundColor: "#ffdad6", color: "#ba1a1a" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
                  {error}
                </div>
              )}

              <button onClick={handleLogin} disabled={loading || !form.username || form.pin.length < 4}
                className="w-full font-black py-3.5 rounded-xl text-sm transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ backgroundColor: "#003d9b", color: "#ffffff", fontFamily: "'Hanken Grotesk', sans-serif" }}>
                {loading ? "Signing in..." : <><span>Sign In</span><span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span></>}
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-xl px-4 py-3 text-center" style={{ backgroundColor: "#e9edff", border: "1px solid #c4d2ff" }}>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#003d9b", fontFamily: "'JetBrains Mono', monospace" }}>Test credentials</p>
            <p className="text-xs" style={{ color: "#434654" }}>Username: <strong>jake</strong> · PIN: <strong>1234</strong></p>
          </div>
        </div>
      </div>
    </main>
  );
}

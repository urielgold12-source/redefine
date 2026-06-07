"use client";

import { useState } from "react";
import Link from "next/link";

export default function ParentSignup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    kidName: "",
    kidAge: "",
    weeklyAllowance: "",
  });

  function updateForm(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <main className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center p-6">

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-700 opacity-20 rounded-full blur-[120px]" />
      </div>

      {/* Logo */}
      <Link href="/" className="text-2xl font-black tracking-tight mb-10">
        Re<span className="text-cyan-400">define</span>
      </Link>

      {/* Progress bar */}
      <div className="flex gap-2 mb-10">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1 w-16 rounded-full transition-all ${s <= step ? "bg-blue-500" : "bg-white/10"}`} />
        ))}
      </div>

      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">

        {/* Step 1 — Parent account */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-black mb-2">Create your account</h2>
            <p className="text-gray-400 text-sm mb-4">You're in control. Let's get you set up.</p>

            <input
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => updateForm("name", e.target.value)}
              className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
            <input
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={(e) => updateForm("email", e.target.value)}
              className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
            <input
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => updateForm("password", e.target.value)}
              className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />

            <button
              onClick={() => setStep(2)}
              disabled={!form.name || !form.email || !form.password}
              className="mt-4 bg-blue-600 hover:bg-blue-500 transition text-white font-black py-3 rounded-xl disabled:opacity-30"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 — Kid info */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-black mb-2">Tell us about your kid</h2>
            <p className="text-gray-400 text-sm mb-4">You can add more kids later.</p>

            <input
              type="text"
              placeholder="Kid's first name"
              value={form.kidName}
              onChange={(e) => updateForm("kidName", e.target.value)}
              className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
            <input
              type="number"
              placeholder="Kid's age"
              value={form.kidAge}
              onChange={(e) => updateForm("kidAge", e.target.value)}
              className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Weekly allowance to start with</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-400">$</span>
                <input
                  type="number"
                  placeholder="20.00"
                  value={form.weeklyAllowance}
                  onChange={(e) => updateForm("weeklyAllowance", e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(1)} className="flex-1 bg-white/10 hover:bg-white/20 transition text-white font-bold py-3 rounded-xl">
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.kidName || !form.kidAge || !form.weeklyAllowance}
                className="flex-1 bg-blue-600 hover:bg-blue-500 transition text-white font-black py-3 rounded-xl disabled:opacity-30"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Set rates */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-black mb-2">Set the rates</h2>
            <p className="text-gray-400 text-sm mb-4">How much does 1 minute on each app cost {form.kidName}?</p>

            {[
              { app: "TikTok", emoji: "🎵", default: "0.10" },
              { app: "Instagram", emoji: "📸", default: "0.08" },
              { app: "Snapchat", emoji: "👻", default: "0.08" },
              { app: "YouTube", emoji: "▶️", default: "0.05" },
              { app: "Twitter/X", emoji: "🐦", default: "0.05" },
            ].map((item) => (
              <div key={item.app} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <span className="font-medium">{item.emoji} {item.app}</span>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    defaultValue={item.default}
                    step="0.01"
                    className="w-16 bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-white text-sm text-center focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-gray-400 text-sm">/min</span>
                </div>
              </div>
            ))}

            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(2)} className="flex-1 bg-white/10 hover:bg-white/20 transition text-white font-bold py-3 rounded-xl">
                ← Back
              </button>
              <Link href="/parent/dashboard" className="flex-1 bg-blue-600 hover:bg-blue-500 transition text-white font-black py-3 rounded-xl text-center">
                Launch Redefine 🚀
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
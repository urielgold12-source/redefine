"use client";

import { useState } from "react";
import Link from "next/link";

export default function ParentSignup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", kidName: "", kidAge: "", weeklyAllowance: "" });

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#F8F4ED" }}>
      <nav className="border-b px-8 py-4 flex items-center justify-between" style={{ backgroundColor: "#1B4332", borderColor: "#2D6A4F" }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm" style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>R</div>
          <span className="text-lg font-bold" style={{ color: "#FFFDF9" }}>Redefine</span>
        </Link>
        <Link href="/parent/login" className="text-sm font-medium" style={{ color: "#A7C4B5" }}>Already have an account?</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className="h-1.5 flex-1 rounded-full transition-all" style={{ backgroundColor: s <= step ? "#2D6A4F" : "#E5E7EB" }} />
              </div>
            ))}
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-black mb-2" style={{ color: "#1B4332" }}>
              {step === 1 ? "Create your account" : step === 2 ? "Add your child" : "Set app rates"}
            </h1>
            <p className="text-base" style={{ color: "#6B7280" }}>
              {step === 1 ? "Free to start. No credit card needed." : step === 2 ? "You can add more children later." : "How much does 1 minute cost on each app?"}
            </p>
          </div>

          <div className="rounded-2xl border p-8" style={{ backgroundColor: "#FFFDF9", borderColor: "#E5E7EB" }}>

            {/* Step 1 */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                {[
                  { key: "name", label: "Full name", type: "text", placeholder: "Your name" },
                  { key: "email", label: "Email address", type: "email", placeholder: "your@email.com" },
                  { key: "password", label: "Password", type: "password", placeholder: "Create a password" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-sm font-semibold block mb-1.5" style={{ color: "#1B4332" }}>{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => update(field.key, e.target.value)}
                      className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                      style={{ borderColor: "#D1D5DB", backgroundColor: "#FFFFFF", color: "#1A1A2E" }} />
                  </div>
                ))}
                <button onClick={() => setStep(2)} disabled={!form.name || !form.email || !form.password}
                  className="w-full font-black py-3.5 rounded-xl text-sm mt-2 transition hover:opacity-90 disabled:opacity-40"
                  style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>Continue →</button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                {[
                  { key: "kidName", label: "Child's first name", type: "text", placeholder: "e.g. Jake" },
                  { key: "kidAge", label: "Child's age", type: "number", placeholder: "e.g. 13" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-sm font-semibold block mb-1.5" style={{ color: "#1B4332" }}>{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => update(field.key, e.target.value)}
                      className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                      style={{ borderColor: "#D1D5DB", backgroundColor: "#FFFFFF", color: "#1A1A2E" }} />
                  </div>
                ))}
                <div>
                  <label className="text-sm font-semibold block mb-1.5" style={{ color: "#1B4332" }}>Weekly allowance to start with ($)</label>
                  <input type="number" placeholder="20.00"
                    value={form.weeklyAllowance}
                    onChange={(e) => update("weeklyAllowance", e.target.value)}
                    className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                    style={{ borderColor: "#D1D5DB", backgroundColor: "#FFFFFF", color: "#1A1A2E" }} />
                </div>
                <div className="flex gap-3 mt-2">
                  <button onClick={() => setStep(1)} className="flex-1 font-bold py-3 rounded-xl border text-sm" style={{ borderColor: "#C8B89A", color: "#1B4332" }}>Back</button>
                  <button onClick={() => setStep(3)} disabled={!form.kidName || !form.kidAge || !form.weeklyAllowance}
                    className="flex-1 font-black py-3 rounded-xl text-sm transition hover:opacity-90 disabled:opacity-40"
                    style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>Continue →</button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="flex flex-col gap-3">
                {[
                  { app: "TikTok", default: "0.10" },
                  { app: "Instagram", default: "0.08" },
                  { app: "Snapchat", default: "0.08" },
                  { app: "YouTube", default: "0.05" },
                  { app: "Twitter / X", default: "0.05" },
                ].map((item) => (
                  <div key={item.app} className="flex items-center justify-between border rounded-xl px-4 py-3" style={{ borderColor: "#E5E7EB", backgroundColor: "#FFFFFF" }}>
                    <span className="text-sm font-semibold" style={{ color: "#1B4332" }}>{item.app}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm" style={{ color: "#6B7280" }}>$</span>
                      <input type="number" defaultValue={item.default} step="0.01"
                        className="w-16 border rounded-lg px-2 py-1 text-sm text-center focus:outline-none"
                        style={{ borderColor: "#D1D5DB", color: "#1A1A2E" }} />
                      <span className="text-sm" style={{ color: "#6B7280" }}>/min</span>
                    </div>
                  </div>
                ))}
                <div className="flex gap-3 mt-2">
                  <button onClick={() => setStep(2)} className="flex-1 font-bold py-3 rounded-xl border text-sm" style={{ borderColor: "#C8B89A", color: "#1B4332" }}>Back</button>
                  <Link href="/parent/dashboard" className="flex-1 font-black py-3 rounded-xl text-sm text-center transition hover:opacity-90"
                    style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>Launch Redefine →</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

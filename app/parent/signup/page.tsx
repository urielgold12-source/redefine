"use client";
import { useState } from "react";
import Link from "next/link";

export default function ParentSignup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", kidName: "", weeklyBudget: "20", screenTimeCost: "0.10" });
  const [error, setError] = useState("");

  function updateForm(key: string, val: string) {
    setForm(p => ({ ...p, [key]: val }));
  }

  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields."); return; }
    setError(""); setStep(2);
  }

  function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    if (!form.kidName) { setError("Enter your child's name."); return; }
    setError(""); setStep(3);
  }

  const inputStyle = { width: "100%", padding: "14px 16px", borderRadius: 14, border: "1.5px solid #e1e8ff", fontSize: 16, color: "#051a3e", background: "#fff", outline: "none", boxSizing: "border-box" as const };

  return (
    <main style={{ backgroundColor: "#faf9ff", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <header style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div className="font-display" style={{ width: 32, height: 32, borderRadius: 10, background: "#0052cc", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14 }}>R</div>
          <span className="font-display" style={{ fontWeight: 800, fontSize: 16, color: "#0052cc" }}>Redefine</span>
        </Link>
        <Link href="/parent/login" style={{ fontSize: 14, color: "#0052cc", fontWeight: 700, textDecoration: "none" }}>Log in</Link>
      </header>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px 48px" }}>
        <div style={{ maxWidth: 400, margin: "0 auto", width: "100%" }}>

          {/* Step indicator */}
          <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ flex: 1, height: 4, borderRadius: 999, background: s <= step ? "#0052cc" : "#e1e8ff", transition: "background 0.3s" }} />
            ))}
          </div>

          {step === 1 && (
            <>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: "#0052cc", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 32, color: "#fff", fontVariationSettings: "'FILL' 1" }}>person_add</span>
              </div>
              <p className="font-mono" style={{ fontSize: 11, color: "#737685", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>Step 1 of 3</p>
              <h1 className="font-display" style={{ fontSize: 34, fontWeight: 900, color: "#051a3e", margin: "0 0 8px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>Create your account</h1>
              <p style={{ fontSize: 15, color: "#434654", margin: "0 0 28px" }}>Free forever. No credit card needed.</p>

              <form onSubmit={handleStep1} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label className="font-mono" style={{ fontSize: 11, color: "#737685", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Your Name</label>
                  <input type="text" value={form.name} onChange={e => updateForm("name", e.target.value)} placeholder="Jane Smith" style={inputStyle} />
                </div>
                <div>
                  <label className="font-mono" style={{ fontSize: 11, color: "#737685", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Email</label>
                  <input type="email" value={form.email} onChange={e => updateForm("email", e.target.value)} placeholder="jane@example.com" style={inputStyle} />
                </div>
                <div>
                  <label className="font-mono" style={{ fontSize: 11, color: "#737685", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Password</label>
                  <input type="password" value={form.password} onChange={e => updateForm("password", e.target.value)} placeholder="At least 8 characters" style={inputStyle} />
                </div>
                {error && <p style={{ fontSize: 13, color: "#ba1a1a", margin: 0 }}>{error}</p>}
                <button type="submit" className="font-display" style={{ width: "100%", padding: "16px 0", borderRadius: 16, border: "none", background: "#0052cc", color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer", marginTop: 4 }}>Continue</button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: "#006e2a", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 32, color: "#fff", fontVariationSettings: "'FILL' 1" }}>child_care</span>
              </div>
              <p className="font-mono" style={{ fontSize: 11, color: "#737685", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>Step 2 of 3</p>
              <h1 className="font-display" style={{ fontSize: 34, fontWeight: 900, color: "#051a3e", margin: "0 0 8px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>Set up your child</h1>
              <p style={{ fontSize: 15, color: "#434654", margin: "0 0 28px" }}>You can add more children later.</p>

              <form onSubmit={handleStep2} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label className="font-mono" style={{ fontSize: 11, color: "#737685", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Child&apos;s Name</label>
                  <input type="text" value={form.kidName} onChange={e => updateForm("kidName", e.target.value)} placeholder="e.g. Jake" style={inputStyle} />
                </div>
                <div>
                  <label className="font-mono" style={{ fontSize: 11, color: "#737685", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Weekly Budget ($)</label>
                  <input type="number" value={form.weeklyBudget} onChange={e => updateForm("weeklyBudget", e.target.value)} min="1" max="500" style={inputStyle} />
                  <p style={{ fontSize: 12, color: "#737685", margin: "6px 0 0" }}>This resets every Monday. They earn it back with tasks.</p>
                </div>
                {error && <p style={{ fontSize: 13, color: "#ba1a1a", margin: 0 }}>{error}</p>}
                <div style={{ display: "flex", gap: 10 }}>
                  <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: "16px 0", borderRadius: 16, border: "1px solid #e1e8ff", background: "#fff", color: "#434654", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Back</button>
                  <button type="submit" className="font-display" style={{ flex: 2, padding: "16px 0", borderRadius: 16, border: "none", background: "#0052cc", color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer" }}>Continue</button>
                </div>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: "#6554c0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 32, color: "#fff", fontVariationSettings: "'FILL' 1" }}>phone_iphone</span>
              </div>
              <p className="font-mono" style={{ fontSize: 11, color: "#737685", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>Step 3 of 3</p>
              <h1 className="font-display" style={{ fontSize: 34, fontWeight: 900, color: "#051a3e", margin: "0 0 8px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>Set the screen time cost</h1>
              <p style={{ fontSize: 15, color: "#434654", margin: "0 0 28px" }}>Every minute on social media drains the balance by this amount.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
                {[
                  { label: "Gentle", value: "0.05", desc: "$0.05/min — soft limit" },
                  { label: "Standard", value: "0.10", desc: "$0.10/min — recommended" },
                  { label: "Strict", value: "0.25", desc: "$0.25/min — strict household" },
                ].map(opt => (
                  <button key={opt.value} onClick={() => updateForm("screenTimeCost", opt.value)}
                    className="glass-card"
                    style={{ padding: "16px 18px", borderRadius: 14, border: form.screenTimeCost === opt.value ? "2px solid #0052cc" : "1px solid #e1e8ff", background: form.screenTimeCost === opt.value ? "#deecff" : "#fff", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p className="font-display" style={{ fontSize: 16, fontWeight: 800, color: "#051a3e", margin: 0 }}>{opt.label}</p>
                      <p className="font-mono" style={{ fontSize: 12, color: "#434654", margin: "4px 0 0" }}>{opt.desc}</p>
                    </div>
                    {form.screenTimeCost === opt.value && <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#0052cc", fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" onClick={() => setStep(2)} style={{ flex: 1, padding: "16px 0", borderRadius: 16, border: "1px solid #e1e8ff", background: "#fff", color: "#434654", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Back</button>
                <Link href="/parent/dashboard" style={{ flex: 2, padding: "16px 0", borderRadius: 16, border: "none", background: "#0052cc", color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>rocket_launch</span>
                  <span className="font-display">Finish Setup</span>
                </Link>
              </div>
            </>
          )}

          <p style={{ marginTop: 28, textAlign: "center", fontSize: 13, color: "#737685" }}>
            Already have an account?{" "}
            <Link href="/parent/login" style={{ color: "#0052cc", fontWeight: 700, textDecoration: "none" }}>Log in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

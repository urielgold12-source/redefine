"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const features = [
    { icon: "phone_iphone",           title: "Live Screen Tracking",  desc: "Every minute on TikTok, Instagram, YouTube drains their balance in real time.", color: "#de350b", bg: "#ffebe6" },
    { icon: "auto_awesome",           title: "AI Task Verification",  desc: "Take a photo of homework or chores. Gemini & GPT-4o grade it instantly — no faking.", color: "#0052cc", bg: "#deebff" },
    { icon: "account_balance_wallet", title: "Real Money Budget",     desc: "Set a weekly budget. They can earn it back, lose it, or learn to save it.", color: "#36b37e", bg: "#e3fcef" },
    { icon: "shield_person",          title: "Parent Controls",       desc: "Approve tasks, set budgets, review AI verdicts. You're always in control.", color: "#6554c0", bg: "#f0ecff" },
  ];

  const steps = [
    { n: "01", icon: "settings",             title: "Parent sets up",       desc: "Create an account, add your kid, set a weekly budget and screen time cost per minute.", color: "#0052cc", bg: "#deebff" },
    { n: "02", icon: "assignment_turned_in", title: "Kid completes tasks",  desc: "Your child takes a photo of finished homework or chores. AI verifies it immediately.", color: "#36b37e", bg: "#e3fcef" },
    { n: "03", icon: "savings",              title: "Balance grows",        desc: "Approved tasks add money back. Screen time drains it. Real consequences, real learning.", color: "#6554c0", bg: "#f0ecff" },
  ];

  return (
    <main style={{ backgroundColor: "#faf9ff", minHeight: "100dvh", color: "#172b4d" }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(250,249,255,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid #dfe1e6" : "none",
        transition: "all 0.2s", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="font-display" style={{ width: 36, height: 36, borderRadius: 12, background: "#0052cc", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>R</div>
          <span className="font-display" style={{ fontWeight: 700, fontSize: 17, color: "#0052cc", letterSpacing: "-0.01em" }}>Redefine</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/parent/login" style={{ fontSize: 14, fontWeight: 600, color: "#42526e", textDecoration: "none", padding: "8px 14px", borderRadius: 10 }}>Log in</Link>
          <Link href="/parent/signup" className="font-display" style={{ fontSize: 14, fontWeight: 700, color: "#fff", textDecoration: "none", padding: "9px 18px", borderRadius: 12, background: "#0052cc", boxShadow: "0 2px 8px rgba(0,82,204,0.28)", letterSpacing: "-0.01em" }}>Get started</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: 108, paddingBottom: 48, paddingLeft: 20, paddingRight: 20, maxWidth: 480, margin: "0 auto", textAlign: "center", position: "relative" }}>
        {/* ambient glow */}
        <div style={{ position: "absolute", top: 70, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(0,82,204,0.08)", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* chip */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, background: "#deebff", border: "1px solid rgba(0,82,204,0.2)", marginBottom: 22 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#0052cc" }}>auto_awesome</span>
            <span className="font-mono" style={{ fontSize: 11, color: "#0747a6", textTransform: "uppercase", letterSpacing: "0.08em" }}>For parents of screen-addicted kids</span>
          </div>

          <h1 className="font-display" style={{ fontSize: 46, fontWeight: 700, color: "#172b4d", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Screen time costs<br /><span style={{ color: "#0052cc" }}>real money.</span>
          </h1>
          <p style={{ fontSize: 16, color: "#42526e", margin: "0 0 32px", lineHeight: 1.65 }}>
            Kids earn screen time by completing real tasks. AI verifies the work. Parents stay in control.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/parent/signup" className="font-display" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 0", borderRadius: 12, background: "#0052cc", color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none", letterSpacing: "-0.01em", boxShadow: "0 4px 14px rgba(0,82,204,0.3)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>rocket_launch</span>
              Get started free
            </Link>
            <Link href="/kid/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "15px 0", borderRadius: 12, border: "1px solid #dfe1e6", background: "#fff", color: "#42526e", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>face</span>
              I&apos;m a kid — log in
            </Link>
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section style={{ padding: "0 20px 48px", maxWidth: 520, margin: "0 auto" }}>
        <p className="font-mono" style={{ fontSize: 11, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, textAlign: "center" }}>What your kid sees</p>

        {/* Outer shell */}
        <div style={{ background: "#fff", borderRadius: 24, border: "1px solid rgba(0,82,204,0.12)", boxShadow: "0 4px 32px rgba(0,0,0,0.07)", overflow: "hidden" }}>

          {/* Mini app header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #f1f3ff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#deebff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="font-display" style={{ fontSize: 14, fontWeight: 700, color: "#0052cc" }}>J</span>
              </div>
              <span className="font-display" style={{ fontSize: 15, fontWeight: 700, color: "#0052cc", letterSpacing: "-0.01em" }}>Jake&apos;s Balance</span>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#42526e" }}>notifications</span>
          </div>

          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>

            {/* AI Prediction banner */}
            <div style={{ background: "#deebff", borderRadius: 14, padding: 18, position: "relative", overflow: "hidden" }}>
              {/* glow */}
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(0,82,204,0.15)", filter: "blur(30px)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 999, background: "#0052cc" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 12, color: "#fff" }}>auto_awesome</span>
                    <span className="font-mono" style={{ fontSize: 10, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em" }}>AI Prediction</span>
                  </div>
                  <span className="font-mono" style={{ fontSize: 10, color: "#42526e" }}>Updated 2m ago</span>
                </div>
                <p className="font-display" style={{ fontSize: 22, fontWeight: 700, color: "#0052cc", margin: "0 0 4px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Balance forecast +$5.00</p>
                <p style={{ fontSize: 13, color: "#42526e", margin: 0, lineHeight: 1.5 }}>Jake&apos;s homework was just verified by Gemini. His balance is growing.</p>
              </div>
            </div>

            {/* Stat cards row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {/* Current Balance */}
              <div style={{ background: "#fff", borderRadius: 12, padding: "14px 14px", border: "1px solid #dfe1e6" }}>
                <p className="font-mono" style={{ fontSize: 10, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>Current Balance</p>
                <p className="font-display" style={{ fontSize: 30, fontWeight: 700, color: "#0052cc", margin: "0 0 4px", letterSpacing: "-0.02em", lineHeight: 1 }}>$7.40</p>
                <p className="font-mono" style={{ fontSize: 11, color: "#36b37e" }}>+$5.00 today</p>
              </div>
              {/* Screen Time Left */}
              <div style={{ background: "#fff", borderRadius: 12, padding: "14px 14px", border: "1px solid #dfe1e6" }}>
                <p className="font-mono" style={{ fontSize: 10, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>Screen Time Left</p>
                <p className="font-display" style={{ fontSize: 30, fontWeight: 700, color: "#172b4d", margin: "0 0 4px", letterSpacing: "-0.02em", lineHeight: 1 }}>74 min</p>
                <p className="font-mono" style={{ fontSize: 11, color: "#de350b" }}>-$0.10/min</p>
              </div>
            </div>

            {/* Line chart card */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #dfe1e6" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <p className="font-display" style={{ fontSize: 14, fontWeight: 600, color: "#172b4d", margin: "0 0 2px", letterSpacing: "-0.01em" }}>Balance This Week</p>
                  <p className="font-mono" style={{ fontSize: 10, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Earned vs Spent</p>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 999, background: "#f1f3ff", border: "1px solid #dfe1e6" }}>
                  <span className="font-mono" style={{ fontSize: 10, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.06em" }}>Weekly</span>
                  <span style={{ fontSize: 10, color: "#42526e" }}>▾</span>
                </div>
              </div>

              {/* SVG Chart */}
              <div style={{ position: "relative" }}>
                <svg viewBox="0 0 340 120" width="100%" height="120" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0052cc" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#0052cc" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#36b37e" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#36b37e" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                      <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>

                  {/* Grid lines */}
                  {[20, 45, 70, 95].map(y => (
                    <line key={y} x1="0" y1={y} x2="340" y2={y} stroke="#f1f3ff" strokeWidth="1" />
                  ))}

                  {/* Blue area fill — MON low, TUE peak, WED slight drop, THU recovery, FRI moderate */}
                  <path
                    d="M 0,90 C 20,88 35,85 57,72 C 75,62 85,22 114,18 C 140,14 152,30 171,38 C 195,48 210,35 228,28 C 246,22 258,42 285,52 L 285,108 L 0,108 Z"
                    fill="url(#blueGrad)"
                  />
                  {/* Blue line */}
                  <path
                    d="M 0,90 C 20,88 35,85 57,72 C 75,62 85,22 114,18 C 140,14 152,30 171,38 C 195,48 210,35 228,28 C 246,22 258,42 285,52"
                    fill="none"
                    stroke="#0052cc"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                  />

                  {/* Green dashed forecast — SAT, SUN */}
                  <path
                    d="M 285,52 C 300,46 315,40 340,36"
                    fill="none"
                    stroke="#36b37e"
                    strokeWidth="2"
                    strokeDasharray="5,4"
                    strokeLinecap="round"
                  />
                  {/* Green forecast area fill */}
                  <path
                    d="M 285,52 C 300,46 315,40 340,36 L 340,108 L 285,108 Z"
                    fill="url(#greenGrad)"
                  />

                  {/* Peak dot on TUE */}
                  <circle cx="114" cy="18" r="4" fill="#0052cc" />
                  <circle cx="114" cy="18" r="7" fill="rgba(0,82,204,0.15)" />

                  {/* Tooltip at peak */}
                  <g transform="translate(80, 0)">
                    <rect x="0" y="0" width="84" height="24" rx="6" fill="#172b4d" />
                    <text x="42" y="10" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="JetBrains Mono, monospace" letterSpacing="0.04em" textLength="70">TUE · +$5.00</text>
                    <text x="42" y="20" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="6" fontFamily="JetBrains Mono, monospace" letterSpacing="0.04em">homework</text>
                    {/* tooltip pointer */}
                    <polygon points="30,24 38,30 46,24" fill="#172b4d" />
                  </g>
                </svg>

                {/* Day labels */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, paddingLeft: 4, paddingRight: 4 }}>
                  {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(d => (
                    <span key={d} className="font-mono" style={{ fontSize: 9, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.06em" }}>{d}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Task completion card */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #dfe1e6" }}>
              <p className="font-display" style={{ fontSize: 14, fontWeight: 600, color: "#172b4d", margin: "0 0 14px", letterSpacing: "-0.01em" }}>Tasks This Week</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Homework", pct: 94, color: "#0052cc", bg: "#deebff" },
                  { label: "Chores",   pct: 82, color: "#36b37e", bg: "#e3fcef" },
                  { label: "Exercise", pct: 76, color: "#6554c0", bg: "#f0ecff" },
                ].map(row => (
                  <div key={row.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                      <span className="font-mono" style={{ fontSize: 10, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em" }}>{row.label}</span>
                      <span className="font-mono" style={{ fontSize: 11, color: "#172b4d", fontWeight: 700 }}>{row.pct}%</span>
                    </div>
                    <div style={{ height: 6, background: row.bg, borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${row.pct}%`, background: row.color, borderRadius: 999, transition: "width 0.4s" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI recommendation banner */}
            <div style={{ background: "rgba(222,235,255,0.45)", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(0,82,204,0.15)", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#0052cc", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#fff", fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
              </div>
              <div>
                <p className="font-display" style={{ fontSize: 13, fontWeight: 700, color: "#0052cc", margin: "0 0 3px", letterSpacing: "-0.01em" }}>AI Recommendation</p>
                <p style={{ fontSize: 12, color: "#42526e", margin: 0, lineHeight: 1.5 }}>Jake&apos;s been consistent this week — consider raising his weekly budget by $2.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "0 20px 48px", maxWidth: 480, margin: "0 auto" }}>
        <p className="font-mono" style={{ fontSize: 11, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>How it works</p>
        <h2 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: "#172b4d", margin: "0 0 20px", letterSpacing: "-0.02em" }}>Three simple steps</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {steps.map(step => (
            <div key={step.n} style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid rgba(0,82,204,0.1)", boxShadow: "0 1px 8px rgba(0,0,0,0.03)", display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0 }}>
                <p className="font-mono" style={{ fontSize: 10, color: step.color, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{step.n}</p>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: step.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22, color: step.color }}>{step.icon}</span>
                </div>
              </div>
              <div>
                <p className="font-display" style={{ fontSize: 16, fontWeight: 600, color: "#172b4d", margin: "0 0 5px", letterSpacing: "-0.01em" }}>{step.title}</p>
                <p style={{ fontSize: 14, color: "#42526e", margin: 0, lineHeight: 1.55 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section style={{ padding: "0 20px 48px", maxWidth: 480, margin: "0 auto" }}>
        <p className="font-mono" style={{ fontSize: 11, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Features</p>
        <h2 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: "#172b4d", margin: "0 0 20px", letterSpacing: "-0.02em" }}>Everything you need</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {features.map(f => (
            <div key={f.title} style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid rgba(0,82,204,0.1)", boxShadow: "0 1px 8px rgba(0,0,0,0.03)" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: f.color }}>{f.icon}</span>
              </div>
              <p className="font-display" style={{ fontSize: 14, fontWeight: 600, color: "#172b4d", margin: "0 0 5px", lineHeight: 1.25, letterSpacing: "-0.01em" }}>{f.title}</p>
              <p style={{ fontSize: 13, color: "#42526e", margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI BADGE ── */}
      <section style={{ padding: "0 20px 48px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ borderRadius: 12, padding: 20, background: "rgba(222,235,255,0.35)", border: "1px solid rgba(0,82,204,0.18)" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#0052cc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#fff", fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <div style={{ flex: 1 }}>
              <p className="font-display" style={{ fontSize: 16, fontWeight: 700, color: "#172b4d", margin: "0 0 6px", letterSpacing: "-0.01em" }}>Powered by Gemini + GPT-4o</p>
              <p style={{ fontSize: 14, color: "#42526e", margin: "0 0 14px", lineHeight: 1.55 }}>Homework is graded by Google Gemini. Chores and exercise are verified by OpenAI GPT-4o. Two AIs, zero excuses.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="font-mono" style={{ fontSize: 11, padding: "4px 10px", borderRadius: 999, background: "#deebff", color: "#0747a6", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Google Gemini</span>
                <span className="font-mono" style={{ fontSize: 11, padding: "4px 10px", borderRadius: 999, background: "#e3fcef", color: "#006644", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>OpenAI GPT-4o</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "0 20px 56px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ background: "#0052cc", borderRadius: 12, padding: "32px 24px", textAlign: "center", backgroundImage: "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, transparent 55%)", boxShadow: "0 8px 32px rgba(0,82,204,0.22)" }}>
          <p className="font-display" style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: "0 0 10px", lineHeight: 1.25, letterSpacing: "-0.02em" }}>Start for free today</p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.72)", margin: "0 0 24px", lineHeight: 1.6 }}>No credit card. No app to install.</p>
          <Link href="/parent/signup" className="font-display" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 0", borderRadius: 12, background: "#fff", color: "#0052cc", fontWeight: 700, fontSize: 16, textDecoration: "none", letterSpacing: "-0.01em", boxShadow: "0 4px 14px rgba(0,82,204,0.3)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>rocket_launch</span>
            Create free account
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #dfe1e6", padding: "24px 20px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <div className="font-display" style={{ width: 28, height: 28, borderRadius: 10, background: "#0052cc", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, letterSpacing: "-0.01em" }}>R</div>
          <span className="font-display" style={{ fontWeight: 700, fontSize: 15, color: "#0052cc", letterSpacing: "-0.01em" }}>Redefine</span>
        </div>
        <p className="font-mono" style={{ fontSize: 11, color: "#42526e", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Every minute on social media costs real money.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
          <Link href="/parent/login" style={{ fontSize: 13, color: "#42526e", textDecoration: "none" }}>Parent Login</Link>
          <Link href="/kid/login"    style={{ fontSize: 13, color: "#42526e", textDecoration: "none" }}>Kid Login</Link>
          <Link href="/parent/signup" style={{ fontSize: 13, color: "#42526e", textDecoration: "none" }}>Sign Up</Link>
        </div>
      </footer>

    </main>
  );
}

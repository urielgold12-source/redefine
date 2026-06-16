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
    { icon: "phone_iphone", title: "Live Screen Tracking", desc: "Every minute on TikTok, Instagram, YouTube drains their balance in real time.", color: "#ba1a1a", bg: "#fff0f0" },
    { icon: "auto_awesome", title: "AI Task Verification", desc: "Take a photo of homework or chores. Gemini & GPT-4o grade it instantly — no faking.", color: "#0052cc", bg: "#deecff" },
    { icon: "account_balance_wallet", title: "Real Money Budget", desc: "Set a weekly budget. They can earn it back, lose it, or learn to save it.", color: "#006e2a", bg: "#e8f5e9" },
    { icon: "shield_person", title: "Parent Controls", desc: "Approve tasks, set budgets, review AI verdicts. You're always in control.", color: "#6554c0", bg: "#ecdfff" },
  ];

  return (
    <main style={{ backgroundColor: "#faf9ff", minHeight: "100dvh" }}>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(250,249,255,0.92)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid #e1e8ff" : "none", transition: "all 0.2s", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="font-display" style={{ width: 36, height: 36, borderRadius: 10, background: "#0052cc", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16 }}>R</div>
          <span className="font-display" style={{ fontWeight: 900, fontSize: 18, color: "#0052cc" }}>Redefine</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/parent/login" style={{ fontSize: 14, fontWeight: 600, color: "#434654", textDecoration: "none", padding: "8px 14px", borderRadius: 10, background: "rgba(0,0,0,0.04)" }}>Log in</Link>
          <Link href="/parent/signup" className="font-display" style={{ fontSize: 14, fontWeight: 800, color: "#fff", textDecoration: "none", padding: "10px 18px", borderRadius: 12, background: "#0052cc" }}>Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 100, paddingBottom: 60, paddingLeft: 24, paddingRight: 24, maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 999, background: "#fff0f0", border: "1px solid #ffcdd2", marginBottom: 20 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ba1a1a" }} />
          <span className="font-mono" style={{ fontSize: 12, color: "#ba1a1a", fontWeight: 500 }}>Screen time is draining their balance right now</span>
        </div>

        <h1 className="font-display" style={{ fontSize: 48, fontWeight: 900, color: "#051a3e", margin: "0 0 16px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          Screen time costs<br />
          <span style={{ color: "#0052cc" }}>real money.</span>
        </h1>
        <p style={{ fontSize: 17, color: "#434654", margin: "0 0 32px", lineHeight: 1.6 }}>
          Redefine turns social media into a learning moment. Kids earn screen time by completing real tasks, verified by AI.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Link href="/parent/signup" className="font-display" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "18px 0", borderRadius: 16, background: "#0052cc", color: "#fff", fontWeight: 900, fontSize: 17, textDecoration: "none" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>rocket_launch</span>
            Set up free in 2 minutes
          </Link>
          <Link href="/kid/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "16px 0", borderRadius: 16, border: "1.5px solid #e1e8ff", background: "#fff", color: "#434654", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>face</span>
            I&apos;m a kid — log in
          </Link>
        </div>
      </section>

      {/* Live demo card */}
      <section style={{ padding: "0 20px 48px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ background: "#051a3e", borderRadius: 24, padding: 24, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -40, bottom: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff6b6b" }} />
              <span className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Live · Jake&apos;s balance</span>
            </div>
            <p className="font-display" style={{ fontSize: 62, fontWeight: 900, color: "#ffd166", margin: "0 0 4px", lineHeight: 1, letterSpacing: "-0.03em" }}>$7.40</p>
            <p className="font-mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>draining $0.10/min on TikTok</p>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10, alignItems: "center" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#69ff87" }}>task_alt</span>
              <div>
                <p className="font-display" style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }}>Homework verified by Gemini AI</p>
                <p className="font-mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>+$5.00 added · 20/20 questions correct</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "0 20px 48px", maxWidth: 480, margin: "0 auto" }}>
        <p className="font-mono" style={{ fontSize: 11, color: "#737685", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>How it works</p>
        <h2 className="font-display" style={{ fontSize: 32, fontWeight: 900, color: "#051a3e", margin: "0 0 24px", letterSpacing: "-0.02em" }}>Three simple steps</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { n: "01", icon: "settings", title: "Parent sets up", desc: "Create an account, add your kid, set a weekly budget and screen time cost per minute.", color: "#0052cc" },
            { n: "02", icon: "assignment_turned_in", title: "Kid completes tasks", desc: "Your child takes a photo of finished homework or chores. AI verifies it immediately.", color: "#006e2a" },
            { n: "03", icon: "savings", title: "Balance grows", desc: "Approved tasks add money back. Screen time drains it. Real consequences, real learning.", color: "#6554c0" },
          ].map(step => (
            <div key={step.n} className="glass-card" style={{ borderRadius: 18, padding: 20, display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0 }}>
                <p className="font-mono" style={{ fontSize: 11, color: step.color, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{step.n}</p>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: step.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#fff", fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
                </div>
              </div>
              <div>
                <p className="font-display" style={{ fontSize: 17, fontWeight: 800, color: "#051a3e", margin: "0 0 6px" }}>{step.title}</p>
                <p style={{ fontSize: 14, color: "#434654", margin: 0, lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "0 20px 48px", maxWidth: 480, margin: "0 auto" }}>
        <p className="font-mono" style={{ fontSize: 11, color: "#737685", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Features</p>
        <h2 className="font-display" style={{ fontSize: 32, fontWeight: 900, color: "#051a3e", margin: "0 0 24px", letterSpacing: "-0.02em" }}>Everything you need</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {features.map(f => (
            <div key={f.title} className="glass-card" style={{ borderRadius: 18, padding: 18 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22, color: f.color, fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
              </div>
              <p className="font-display" style={{ fontSize: 15, fontWeight: 800, color: "#051a3e", margin: "0 0 6px", lineHeight: 1.2 }}>{f.title}</p>
              <p style={{ fontSize: 13, color: "#434654", margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI badge */}
      <section style={{ padding: "0 20px 48px", maxWidth: 480, margin: "0 auto" }}>
        <div className="glass-card" style={{ borderRadius: 20, padding: 20 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "#deecff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#0052cc", fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <div>
              <p className="font-display" style={{ fontSize: 18, fontWeight: 900, color: "#051a3e", margin: "0 0 6px" }}>Powered by Gemini + GPT-4o</p>
              <p style={{ fontSize: 14, color: "#434654", margin: "0 0 12px", lineHeight: 1.5 }}>Homework is graded by Google Gemini. Chores and exercise are verified by OpenAI GPT-4o. Two AIs, zero excuses.</p>
              <div style={{ display: "flex", gap: 8 }}>
                <span className="font-mono" style={{ fontSize: 11, padding: "4px 10px", borderRadius: 999, background: "#e8f0ff", color: "#0052cc", fontWeight: 500 }}>Google Gemini</span>
                <span className="font-mono" style={{ fontSize: 11, padding: "4px 10px", borderRadius: 999, background: "#e8f5e9", color: "#006e2a", fontWeight: 500 }}>OpenAI GPT-4o</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 20px 60px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ background: "#0052cc", borderRadius: 24, padding: "32px 24px", textAlign: "center" }}>
          <p className="font-display" style={{ fontSize: 32, fontWeight: 900, color: "#fff", margin: "0 0 10px", lineHeight: 1.2, letterSpacing: "-0.02em" }}>Start for free today</p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", margin: "0 0 24px" }}>No credit card. No app to install. Just a smarter way to parent.</p>
          <Link href="/parent/signup" className="font-display" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "18px 0", borderRadius: 16, background: "#fff", color: "#0052cc", fontWeight: 900, fontSize: 17, textDecoration: "none" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>rocket_launch</span>
            Create free account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e1e8ff", padding: "24px 20px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <div className="font-display" style={{ width: 28, height: 28, borderRadius: 8, background: "#0052cc", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13 }}>R</div>
          <span className="font-display" style={{ fontWeight: 800, fontSize: 15, color: "#0052cc" }}>Redefine</span>
        </div>
        <p style={{ fontSize: 13, color: "#737685", margin: "0 0 12px" }}>Every minute on social media costs real money.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          <Link href="/parent/login" style={{ fontSize: 13, color: "#737685", textDecoration: "none" }}>Parent Login</Link>
          <Link href="/kid/login" style={{ fontSize: 13, color: "#737685", textDecoration: "none" }}>Kid Login</Link>
          <Link href="/parent/signup" style={{ fontSize: 13, color: "#737685", textDecoration: "none" }}>Sign Up</Link>
        </div>
      </footer>
    </main>
  );
}

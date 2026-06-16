"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [liveBalance, setLiveBalance] = useState(14.80);
  const [tickDir, setTickDir] = useState<"down" | "up">("down");
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveBalance(prev => {
        if (tickDir === "down") {
          const next = Math.round((prev - 0.10) * 100) / 100;
          if (next <= 9.80) { setTickDir("up"); return 9.80; }
          return next;
        } else {
          const next = Math.round((prev + 0.50) * 100) / 100;
          if (next >= 14.80) { setTickDir("down"); return 14.80; }
          return next;
        }
      });
    }, 600);
    return () => clearInterval(interval);
  }, [tickDir]);

  const balanceColor = liveBalance < 11 ? "#de350b" : liveBalance < 13 ? "#f59e0b" : "#36b37e";

  const features = [
    { icon: "phone_iphone",           title: "Live Screen Tracking",    desc: "Every second on TikTok, Instagram, or YouTube drains their balance in real time. They see it disappear.", color: "#de350b", bg: "#ffebe6" },
    { icon: "auto_awesome",           title: "AI Task Verification",    desc: "Snap a photo of finished homework or a clean room. Gemini and GPT-4o verify it in seconds. No cheating.", color: "#0052cc", bg: "#deebff" },
    { icon: "account_balance_wallet", title: "Real Money Consequences", desc: "A weekly budget that actually drains. When it hits zero, social media is locked. Natural consequences.", color: "#36b37e", bg: "#e3fcef" },
    { icon: "shield_person",          title: "Full Parent Control",     desc: "Set tasks, set rates, approve work, adjust budgets. Notifications when your kid needs you.", color: "#6554c0", bg: "#f0ecff" },
    { icon: "menu_book",              title: "Homework Grader",         desc: "Gemini AI reads their homework, checks answers, and gives a score. 20/20? Full reward. 15/20? Partial.", color: "#0052cc", bg: "#deebff" },
    { icon: "notifications_active",   title: "Instant Parent Alerts",   desc: "Get notified the moment your kid completes a task, fails a verification, or runs out of balance.", color: "#36b37e", bg: "#e3fcef" },
  ];

  const steps = [
    { n: "01", icon: "settings",             title: "You set the rules",                  desc: "Pick which apps drain their balance and how fast. Set a weekly budget. Create tasks they can do to earn it back.", color: "#0052cc", bg: "#deebff" },
    { n: "02", icon: "assignment_turned_in", title: "Kid earns by doing",                 desc: "Your child takes a photo of finished homework, a clean room, or a workout. Two AIs verify it instantly.", color: "#36b37e", bg: "#e3fcef" },
    { n: "03", icon: "savings",              title: "Balance grows, screen time unlocks", desc: "Approved tasks add money back. Screen time drains it. They learn real financial cause and effect.", color: "#6554c0", bg: "#f0ecff" },
  ];

  const testimonials = [
    { name: "Sarah M.", role: "Mom of 13-year-old", avatar: "S", text: "My son went from 6 hours of TikTok daily to doing his homework without being asked. It clicked in 3 days.", stars: 5 },
    { name: "David K.", role: "Dad of two teens",   avatar: "D", text: "The AI caught my daughter submitting an old photo of a clean room. It works. They can't game it.", stars: 5 },
    { name: "Priya R.", role: "Mom of 11-year-old", avatar: "P", text: "My kid now asks to do extra chores to get more screen time. I never thought I'd see the day.", stars: 5 },
  ];

  return (
    <main style={{ backgroundColor: "#faf9ff", minHeight: "100dvh", color: "#172b4d", overflowX: "hidden" }}>

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(250,249,255,0.92)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid #dfe1e6" : "none", transition: "all 0.2s", height: 68 }}>
        <div className="section-wide" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="font-display" style={{ width: 38, height: 38, borderRadius: 12, background: "#0052cc", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18 }}>R</div>
            <span className="font-display" style={{ fontWeight: 700, fontSize: 20, color: "#0052cc", letterSpacing: "-0.01em" }}>Redefine</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/parent/login" style={{ fontSize: 15, fontWeight: 600, color: "#42526e", textDecoration: "none", padding: "8px 18px" }}>Log in</Link>
            <Link href="/parent/signup" className="font-display" style={{ fontSize: 15, fontWeight: 700, color: "#fff", textDecoration: "none", padding: "11px 24px", borderRadius: 12, background: "#0052cc", boxShadow: "0 2px 10px rgba(0,82,204,0.3)" }}>Get started free</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: 110, paddingBottom: 80 }}>
        <div className="section-wide">
          <div className="hero-grid">

            {/* Left: copy */}
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: -60, left: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(0,82,204,0.06)", filter: "blur(80px)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 999, background: "#deebff", border: "1px solid rgba(0,82,204,0.2)", marginBottom: 28 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#0052cc" }}>auto_awesome</span>
                  <span className="font-mono" style={{ fontSize: 11, color: "#0747a6", textTransform: "uppercase", letterSpacing: "0.08em" }}>For parents of screen-addicted kids</span>
                </div>
                <h1 className="font-display" style={{ fontSize: "clamp(42px, 5.5vw, 72px)", fontWeight: 700, color: "#172b4d", margin: "0 0 0", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
                  Your kid spends
                </h1>
                <h1 className="font-display" style={{ fontSize: "clamp(42px, 5.5vw, 72px)", fontWeight: 700, margin: "0", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
                  <span style={{ color: "#de350b" }}>6 hours a day</span>
                </h1>
                <h1 className="font-display" style={{ fontSize: "clamp(42px, 5.5vw, 72px)", fontWeight: 700, color: "#172b4d", margin: "0 0 28px", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
                  on social media.
                </h1>
                <p style={{ fontSize: "clamp(17px, 2vw, 21px)", color: "#42526e", margin: "0 0 36px", lineHeight: 1.65, maxWidth: 500 }}>
                  Redefine makes every minute on TikTok, Instagram, and YouTube cost <strong style={{ color: "#172b4d" }}>real money</strong> from their weekly budget. They earn it back by completing tasks — verified instantly by AI.
                </p>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <Link href="/parent/signup" className="font-display" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "18px 32px", borderRadius: 14, background: "#0052cc", color: "#fff", fontWeight: 700, fontSize: 17, textDecoration: "none", boxShadow: "0 6px 24px rgba(0,82,204,0.38)" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>rocket_launch</span>
                    Start free — 2 minutes
                  </Link>
                  <Link href="/kid/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "17px 28px", borderRadius: 14, border: "1.5px solid #dfe1e6", background: "#fff", color: "#42526e", fontWeight: 600, fontSize: 16, textDecoration: "none" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>face</span>
                    I&apos;m a kid — log in
                  </Link>
                </div>
                <p style={{ fontSize: 14, color: "#42526e", marginTop: 18 }}>Free forever &nbsp;·&nbsp; No credit card &nbsp;·&nbsp; Works on any phone</p>
              </div>
            </div>

            {/* Right: live balance ticker */}
            <div>
              <div style={{ background: "#fff", borderRadius: 22, padding: "32px", border: "1px solid #dfe1e6", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
                <p className="font-mono" style={{ fontSize: 11, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>Jake&apos;s balance right now</p>
                <p className="font-display" style={{ fontSize: 64, fontWeight: 700, color: balanceColor, margin: "0 0 6px", letterSpacing: "-0.03em", lineHeight: 1, transition: "color 0.3s" }}>${liveBalance.toFixed(2)}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, background: tickDir === "down" ? "#ffebe6" : "#e3fcef" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: tickDir === "down" ? "#de350b" : "#36b37e" }} />
                    <span className="font-mono" style={{ fontSize: 11, color: tickDir === "down" ? "#de350b" : "#36b37e", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {tickDir === "down" ? "Draining on TikTok" : "Homework earned"}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: "#42526e", margin: 0 }}>of $20.00 weekly</p>
                </div>
                <div style={{ background: "#fafbff", borderRadius: 12, padding: "16px", marginBottom: 16, border: "1px solid #f1f3ff" }}>
                  <p className="font-mono" style={{ fontSize: 10, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>How balance drains</p>
                  {[
                    { app: "TikTok",    rate: "$0.10/min", color: "#de350b" },
                    { app: "Instagram", rate: "$0.10/min", color: "#de350b" },
                    { app: "YouTube",   rate: "$0.05/min", color: "#f59e0b" },
                  ].map(a => (
                    <div key={a.app} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f3ff" }}>
                      <span style={{ fontSize: 15, color: "#172b4d", fontWeight: 500 }}>{a.app}</span>
                      <span className="font-mono" style={{ fontSize: 13, color: a.color, fontWeight: 600 }}>{a.rate}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#e3fcef", borderRadius: 12, padding: "14px 16px", display: "flex", gap: 10, alignItems: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#36b37e", fontVariationSettings: "'FILL' 1" }}>assignment_turned_in</span>
                  <p style={{ fontSize: 14, color: "#172b4d", margin: 0 }}><strong>Homework verified</strong> — +$5.00 added</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section ref={counterRef} style={{ padding: "80px 0", background: "#0a1628" }}>
        <div className="section-wide">
          {/* Headline */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p className="font-mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>The problem</p>
            <h2 className="font-display" style={{ fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 700, color: "#fff", margin: "0 0 18px", letterSpacing: "-0.025em", lineHeight: 1.15 }}>
              Screen time is <span style={{ color: "#de350b" }}>out of control</span> —<br/>and nothing works.
            </h2>
            <p style={{ fontSize: "clamp(16px, 1.8vw, 19px)", color: "rgba(255,255,255,0.55)", margin: "0 auto", lineHeight: 1.7, maxWidth: 580 }}>
              Parental controls get bypassed. Screen time limits start fights. Taking away the phone just builds resentment.
            </p>
          </div>

          {/* Stats — 4 big cards */}
          <div className="problem-stats" style={{ marginBottom: 40 }}>
            {[
              { value: "6.5h",   label: "Average teen screen time per day",     color: "#ff5c5c", border: "rgba(255,92,92,0.25)"  },
              { value: "73%",    label: "Of teens feel they spend too much time online", color: "#f59e0b", border: "rgba(245,158,11,0.25)" },
              { value: "$2,400", label: "In lost productive time every year",    color: "#ff5c5c", border: "rgba(255,92,92,0.25)"  },
              { value: "Week 1", label: "When most kids cut their usage with Redefine", color: "#36b37e", border: "rgba(54,179,126,0.3)" },
            ].map(s => (
              <div key={s.value} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 18, padding: "32px 28px", border: `1px solid ${s.border}` }}>
                <p className="font-display" style={{ fontSize: "clamp(44px, 5vw, 64px)", fontWeight: 700, color: s.color, margin: "0 0 12px", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: "clamp(15px, 1.5vw, 18px)", color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.5, fontWeight: 400 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Green callout */}
          <div style={{ background: "rgba(54,179,126,0.1)", borderRadius: 16, padding: "22px 28px", border: "1px solid rgba(54,179,126,0.3)", display: "flex", gap: 14, alignItems: "center", maxWidth: 700, margin: "0 auto" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 26, color: "#36b37e", flexShrink: 0, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <p style={{ fontSize: "clamp(15px, 1.5vw, 18px)", color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: "#36b37e" }}>Redefine is different.</strong> Kids willingly put the phone down because they understand it costs them money. No fights. No resentment.
            </p>
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section style={{ padding: "80px 0" }}>
        <div className="section-wide">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p className="font-mono" style={{ fontSize: 12, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>What your kid sees</p>
            <h2 className="font-display section-heading" style={{ margin: "0 0 16px" }}>Simple. Immediate. They get it instantly.</h2>
            <p className="section-subheading">One number tells the whole story — their balance. Do tasks, it goes up. Scroll TikTok, it goes down.</p>
          </div>

          {/* Two-column: phone mockup left, callouts right */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 960, margin: "0 auto" }}>

            {/* Phone card */}
            <div style={{ background: "#fff", borderRadius: 28, border: "1px solid #dfe1e6", boxShadow: "0 20px 60px rgba(0,0,0,0.1)", overflow: "hidden", maxWidth: 340, margin: "0 auto", width: "100%" }}>
              {/* Status bar */}
              <div style={{ background: "#0052cc", padding: "14px 20px 16px", textAlign: "center" }}>
                <p className="font-display" style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", margin: "0 0 4px", letterSpacing: "0.01em" }}>Jake&apos;s Weekly Balance</p>
                <p className="font-display" style={{ fontSize: 56, fontWeight: 700, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.03em", lineHeight: 1 }}>$7.40</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 999, background: "rgba(255,255,255,0.15)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff6b6b" }} />
                  <span style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>Draining on TikTok · $0.10/min</span>
                </div>
              </div>

              <div style={{ padding: "16px" }}>
                {/* Tasks */}
                <p className="font-display" style={{ fontSize: 13, fontWeight: 600, color: "#42526e", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.04em", fontSize: "11px" }}>Earn money back by completing tasks</p>
                {[
                  { label: "Do homework",       reward: "+$5.00", icon: "menu_book",         color: "#0052cc", bg: "#deebff", done: true  },
                  { label: "Clean your room",   reward: "+$3.00", icon: "cleaning_services", color: "#36b37e", bg: "#e3fcef", done: false },
                  { label: "30 min exercise",   reward: "+$2.00", icon: "fitness_center",    color: "#6554c0", bg: "#f0ecff", done: false },
                ].map(task => (
                  <div key={task.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", borderRadius: 12, background: task.done ? "#f6fff9" : "#fafbff", border: `1px solid ${task.done ? "#b3f5d1" : "#eef0f8"}`, marginBottom: 8 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: task.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: task.color }}>{task.icon}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#172b4d", margin: 0 }}>{task.label}</p>
                      <p style={{ fontSize: 13, color: task.color, margin: 0, fontWeight: 600 }}>{task.reward}</p>
                    </div>
                    {task.done
                      ? <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#36b37e", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      : <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#dfe1e6" }}>radio_button_unchecked</span>
                    }
                  </div>
                ))}

                {/* AI verified banner */}
                <div style={{ background: "#e3fcef", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 17, color: "#36b37e", fontVariationSettings: "'FILL' 1", flexShrink: 0 }}>auto_awesome</span>
                  <p style={{ fontSize: 12, color: "#006644", margin: 0, fontWeight: 500 }}>Homework verified by AI — <strong>+$5.00 added!</strong></p>
                </div>
              </div>
            </div>

            {/* Right: plain-English callouts */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { icon: "trending_down", color: "#de350b", bg: "#ffebe6", title: "Every scroll costs money", body: "The moment Jake opens TikTok, his $7.40 starts dropping at $0.10 a minute. He can see it happening live. That's the whole point." },
                { icon: "assignment_turned_in", color: "#36b37e", bg: "#e3fcef", title: "Tasks earn it back", body: "Jake takes a photo of his finished homework. The AI checks it in seconds and adds $5.00 back to his balance. No arguing with mom — the AI decides." },
                { icon: "lock", color: "#0052cc", bg: "#deebff", title: "Zero balance = no social media", body: "When his balance hits $0, TikTok is locked until he earns more. The rule enforces itself — you don't have to say a word." },
              ].map(c => (
                <div key={c.title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 24, color: c.color, fontVariationSettings: "'FILL' 1" }}>{c.icon}</span>
                  </div>
                  <div>
                    <p className="font-display" style={{ fontSize: 18, fontWeight: 700, color: "#172b4d", margin: "0 0 6px", letterSpacing: "-0.01em" }}>{c.title}</p>
                    <p style={{ fontSize: 15, color: "#42526e", margin: 0, lineHeight: 1.65 }}>{c.body}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "80px 0", background: "#f1f3ff" }}>
        <div className="section-wide">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p className="font-mono" style={{ fontSize: 12, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>How it works</p>
            <h2 className="font-display section-heading">Simple for you. Life-changing for them.</h2>
            <p className="section-subheading">Set up in under 2 minutes. No app to install on their phone.</p>
          </div>
          <div className="steps-grid">
            {steps.map(step => (
              <div key={step.n} style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1px solid rgba(0,82,204,0.1)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <p className="font-mono" style={{ fontSize: 11, color: step.color, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{step.n}</p>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: step.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 26, color: step.color }}>{step.icon}</span>
                </div>
                <p className="font-display" style={{ fontSize: 20, fontWeight: 600, color: "#172b4d", margin: "0 0 10px", letterSpacing: "-0.01em" }}>{step.title}</p>
                <p style={{ fontSize: 15, color: "#42526e", margin: 0, lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "80px 0" }}>
        <div className="section-wide">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p className="font-mono" style={{ fontSize: 12, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Features</p>
            <h2 className="font-display section-heading">Everything you need to take back control</h2>
          </div>
          <div className="features-grid">
            {features.map(f => (
              <div key={f.title} style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1px solid rgba(0,82,204,0.1)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 26, color: f.color }}>{f.icon}</span>
                </div>
                <p className="font-display" style={{ fontSize: 18, fontWeight: 600, color: "#172b4d", margin: "0 0 10px", letterSpacing: "-0.01em" }}>{f.title}</p>
                <p style={{ fontSize: 15, color: "#42526e", margin: 0, lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VERIFICATION PROOF ── */}
      <section style={{ padding: "80px 0", background: "#f1f3ff" }}>
        <div className="section-narrow">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 999, background: "#deebff", border: "1px solid rgba(0,82,204,0.2)", marginBottom: 18 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 17, color: "#0052cc" }}>verified</span>
              <span className="font-display" style={{ fontSize: 14, fontWeight: 700, color: "#0052cc" }}>AI Verification in action</span>
            </div>
            <h2 className="font-display section-heading">The AI can&apos;t be fooled</h2>
            <p className="section-subheading">Gemini and GPT-4o check every submission. Kids can&apos;t submit old photos or fake their work.</p>
          </div>
          <div className="verify-row">
            {[
              { icon: "menu_book",         color: "#0052cc", bg: "#deebff", ai: "Gemini",  title: "Math homework submitted",  sub: "Photo of worksheet, 4:12 PM",   result: "18/20 correct · +$4.50 earned", ok: true  },
              { icon: "cleaning_services", color: "#36b37e", bg: "#e3fcef", ai: "GPT-4o",  title: "Clean bedroom verified",   sub: "Bed made, floor clear, desk tidy", result: "Task complete · +$2.00 earned",  ok: true  },
              { icon: "cleaning_services", color: "#de350b", bg: "#ffebe6", ai: "GPT-4o",  title: "Dishes not fully done",    sub: "Pots still in sink — try again",   result: "Not approved · $0.00",           ok: false },
            ].map((item, i) => (
              <div key={i} style={{ flex: 1, padding: "18px", borderRadius: 14, background: item.ok ? "#fff" : "#fff8f8", border: `1px solid ${item.ok ? "#e8ecff" : "#ffcdd2"}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: item.color }}>{item.icon}</span>
                  </div>
                  <span className="font-mono" style={{ fontSize: 10, padding: "3px 9px", borderRadius: 999, background: item.bg, color: item.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.ai}</span>
                </div>
                <p className="font-display" style={{ fontSize: 15, fontWeight: 600, color: "#172b4d", margin: "0 0 5px" }}>{item.title}</p>
                <p style={{ fontSize: 13, color: "#42526e", margin: "0 0 8px" }}>{item.sub}</p>
                <p className="font-mono" style={{ fontSize: 12, color: item.ok ? "#36b37e" : "#de350b", margin: 0, fontWeight: 600 }}>{item.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "80px 0" }}>
        <div className="section-wide">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p className="font-mono" style={{ fontSize: 12, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Parent stories</p>
            <h2 className="font-display section-heading">It actually works.</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1px solid rgba(0,82,204,0.1)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                  {Array.from({ length: t.stars }).map((_, si) => <span key={si} style={{ fontSize: 18, color: "#f59e0b" }}>★</span>)}
                </div>
                <p style={{ fontSize: 16, color: "#172b4d", margin: "0 0 20px", lineHeight: 1.65, fontStyle: "italic" }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#deebff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="font-display" style={{ fontSize: 16, fontWeight: 700, color: "#0052cc" }}>{t.avatar}</span>
                  </div>
                  <div>
                    <p className="font-display" style={{ fontSize: 15, fontWeight: 700, color: "#172b4d", margin: 0 }}>{t.name}</p>
                    <p className="font-mono" style={{ fontSize: 10, color: "#42526e", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI BADGE ── */}
      <section style={{ padding: "0 0 80px" }}>
        <div className="section-narrow">
          <div style={{ borderRadius: 18, padding: "36px 40px", background: "rgba(222,235,255,0.45)", border: "1px solid rgba(0,82,204,0.18)", display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: "#0052cc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 30, color: "#fff", fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <p className="font-display" style={{ fontSize: 22, fontWeight: 700, color: "#172b4d", margin: "0 0 10px", letterSpacing: "-0.01em" }}>Powered by Gemini + GPT-4o</p>
              <p style={{ fontSize: 16, color: "#42526e", margin: "0 0 18px", lineHeight: 1.65 }}>Homework is graded by Google Gemini — it reads every question and checks every answer. Chores and exercise are verified by OpenAI GPT-4o Vision. Two world-class AIs. Zero cheating.</p>
              <div style={{ display: "flex", gap: 10 }}>
                <span className="font-mono" style={{ fontSize: 12, padding: "6px 14px", borderRadius: 999, background: "#deebff", color: "#0747a6", textTransform: "uppercase", letterSpacing: "0.05em" }}>Google Gemini</span>
                <span className="font-mono" style={{ fontSize: 12, padding: "6px 14px", borderRadius: 999, background: "#e3fcef", color: "#006644", textTransform: "uppercase", letterSpacing: "0.05em" }}>OpenAI GPT-4o</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING + CTA ── */}
      <section style={{ padding: "0 0 100px" }}>
        <div className="section-wide">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p className="font-mono" style={{ fontSize: 12, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Pricing</p>
            <h2 className="font-display section-heading">Free forever. Seriously.</h2>
          </div>
          <div className="pricing-cta-grid">
            {/* Pricing card */}
            <div style={{ background: "#fff", borderRadius: 18, border: "2.5px solid #0052cc", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,82,204,0.14)" }}>
              <div style={{ background: "#0052cc", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p className="font-display" style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>Redefine Free</p>
                <span className="font-mono" style={{ fontSize: 11, padding: "4px 12px", borderRadius: 999, background: "rgba(255,255,255,0.2)", color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em" }}>Forever</span>
              </div>
              <div style={{ padding: 28 }}>
                <p className="font-display" style={{ fontSize: 48, fontWeight: 700, color: "#172b4d", margin: "0 0 6px", letterSpacing: "-0.02em" }}>$0 <span style={{ fontSize: 20, fontWeight: 500, color: "#42526e" }}>/month</span></p>
                <p style={{ fontSize: 15, color: "#42526e", margin: "0 0 28px" }}>Everything you need. No limits, no upsells.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                  {["Unlimited tasks","AI homework grading (Gemini)","AI chore verification (GPT-4o)","Live balance dashboard for kids","Parent approval controls","Instant parent notifications","Up to 3 children per account"].map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#e3fcef", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#36b37e", fontVariationSettings: "'FILL' 1" }}>check</span>
                      </div>
                      <p style={{ fontSize: 15, color: "#172b4d", margin: 0 }}>{f}</p>
                    </div>
                  ))}
                </div>
                <Link href="/parent/signup" className="font-display" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "18px 0", borderRadius: 14, background: "#0052cc", color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,82,204,0.3)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>rocket_launch</span>
                  Get started free
                </Link>
              </div>
            </div>

            {/* Final CTA */}
            <div style={{ background: "#0052cc", borderRadius: 18, padding: "52px 44px", backgroundImage: "linear-gradient(150deg, rgba(255,255,255,0.09) 0%, transparent 55%)", boxShadow: "0 12px 48px rgba(0,82,204,0.28)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ position: "absolute", bottom: -40, right: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 999, background: "rgba(255,255,255,0.15)", marginBottom: 24 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#fff" }}>bolt</span>
                  <span className="font-mono" style={{ fontSize: 11, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em" }}>Takes 2 minutes to set up</span>
                </div>
                <p className="font-display" style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700, color: "#fff", margin: "0 0 16px", lineHeight: 1.15, letterSpacing: "-0.025em" }}>
                  Stop fighting about screen time. Let money do it.
                </p>
                <p style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", margin: "0 0 36px", lineHeight: 1.7 }}>
                  Free forever. No credit card. Works on any phone. Your kid will understand real financial consequences for the first time in their life.
                </p>
                <Link href="/parent/signup" className="font-display" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "19px 36px", borderRadius: 14, background: "#fff", color: "#0052cc", fontWeight: 700, fontSize: 17, textDecoration: "none", boxShadow: "0 6px 20px rgba(0,82,204,0.3)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22 }}>rocket_launch</span>
                  Create free account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #dfe1e6", padding: "36px 0" }}>
        <div className="section-wide" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="font-display" style={{ width: 32, height: 32, borderRadius: 10, background: "#0052cc", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>R</div>
            <div>
              <p className="font-display" style={{ fontWeight: 700, fontSize: 16, color: "#0052cc", margin: 0 }}>Redefine</p>
              <p className="font-mono" style={{ fontSize: 10, color: "#42526e", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Every minute on social media costs real money.</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            <Link href="/parent/login"  style={{ fontSize: 15, color: "#42526e", textDecoration: "none" }}>Parent Login</Link>
            <Link href="/kid/login"     style={{ fontSize: 15, color: "#42526e", textDecoration: "none" }}>Kid Login</Link>
            <Link href="/parent/signup" style={{ fontSize: 15, color: "#42526e", textDecoration: "none" }}>Sign Up</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}

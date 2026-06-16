"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [liveBalance, setLiveBalance] = useState(14.80);
  const [tickDir, setTickDir] = useState<"down" | "up">("down");
  const [counterVisible, setCounterVisible] = useState(false);
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

  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setCounterVisible(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

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
      <style>{`
        .section-wide { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .section-narrow { max-width: 860px; margin: 0 auto; padding: 0 24px; }
        .hero-grid { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: center; }
        .problem-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        .steps-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .testimonials-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .verify-items { display: flex; flex-direction: column; gap: 14px; }
        .pricing-cta-grid { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: start; }
        @media (min-width: 768px) {
          .section-wide { padding: 0 40px; }
          .section-narrow { padding: 0 40px; }
          .hero-grid { grid-template-columns: 1fr 1fr; gap: 60px; }
          .problem-grid { grid-template-columns: repeat(4, 1fr); }
          .steps-grid { grid-template-columns: repeat(3, 1fr); }
          .features-grid { grid-template-columns: repeat(3, 1fr); }
          .testimonials-grid { grid-template-columns: repeat(3, 1fr); }
          .verify-items { flex-direction: row; gap: 16px; }
          .pricing-cta-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(250,249,255,0.92)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid #dfe1e6" : "none", transition: "all 0.2s", height: 64 }}>
        <div className="section-wide" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="font-display" style={{ width: 36, height: 36, borderRadius: 12, background: "#0052cc", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16 }}>R</div>
            <span className="font-display" style={{ fontWeight: 700, fontSize: 18, color: "#0052cc", letterSpacing: "-0.01em" }}>Redefine</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link href="/parent/login" style={{ fontSize: 14, fontWeight: 600, color: "#42526e", textDecoration: "none", padding: "8px 16px" }}>Log in</Link>
            <Link href="/parent/signup" className="font-display" style={{ fontSize: 14, fontWeight: 700, color: "#fff", textDecoration: "none", padding: "10px 20px", borderRadius: 12, background: "#0052cc", boxShadow: "0 2px 8px rgba(0,82,204,0.28)" }}>Get started free</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: 100, paddingBottom: 72 }}>
        <div className="section-wide">
          <div className="hero-grid">
            {/* Left: copy */}
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: -40, left: -60, width: 340, height: 340, borderRadius: "50%", background: "rgba(0,82,204,0.07)", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, background: "#deebff", border: "1px solid rgba(0,82,204,0.2)", marginBottom: 24 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#0052cc" }}>auto_awesome</span>
                  <span className="font-mono" style={{ fontSize: 11, color: "#0747a6", textTransform: "uppercase", letterSpacing: "0.08em" }}>For parents of screen-addicted kids</span>
                </div>
                <h1 className="font-display" style={{ fontSize: "clamp(38px, 5vw, 58px)", fontWeight: 700, color: "#172b4d", margin: "0 0 6px", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
                  Your kid is spending
                </h1>
                <h1 className="font-display" style={{ fontSize: "clamp(38px, 5vw, 58px)", fontWeight: 700, color: "#172b4d", margin: "0 0 6px", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
                  <span style={{ color: "#de350b" }}>6 hours a day</span> on
                </h1>
                <h1 className="font-display" style={{ fontSize: "clamp(38px, 5vw, 58px)", fontWeight: 700, color: "#172b4d", margin: "0 0 24px", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
                  social media. <span style={{ color: "#0052cc" }}>Stop it.</span>
                </h1>
                <p style={{ fontSize: 18, color: "#42526e", margin: "0 0 32px", lineHeight: 1.7, maxWidth: 480 }}>
                  Redefine makes every minute on TikTok, Instagram, and YouTube cost <strong>real money</strong> from their weekly budget. They earn it back by completing tasks — verified instantly by AI.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Link href="/parent/signup" className="font-display" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 28px", borderRadius: 12, background: "#0052cc", color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 20px rgba(0,82,204,0.35)" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>rocket_launch</span>
                    Start free — 2 minutes
                  </Link>
                  <Link href="/kid/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "15px 24px", borderRadius: 12, border: "1px solid #dfe1e6", background: "#fff", color: "#42526e", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>face</span>
                    I&apos;m a kid — log in
                  </Link>
                </div>
                <p style={{ fontSize: 13, color: "#42526e", marginTop: 16 }}>Free forever · No credit card · Works on any phone</p>
              </div>
            </div>

            {/* Right: live balance ticker */}
            <div>
              <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: "1px solid #dfe1e6", boxShadow: "0 4px 32px rgba(0,0,0,0.07)" }}>
                <p className="font-mono" style={{ fontSize: 10, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>Jake&apos;s balance right now</p>
                <p className="font-display" style={{ fontSize: 54, fontWeight: 700, color: balanceColor, margin: "0 0 4px", letterSpacing: "-0.03em", lineHeight: 1, transition: "color 0.3s" }}>${liveBalance.toFixed(2)}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 999, background: tickDir === "down" ? "#ffebe6" : "#e3fcef" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: tickDir === "down" ? "#de350b" : "#36b37e" }} />
                    <span className="font-mono" style={{ fontSize: 10, color: tickDir === "down" ? "#de350b" : "#36b37e", textTransform: "uppercase", letterSpacing: "0.06em" }}>{tickDir === "down" ? "Draining on TikTok" : "Homework earned"}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#42526e", margin: 0 }}>of $20.00 weekly</p>
                </div>
                <div style={{ background: "#faf9ff", borderRadius: 12, padding: "14px 16px", marginBottom: 16, border: "1px solid #f1f3ff" }}>
                  <p className="font-mono" style={{ fontSize: 10, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>How balance drains</p>
                  {[
                    { app: "TikTok", rate: "$0.10/min", color: "#de350b" },
                    { app: "Instagram", rate: "$0.10/min", color: "#de350b" },
                    { app: "YouTube", rate: "$0.05/min", color: "#f59e0b" },
                  ].map(a => (
                    <div key={a.app} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f1f3ff" }}>
                      <span style={{ fontSize: 14, color: "#172b4d", fontWeight: 500 }}>{a.app}</span>
                      <span className="font-mono" style={{ fontSize: 12, color: a.color, fontWeight: 600 }}>{a.rate}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#e3fcef", borderRadius: 10, padding: "12px 14px", display: "flex", gap: 10, alignItems: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#36b37e", fontVariationSettings: "'FILL' 1" }}>assignment_turned_in</span>
                  <p style={{ fontSize: 13, color: "#172b4d", margin: 0 }}><strong>Homework verified</strong> — +$5.00 added to balance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section ref={counterRef} style={{ padding: "64px 0", background: "#051a3e" }}>
        <div className="section-wide">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 48, flexWrap: "wrap", marginBottom: 36 }}>
            <div style={{ flex: "1 1 320px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, background: "rgba(222,235,255,0.15)", border: "1px solid rgba(255,255,255,0.1)", marginBottom: 16 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#deebff" }}>warning</span>
                <span className="font-mono" style={{ fontSize: 11, color: "#deebff", textTransform: "uppercase", letterSpacing: "0.08em" }}>The problem</span>
              </div>
              <h2 className="font-display" style={{ fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 700, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                Screen time is <span style={{ color: "#de350b" }}>out of control</span> — and nothing works.
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", margin: "0 0 20px", lineHeight: 1.7 }}>
                Parental controls get bypassed. Screen time limits start fights. Taking away the phone builds resentment. Redefine gives kids a reason to put it down — on their own.
              </p>
              <div style={{ background: "rgba(54,179,126,0.1)", borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(54,179,126,0.25)", display: "flex", gap: 10, alignItems: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#36b37e", flexShrink: 0 }}>check_circle</span>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.5 }}>
                  <strong style={{ color: "#36b37e" }}>Redefine is different</strong> — kids willingly put the phone down because they understand the cost. No fights. No resentment.
                </p>
              </div>
            </div>
            <div className="problem-grid" style={{ flex: "1 1 320px" }}>
              {[
                { value: "6.5h",   label: "Average teen screen time per day",    color: "#de350b" },
                { value: "73%",    label: "Of teens feel they're online too much", color: "#f59e0b" },
                { value: "$2,400", label: "Lost productivity value per year",      color: "#de350b" },
                { value: "Week 1", label: "Most kids cut usage dramatically",      color: "#36b37e" },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "20px 18px", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <p className="font-display" style={{ fontSize: 32, fontWeight: 700, color: s.color, margin: "0 0 6px", letterSpacing: "-0.02em" }}>{s.value}</p>
                  <p className="font-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em", lineHeight: 1.4 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section style={{ padding: "72px 0" }}>
        <div className="section-wide">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p className="font-mono" style={{ fontSize: 11, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>What your kid sees</p>
            <h2 className="font-display" style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 700, color: "#172b4d", margin: "0 0 12px", letterSpacing: "-0.02em" }}>A live dashboard they actually care about</h2>
            <p style={{ fontSize: 16, color: "#42526e", margin: "0 auto", lineHeight: 1.7, maxWidth: 560 }}>Every task they complete adds money. Every minute scrolling drains it. They watch it happen in real time.</p>
          </div>

          <div style={{ maxWidth: 540, margin: "0 auto", background: "#fff", borderRadius: 24, border: "1px solid rgba(0,82,204,0.12)", boxShadow: "0 12px 60px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #f1f3ff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#deebff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="font-display" style={{ fontSize: 14, fontWeight: 700, color: "#0052cc" }}>J</span>
                </div>
                <span className="font-display" style={{ fontSize: 15, fontWeight: 700, color: "#0052cc" }}>Jake&apos;s Balance</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ padding: "3px 10px", borderRadius: 999, background: "#ffebe6", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#de350b" }} />
                  <span className="font-mono" style={{ fontSize: 9, color: "#de350b", textTransform: "uppercase", letterSpacing: "0.06em" }}>Draining</span>
                </div>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#42526e" }}>notifications</span>
              </div>
            </div>
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "#deebff", borderRadius: 14, padding: 18, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(0,82,204,0.15)", filter: "blur(30px)", pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 999, background: "#0052cc" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 12, color: "#fff" }}>auto_awesome</span>
                      <span className="font-mono" style={{ fontSize: 10, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em" }}>AI Prediction</span>
                    </div>
                  </div>
                  <p className="font-display" style={{ fontSize: 22, fontWeight: 700, color: "#0052cc", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Balance forecast +$5.00</p>
                  <p style={{ fontSize: 13, color: "#42526e", margin: 0 }}>Jake&apos;s homework was just verified by Gemini. His balance is growing.</p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: "#fff", borderRadius: 12, padding: 14, border: "1px solid #dfe1e6" }}>
                  <p className="font-mono" style={{ fontSize: 9, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 5px" }}>Current Balance</p>
                  <p className="font-display" style={{ fontSize: 28, fontWeight: 700, color: "#0052cc", margin: "0 0 3px", letterSpacing: "-0.02em", lineHeight: 1 }}>$7.40</p>
                  <p className="font-mono" style={{ fontSize: 10, color: "#36b37e" }}>+$5.00 today</p>
                </div>
                <div style={{ background: "#fff", borderRadius: 12, padding: 14, border: "1px solid #dfe1e6" }}>
                  <p className="font-mono" style={{ fontSize: 9, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 5px" }}>Screen Time Left</p>
                  <p className="font-display" style={{ fontSize: 28, fontWeight: 700, color: "#172b4d", margin: "0 0 3px", letterSpacing: "-0.02em", lineHeight: 1 }}>74 min</p>
                  <p className="font-mono" style={{ fontSize: 10, color: "#de350b" }}>-$0.10/min</p>
                </div>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #dfe1e6" }}>
                <p className="font-display" style={{ fontSize: 13, fontWeight: 600, color: "#172b4d", margin: "0 0 12px" }}>Balance This Week</p>
                <svg viewBox="0 0 340 100" width="100%" height="100" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0052cc" stopOpacity="0.16" />
                      <stop offset="100%" stopColor="#0052cc" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="greenGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#36b37e" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#36b37e" stopOpacity="0" />
                    </linearGradient>
                    <filter id="softGlow">
                      <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                      <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  {[20, 45, 70].map(y => (
                    <line key={y} x1="0" y1={y} x2="340" y2={y} stroke="#f1f3ff" strokeWidth="1" />
                  ))}
                  <path d="M 0,80 C 20,78 36,74 57,62 C 75,52 85,14 114,10 C 140,6 152,22 171,30 C 195,40 210,28 228,20 C 246,14 258,34 285,44 L 285,98 L 0,98 Z" fill="url(#blueGrad)" />
                  <path d="M 0,80 C 20,78 36,74 57,62 C 75,52 85,14 114,10 C 140,6 152,22 171,30 C 195,40 210,28 228,20 C 246,14 258,34 285,44" fill="none" stroke="#0052cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#softGlow)" />
                  <path d="M 285,44 C 300,38 315,32 340,28" fill="none" stroke="#36b37e" strokeWidth="2" strokeDasharray="5,4" strokeLinecap="round" />
                  <path d="M 285,44 C 300,38 315,32 340,28 L 340,98 L 285,98 Z" fill="url(#greenGrad2)" />
                  <circle cx="114" cy="10" r="4" fill="#0052cc" />
                  <circle cx="114" cy="10" r="8" fill="rgba(0,82,204,0.13)" />
                </svg>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  {["MON","TUE","WED","THU","FRI","SAT","SUN"].map(d => (
                    <span key={d} className="font-mono" style={{ fontSize: 8, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.05em" }}>{d}</span>
                  ))}
                </div>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #dfe1e6" }}>
                <p className="font-display" style={{ fontSize: 13, fontWeight: 600, color: "#172b4d", margin: "0 0 12px" }}>Tasks This Week</p>
                {[
                  { label: "Homework", pct: 94, color: "#0052cc", bg: "#deebff" },
                  { label: "Chores",   pct: 82, color: "#36b37e", bg: "#e3fcef" },
                  { label: "Exercise", pct: 76, color: "#6554c0", bg: "#f0ecff" },
                ].map(row => (
                  <div key={row.label} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span className="font-mono" style={{ fontSize: 9, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em" }}>{row.label}</span>
                      <span className="font-mono" style={{ fontSize: 10, color: "#172b4d", fontWeight: 700 }}>{row.pct}%</span>
                    </div>
                    <div style={{ height: 5, background: row.bg, borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${row.pct}%`, background: row.color, borderRadius: 999 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "0 0 72px" }}>
        <div className="section-wide">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p className="font-mono" style={{ fontSize: 11, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>How it works</p>
            <h2 className="font-display" style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 700, color: "#172b4d", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Simple for you. Life-changing for them.</h2>
            <p style={{ fontSize: 16, color: "#42526e", margin: "0 auto", lineHeight: 1.7, maxWidth: 520 }}>Set up in under 2 minutes. No app to install on their phone.</p>
          </div>
          <div className="steps-grid">
            {steps.map(step => (
              <div key={step.n} style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid rgba(0,82,204,0.1)", boxShadow: "0 1px 8px rgba(0,0,0,0.03)" }}>
                <p className="font-mono" style={{ fontSize: 10, color: step.color, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{step.n}</p>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: step.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24, color: step.color }}>{step.icon}</span>
                </div>
                <p className="font-display" style={{ fontSize: 18, fontWeight: 600, color: "#172b4d", margin: "0 0 8px", letterSpacing: "-0.01em" }}>{step.title}</p>
                <p style={{ fontSize: 15, color: "#42526e", margin: 0, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "0 0 72px" }}>
        <div className="section-wide">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p className="font-mono" style={{ fontSize: 11, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Features</p>
            <h2 className="font-display" style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 700, color: "#172b4d", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Everything you need to take back control</h2>
          </div>
          <div className="features-grid">
            {features.map(f => (
              <div key={f.title} style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid rgba(0,82,204,0.1)", boxShadow: "0 1px 8px rgba(0,0,0,0.03)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24, color: f.color }}>{f.icon}</span>
                </div>
                <p className="font-display" style={{ fontSize: 16, fontWeight: 600, color: "#172b4d", margin: "0 0 8px", letterSpacing: "-0.01em" }}>{f.title}</p>
                <p style={{ fontSize: 14, color: "#42526e", margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VERIFICATION PROOF ── */}
      <section style={{ padding: "0 0 72px" }}>
        <div className="section-narrow">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 999, background: "#deebff", border: "1px solid rgba(0,82,204,0.2)", marginBottom: 16 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#0052cc" }}>verified</span>
              <span className="font-display" style={{ fontSize: 14, fontWeight: 700, color: "#0052cc" }}>AI Verification in action</span>
            </div>
            <h2 className="font-display" style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 700, color: "#172b4d", margin: "0 0 10px", letterSpacing: "-0.02em" }}>The AI can&apos;t be fooled</h2>
            <p style={{ fontSize: 15, color: "#42526e", margin: 0, lineHeight: 1.6 }}>Gemini and GPT-4o check every submission. Kids can&apos;t submit old photos or fake their work.</p>
          </div>
          <div className="verify-items">
            {[
              { icon: "menu_book",       color: "#0052cc", bg: "#deebff", ai: "Gemini",  title: "Math homework submitted",  sub: "Photo of worksheet taken at 4:12 PM",    result: "18/20 correct · +$4.50 earned", ok: true  },
              { icon: "cleaning_services", color: "#36b37e", bg: "#e3fcef", ai: "GPT-4o", title: "Clean bedroom verified",   sub: "Bed made, floor clear, desk tidy",        result: "Task complete · +$2.00 earned",  ok: true  },
              { icon: "cleaning_services", color: "#de350b", bg: "#ffebe6", ai: "GPT-4o", title: "Dishes not fully done",    sub: "Pots still in sink — try again",          result: "Not approved · $0.00",           ok: false },
            ].map((item, i) => (
              <div key={i} style={{ flex: 1, display: "flex", gap: 12, alignItems: "flex-start", padding: "16px", borderRadius: 12, background: item.ok ? "#fafbff" : "#fff8f8", border: `1px solid ${item.ok ? "#e8ecff" : "#ffcdd2"}` }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: item.bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: item.color }}>{item.icon}</span>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <p className="font-display" style={{ fontSize: 14, fontWeight: 600, color: "#172b4d", margin: 0 }}>{item.title}</p>
                    <span className="font-mono" style={{ fontSize: 9, padding: "2px 7px", borderRadius: 999, background: item.bg, color: item.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.ai}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#42526e", margin: "0 0 6px" }}>{item.sub}</p>
                  <p className="font-mono" style={{ fontSize: 12, color: item.ok ? "#36b37e" : "#de350b", margin: 0, fontWeight: 600 }}>{item.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "72px 0", background: "#f1f3ff" }}>
        <div className="section-wide">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p className="font-mono" style={{ fontSize: 11, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Parent stories</p>
            <h2 className="font-display" style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 700, color: "#172b4d", margin: 0, letterSpacing: "-0.02em" }}>It actually works.</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid rgba(0,82,204,0.1)", boxShadow: "0 1px 8px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                  {Array.from({ length: t.stars }).map((_, si) => <span key={si} style={{ fontSize: 16, color: "#f59e0b" }}>★</span>)}
                </div>
                <p style={{ fontSize: 15, color: "#172b4d", margin: "0 0 18px", lineHeight: 1.65, fontStyle: "italic" }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#deebff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="font-display" style={{ fontSize: 14, fontWeight: 700, color: "#0052cc" }}>{t.avatar}</span>
                  </div>
                  <div>
                    <p className="font-display" style={{ fontSize: 14, fontWeight: 700, color: "#172b4d", margin: 0 }}>{t.name}</p>
                    <p className="font-mono" style={{ fontSize: 10, color: "#42526e", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI BADGE ── */}
      <section style={{ padding: "72px 0" }}>
        <div className="section-narrow">
          <div style={{ borderRadius: 16, padding: "32px 36px", background: "rgba(222,235,255,0.4)", border: "1px solid rgba(0,82,204,0.18)", display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "#0052cc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#fff", fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <p className="font-display" style={{ fontSize: 20, fontWeight: 700, color: "#172b4d", margin: "0 0 8px", letterSpacing: "-0.01em" }}>Powered by Gemini + GPT-4o</p>
              <p style={{ fontSize: 15, color: "#42526e", margin: "0 0 16px", lineHeight: 1.65 }}>Homework is graded by Google Gemini — it reads every question and checks every answer. Chores and exercise are verified by OpenAI GPT-4o Vision. Two world-class AIs. Zero cheating.</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span className="font-mono" style={{ fontSize: 12, padding: "5px 12px", borderRadius: 999, background: "#deebff", color: "#0747a6", textTransform: "uppercase", letterSpacing: "0.05em" }}>Google Gemini</span>
                <span className="font-mono" style={{ fontSize: 12, padding: "5px 12px", borderRadius: 999, background: "#e3fcef", color: "#006644", textTransform: "uppercase", letterSpacing: "0.05em" }}>OpenAI GPT-4o</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING + CTA ── */}
      <section style={{ padding: "0 0 80px" }}>
        <div className="section-wide">
          <div className="pricing-cta-grid">
            {/* Pricing */}
            <div style={{ background: "#fff", borderRadius: 16, border: "2px solid #0052cc", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,82,204,0.12)" }}>
              <div style={{ background: "#0052cc", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p className="font-display" style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>Redefine Free</p>
                <span className="font-mono" style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "rgba(255,255,255,0.2)", color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em" }}>Forever</span>
              </div>
              <div style={{ padding: 24 }}>
                <p className="font-display" style={{ fontSize: 42, fontWeight: 700, color: "#172b4d", margin: "0 0 4px", letterSpacing: "-0.02em" }}>$0 <span style={{ fontSize: 18, fontWeight: 500, color: "#42526e" }}>/month</span></p>
                <p style={{ fontSize: 14, color: "#42526e", margin: "0 0 24px" }}>Everything you need. No limits, no upsells.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  {["Unlimited tasks","AI homework grading (Gemini)","AI chore verification (GPT-4o)","Live balance dashboard for kids","Parent approval controls","Instant parent notifications","Up to 3 children per account"].map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#e3fcef", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#36b37e", fontVariationSettings: "'FILL' 1" }}>check</span>
                      </div>
                      <p style={{ fontSize: 14, color: "#172b4d", margin: 0 }}>{f}</p>
                    </div>
                  ))}
                </div>
                <Link href="/parent/signup" className="font-display" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 0", borderRadius: 12, background: "#0052cc", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: "0 4px 14px rgba(0,82,204,0.3)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>rocket_launch</span>
                  Get started free
                </Link>
              </div>
            </div>

            {/* Final CTA */}
            <div style={{ background: "#0052cc", borderRadius: 16, padding: "48px 36px", backgroundImage: "linear-gradient(155deg, rgba(255,255,255,0.08) 0%, transparent 50%)", boxShadow: "0 8px 40px rgba(0,82,204,0.25)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ position: "absolute", bottom: -30, right: -30, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, background: "rgba(255,255,255,0.15)", marginBottom: 20 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#fff" }}>bolt</span>
                  <span className="font-mono" style={{ fontSize: 11, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em" }}>Takes 2 minutes to set up</span>
                </div>
                <p className="font-display" style={{ fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, color: "#fff", margin: "0 0 14px", lineHeight: 1.2, letterSpacing: "-0.02em" }}>Stop fighting about screen time. Let money do it.</p>
                <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", margin: "0 0 32px", lineHeight: 1.65 }}>Free forever. No credit card. Works on any phone. Your kid will understand real financial consequences for the first time in their life.</p>
                <Link href="/parent/signup" className="font-display" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "17px 32px", borderRadius: 12, background: "#fff", color: "#0052cc", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 14px rgba(0,82,204,0.3)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>rocket_launch</span>
                  Create free account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #dfe1e6", padding: "32px 0" }}>
        <div className="section-wide" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="font-display" style={{ width: 30, height: 30, borderRadius: 10, background: "#0052cc", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>R</div>
            <div>
              <span className="font-display" style={{ fontWeight: 700, fontSize: 15, color: "#0052cc" }}>Redefine</span>
              <p className="font-mono" style={{ fontSize: 10, color: "#42526e", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Every minute on social media costs real money.</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <Link href="/parent/login"  style={{ fontSize: 14, color: "#42526e", textDecoration: "none" }}>Parent Login</Link>
            <Link href="/kid/login"     style={{ fontSize: 14, color: "#42526e", textDecoration: "none" }}>Kid Login</Link>
            <Link href="/parent/signup" style={{ fontSize: 14, color: "#42526e", textDecoration: "none" }}>Sign Up</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}

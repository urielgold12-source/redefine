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

  // Live draining balance animation
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

  // Intersection observer for counter section
  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setCounterVisible(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const features = [
    { icon: "phone_iphone",           title: "Live Screen Tracking",    desc: "Every second on TikTok, Instagram, or YouTube drains their balance in real time. They see it disappear.", color: "#de350b", bg: "#ffebe6" },
    { icon: "auto_awesome",           title: "AI Task Verification",    desc: "Snap a photo of finished homework or a clean room. Gemini and GPT-4o verify it in seconds. No cheating.", color: "#0052cc", bg: "#deebff" },
    { icon: "account_balance_wallet", title: "Real Money Consequences", desc: "A weekly budget that actually drains. When it hits zero, social media is locked. Natural consequences.", color: "#36b37e", bg: "#e3fcef" },
    { icon: "shield_person",          title: "Full Parent Control",     desc: "Set tasks, set rates, approve work, adjust budgets. Notifications when your kid needs you.", color: "#6554c0", bg: "#f0ecff" },
    { icon: "menu_book",              title: "Homework Grader",         desc: "Gemini AI reads their homework, checks answers, and gives a score. 20/20? Full reward. 15/20? Partial.", color: "#0052cc", bg: "#deebff" },
    { icon: "notifications_active",   title: "Instant Parent Alerts",   desc: "Get notified the moment your kid completes a task, fails a verification, or runs out of balance.", color: "#36b37e", bg: "#e3fcef" },
  ];

  const steps = [
    { n: "01", icon: "settings",             title: "You set the rules",         desc: "Pick which apps drain their balance and how fast. Set a weekly budget. Create tasks they can do to earn it back.", color: "#0052cc", bg: "#deebff" },
    { n: "02", icon: "assignment_turned_in", title: "Kid earns by doing",        desc: "Your child takes a photo of finished homework, a clean room, or a workout. Two AIs verify it instantly.", color: "#36b37e", bg: "#e3fcef" },
    { n: "03", icon: "savings",              title: "Balance grows, screen time unlocks", desc: "Approved tasks add money back. Screen time drains it. They learn real financial cause and effect.", color: "#6554c0", bg: "#f0ecff" },
  ];

  const testimonials = [
    { name: "Sarah M.", role: "Mom of 13-year-old", avatar: "S", text: "My son went from 6 hours of TikTok daily to doing his homework without being asked. It clicked in 3 days.", stars: 5 },
    { name: "David K.", role: "Dad of two teens", avatar: "D", text: "The AI actually caught my daughter trying to submit an old photo of a clean room. It works. They can't game it.", stars: 5 },
    { name: "Priya R.", role: "Mom of 11-year-old", avatar: "P", text: "My kid now asks to do extra chores to get more screen time. I never thought I'd see the day.", stars: 5 },
  ];

  const balanceColor = liveBalance < 11 ? "#de350b" : liveBalance < 13 ? "#f59e0b" : "#36b37e";

  return (
    <main style={{ backgroundColor: "#faf9ff", minHeight: "100dvh", color: "#172b4d", overflowX: "hidden" }}>

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(250,249,255,0.92)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid #dfe1e6" : "none", transition: "all 0.2s", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="font-display" style={{ width: 36, height: 36, borderRadius: 12, background: "#0052cc", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>R</div>
          <span className="font-display" style={{ fontWeight: 700, fontSize: 17, color: "#0052cc", letterSpacing: "-0.01em" }}>Redefine</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/parent/login" style={{ fontSize: 14, fontWeight: 600, color: "#42526e", textDecoration: "none", padding: "8px 14px", borderRadius: 10 }}>Log in</Link>
          <Link href="/parent/signup" className="font-display" style={{ fontSize: 14, fontWeight: 700, color: "#fff", textDecoration: "none", padding: "9px 18px", borderRadius: 12, background: "#0052cc", boxShadow: "0 2px 8px rgba(0,82,204,0.28)", letterSpacing: "-0.01em" }}>Get started free</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: 100, paddingBottom: 0, paddingLeft: 20, paddingRight: 20, maxWidth: 480, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: 60, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(0,82,204,0.07)", filter: "blur(70px)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", top: 120, left: -80, width: 240, height: 240, borderRadius: "50%", background: "rgba(54,179,126,0.07)", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, background: "#deebff", border: "1px solid rgba(0,82,204,0.2)", marginBottom: 20 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#0052cc" }}>auto_awesome</span>
            <span className="font-mono" style={{ fontSize: 11, color: "#0747a6", textTransform: "uppercase", letterSpacing: "0.08em" }}>For parents of screen-addicted kids</span>
          </div>

          <h1 className="font-display" style={{ fontSize: 44, fontWeight: 700, color: "#172b4d", margin: "0 0 6px", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            Your kid is spending
          </h1>
          <h1 className="font-display" style={{ fontSize: 44, fontWeight: 700, color: "#172b4d", margin: "0 0 6px", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            <span style={{ color: "#de350b" }}>6 hours a day</span> on
          </h1>
          <h1 className="font-display" style={{ fontSize: 44, fontWeight: 700, color: "#172b4d", margin: "0 0 20px", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            social media. <span style={{ color: "#0052cc" }}>Stop it.</span>
          </h1>

          <p style={{ fontSize: 16, color: "#42526e", margin: "0 0 28px", lineHeight: 1.7 }}>
            Redefine makes every minute on TikTok, Instagram, and YouTube cost <strong>real money</strong> from their weekly budget. They earn it back by completing tasks — verified instantly by AI.
          </p>

          {/* Live balance ticker */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px 20px", marginBottom: 28, border: "1px solid #dfe1e6", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ textAlign: "left" }}>
              <p className="font-mono" style={{ fontSize: 10, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>Jake's balance right now</p>
              <p className="font-display" style={{ fontSize: 36, fontWeight: 700, color: balanceColor, margin: 0, letterSpacing: "-0.03em", lineHeight: 1, transition: "color 0.3s" }}>${liveBalance.toFixed(2)}</p>
              <p className="font-mono" style={{ fontSize: 11, color: tickDir === "down" ? "#de350b" : "#36b37e", margin: "4px 0 0" }}>
                {tickDir === "down" ? "▼ draining on TikTok" : "▲ homework reward added"}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 999, background: tickDir === "down" ? "#ffebe6" : "#e3fcef" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: tickDir === "down" ? "#de350b" : "#36b37e" }} />
                <span className="font-mono" style={{ fontSize: 10, color: tickDir === "down" ? "#de350b" : "#36b37e", textTransform: "uppercase", letterSpacing: "0.06em" }}>{tickDir === "down" ? "Live" : "Earned"}</span>
              </div>
              <p style={{ fontSize: 12, color: "#42526e", margin: 0, textAlign: "right" }}>of $20.00 weekly</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            <Link href="/parent/signup" className="font-display" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "17px 0", borderRadius: 12, background: "#0052cc", color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none", letterSpacing: "-0.01em", boxShadow: "0 4px 20px rgba(0,82,204,0.35)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>rocket_launch</span>
              Start free — set up in 2 minutes
            </Link>
            <Link href="/kid/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "15px 0", borderRadius: 12, border: "1px solid #dfe1e6", background: "#fff", color: "#42526e", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>face</span>
              I&apos;m a kid — log in
            </Link>
          </div>
          <p style={{ fontSize: 13, color: "#42526e", margin: 0 }}>Free forever · No credit card · Works on any phone</p>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section ref={counterRef} style={{ padding: "48px 20px", background: "#051a3e", marginTop: 48 }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, background: "rgba(222,235,255,0.15)", border: "1px solid rgba(255,255,255,0.1)", marginBottom: 16 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#deebff" }}>warning</span>
            <span className="font-mono" style={{ fontSize: 11, color: "#deebff", textTransform: "uppercase", letterSpacing: "0.08em" }}>The problem</span>
          </div>
          <h2 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            Screen time is <span style={{ color: "#de350b" }}>out of control</span> — and nothing works.
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", margin: "0 0 32px", lineHeight: 1.65 }}>
            Parental controls get bypassed. Screen time limits start fights. Taking away the phone just builds resentment. Redefine gives kids a reason to put the phone down — on their own.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            {[
              { value: "6.5h", label: "Average teen screen time per day", color: "#de350b" },
              { value: "73%", label: "Of teens feel they're online too much", color: "#f59e0b" },
              { value: "$2,400", label: "Lost productivity value per year", color: "#de350b" },
              { value: "Week 1", label: "Most kids cut usage dramatically", color: "#36b37e" },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "16px 14px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="font-display" style={{ fontSize: 28, fontWeight: 700, color: s.color, margin: "0 0 4px", letterSpacing: "-0.02em" }}>{s.value}</p>
                <p className="font-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em", lineHeight: 1.4 }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(54,179,126,0.1)", borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(54,179,126,0.25)", display: "flex", gap: 10, alignItems: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#36b37e", flexShrink: 0 }}>check_circle</span>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.5 }}>
              <strong style={{ color: "#36b37e" }}>Redefine works differently</strong> — kids willingly put the phone down because they understand the cost. No fights. No resentment.
            </p>
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section style={{ padding: "48px 20px", maxWidth: 520, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <p className="font-mono" style={{ fontSize: 11, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>What your kid sees</p>
          <h2 className="font-display" style={{ fontSize: 26, fontWeight: 700, color: "#172b4d", margin: "0 0 8px", letterSpacing: "-0.02em" }}>A live dashboard they actually care about</h2>
          <p style={{ fontSize: 14, color: "#42526e", margin: 0, lineHeight: 1.6 }}>Every task they complete adds money. Every minute scrolling drains it. They watch it happen in real time.</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 24, border: "1px solid rgba(0,82,204,0.12)", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          {/* Mini app header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #f1f3ff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#deebff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="font-display" style={{ fontSize: 14, fontWeight: 700, color: "#0052cc" }}>J</span>
              </div>
              <span className="font-display" style={{ fontSize: 15, fontWeight: 700, color: "#0052cc", letterSpacing: "-0.01em" }}>Jake&apos;s Balance</span>
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
            {/* AI Prediction banner */}
            <div style={{ background: "#deebff", borderRadius: 14, padding: 18, position: "relative", overflow: "hidden" }}>
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

            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: "#fff", borderRadius: 12, padding: "14px", border: "1px solid #dfe1e6" }}>
                <p className="font-mono" style={{ fontSize: 9, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 5px" }}>Current Balance</p>
                <p className="font-display" style={{ fontSize: 28, fontWeight: 700, color: "#0052cc", margin: "0 0 3px", letterSpacing: "-0.02em", lineHeight: 1 }}>$7.40</p>
                <p className="font-mono" style={{ fontSize: 10, color: "#36b37e" }}>+$5.00 today</p>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: "14px", border: "1px solid #dfe1e6" }}>
                <p className="font-mono" style={{ fontSize: 9, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 5px" }}>Screen Time Left</p>
                <p className="font-display" style={{ fontSize: 28, fontWeight: 700, color: "#172b4d", margin: "0 0 3px", letterSpacing: "-0.02em", lineHeight: 1 }}>74 min</p>
                <p className="font-mono" style={{ fontSize: 10, color: "#de350b" }}>-$0.10/min</p>
              </div>
            </div>

            {/* Line chart */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #dfe1e6" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <p className="font-display" style={{ fontSize: 13, fontWeight: 600, color: "#172b4d", margin: "0 0 2px", letterSpacing: "-0.01em" }}>Balance This Week</p>
                  <p className="font-mono" style={{ fontSize: 9, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Earned vs Spent</p>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 999, background: "#f1f3ff", border: "1px solid #dfe1e6" }}>
                  <span className="font-mono" style={{ fontSize: 9, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.06em" }}>Weekly ▾</span>
                </div>
              </div>
              <div style={{ position: "relative" }}>
                <svg viewBox="0 0 340 110" width="100%" height="110" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
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
                  {[22, 45, 68, 91].map(y => (
                    <line key={y} x1="0" y1={y} x2="340" y2={y} stroke="#f1f3ff" strokeWidth="1" />
                  ))}
                  <path d="M 0,88 C 20,86 36,82 57,70 C 75,60 85,20 114,16 C 140,12 152,28 171,36 C 195,46 210,33 228,26 C 246,20 258,40 285,50 L 285,105 L 0,105 Z" fill="url(#blueGrad)" />
                  <path d="M 0,88 C 20,86 36,82 57,70 C 75,60 85,20 114,16 C 140,12 152,28 171,36 C 195,46 210,33 228,26 C 246,20 258,40 285,50" fill="none" stroke="#0052cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#softGlow)" />
                  <path d="M 285,50 C 300,44 315,38 340,34" fill="none" stroke="#36b37e" strokeWidth="2" strokeDasharray="5,4" strokeLinecap="round" />
                  <path d="M 285,50 C 300,44 315,38 340,34 L 340,105 L 285,105 Z" fill="url(#greenGrad2)" />
                  <circle cx="114" cy="16" r="4" fill="#0052cc" />
                  <circle cx="114" cy="16" r="8" fill="rgba(0,82,204,0.13)" />
                  <g transform="translate(76,-2)">
                    <rect x="0" y="0" width="90" height="26" rx="6" fill="#172b4d" />
                    <text x="45" y="11" textAnchor="middle" fill="#fff" fontSize="7.5" fontFamily="JetBrains Mono,monospace" letterSpacing="0.04em">TUE · +$5.00</text>
                    <text x="45" y="21" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="6.5" fontFamily="JetBrains Mono,monospace">homework verified</text>
                    <polygon points="32,26 40,33 48,26" fill="#172b4d" />
                  </g>
                </svg>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  {["MON","TUE","WED","THU","FRI","SAT","SUN"].map(d => (
                    <span key={d} className="font-mono" style={{ fontSize: 8, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.05em" }}>{d}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Task completion */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #dfe1e6" }}>
              <p className="font-display" style={{ fontSize: 13, fontWeight: 600, color: "#172b4d", margin: "0 0 12px", letterSpacing: "-0.01em" }}>Tasks This Week</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Homework", pct: 94, color: "#0052cc", bg: "#deebff" },
                  { label: "Chores",   pct: 82, color: "#36b37e", bg: "#e3fcef" },
                  { label: "Exercise", pct: 76, color: "#6554c0", bg: "#f0ecff" },
                ].map(row => (
                  <div key={row.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
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

            {/* AI recommendation */}
            <div style={{ background: "rgba(222,235,255,0.5)", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(0,82,204,0.15)", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "#0052cc", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 17, color: "#fff", fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
              </div>
              <div>
                <p className="font-display" style={{ fontSize: 12, fontWeight: 700, color: "#0052cc", margin: "0 0 2px", letterSpacing: "-0.01em" }}>AI Recommendation</p>
                <p style={{ fontSize: 12, color: "#42526e", margin: 0, lineHeight: 1.5 }}>Jake&apos;s been consistent this week — consider raising his weekly budget by $2.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "0 20px 48px", maxWidth: 480, margin: "0 auto" }}>
        <p className="font-mono" style={{ fontSize: 11, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>How it works</p>
        <h2 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: "#172b4d", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Simple for you. Life-changing for them.</h2>
        <p style={{ fontSize: 14, color: "#42526e", margin: "0 0 24px", lineHeight: 1.6 }}>Set up in under 2 minutes. No app to install on their phone.</p>
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

      {/* ── FEATURES ── */}
      <section style={{ padding: "0 20px 48px", maxWidth: 480, margin: "0 auto" }}>
        <p className="font-mono" style={{ fontSize: 11, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Features</p>
        <h2 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: "#172b4d", margin: "0 0 20px", letterSpacing: "-0.02em" }}>Everything you need to take back control</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {features.map(f => (
            <div key={f.title} style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid rgba(0,82,204,0.1)", boxShadow: "0 1px 8px rgba(0,0,0,0.03)" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: f.color }}>{f.icon}</span>
              </div>
              <p className="font-display" style={{ fontSize: 13, fontWeight: 600, color: "#172b4d", margin: "0 0 5px", lineHeight: 1.25, letterSpacing: "-0.01em" }}>{f.title}</p>
              <p style={{ fontSize: 12, color: "#42526e", margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── VERIFICATION PROOF ── */}
      <section style={{ padding: "0 20px 48px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(0,82,204,0.1)", overflow: "hidden", boxShadow: "0 2px 20px rgba(0,0,0,0.05)" }}>
          <div style={{ background: "#deebff", padding: "16px 20px", borderBottom: "1px solid rgba(0,82,204,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#0052cc" }}>verified</span>
              <p className="font-display" style={{ fontSize: 15, fontWeight: 700, color: "#0052cc", margin: 0, letterSpacing: "-0.01em" }}>AI Verification in action</p>
            </div>
          </div>
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { type: "homework", icon: "menu_book", color: "#0052cc", bg: "#deebff", ai: "Gemini", title: "Math homework submitted", sub: "Photo of worksheet taken at 4:12 PM", result: "18/20 correct · +$4.50 earned", ok: true },
              { type: "chore", icon: "cleaning_services", color: "#36b37e", bg: "#e3fcef", ai: "GPT-4o", title: "Clean bedroom verified", sub: "Bed made, floor clear, desk tidy", result: "Task complete · +$2.00 earned", ok: true },
              { type: "chore", icon: "cleaning_services", color: "#de350b", bg: "#ffebe6", ai: "GPT-4o", title: "Dishes not fully done", sub: "Pots still in sink — try again", result: "Not approved · $0.00", ok: false },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", borderRadius: 10, background: item.ok ? "#fafbff" : "#fff8f8", border: `1px solid ${item.ok ? "#e8ecff" : "#ffcdd2"}` }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: item.bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: item.color }}>{item.icon}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 2 }}>
                    <p className="font-display" style={{ fontSize: 13, fontWeight: 600, color: "#172b4d", margin: 0, letterSpacing: "-0.01em", lineHeight: 1.3 }}>{item.title}</p>
                    <span className="font-mono" style={{ fontSize: 9, padding: "2px 7px", borderRadius: 999, background: item.bg, color: item.color, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>{item.ai}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#42526e", margin: "0 0 5px" }}>{item.sub}</p>
                  <p className="font-mono" style={{ fontSize: 11, color: item.ok ? "#36b37e" : "#de350b", margin: 0, fontWeight: 600 }}>{item.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "0 20px 48px", maxWidth: 480, margin: "0 auto" }}>
        <p className="font-mono" style={{ fontSize: 11, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Parent stories</p>
        <h2 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: "#172b4d", margin: "0 0 20px", letterSpacing: "-0.02em" }}>It actually works.</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid rgba(0,82,204,0.1)", boxShadow: "0 1px 8px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                {Array.from({ length: t.stars }).map((_, si) => (
                  <span key={si} style={{ fontSize: 14, color: "#f59e0b" }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: 15, color: "#172b4d", margin: "0 0 14px", lineHeight: 1.6, fontStyle: "italic" }}>&ldquo;{t.text}&rdquo;</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#deebff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="font-display" style={{ fontSize: 14, fontWeight: 700, color: "#0052cc" }}>{t.avatar}</span>
                </div>
                <div>
                  <p className="font-display" style={{ fontSize: 13, fontWeight: 700, color: "#172b4d", margin: 0, letterSpacing: "-0.01em" }}>{t.name}</p>
                  <p className="font-mono" style={{ fontSize: 10, color: "#42526e", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI BADGE ── */}
      <section style={{ padding: "0 20px 48px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ borderRadius: 12, padding: 20, background: "rgba(222,235,255,0.4)", border: "1px solid rgba(0,82,204,0.18)" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#0052cc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#fff", fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <div style={{ flex: 1 }}>
              <p className="font-display" style={{ fontSize: 16, fontWeight: 700, color: "#172b4d", margin: "0 0 6px", letterSpacing: "-0.01em" }}>Powered by Gemini + GPT-4o</p>
              <p style={{ fontSize: 14, color: "#42526e", margin: "0 0 14px", lineHeight: 1.55 }}>Homework is graded by Google Gemini — it reads every question and checks every answer. Chores and exercise are verified by OpenAI GPT-4o Vision. Two world-class AIs. Zero cheating.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="font-mono" style={{ fontSize: 11, padding: "4px 10px", borderRadius: 999, background: "#deebff", color: "#0747a6", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Google Gemini</span>
                <span className="font-mono" style={{ fontSize: 11, padding: "4px 10px", borderRadius: 999, background: "#e3fcef", color: "#006644", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>OpenAI GPT-4o</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding: "0 20px 48px", maxWidth: 480, margin: "0 auto" }}>
        <p className="font-mono" style={{ fontSize: 11, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Pricing</p>
        <h2 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: "#172b4d", margin: "0 0 20px", letterSpacing: "-0.02em" }}>Free forever. Seriously.</h2>
        <div style={{ background: "#fff", borderRadius: 16, border: "2px solid #0052cc", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,82,204,0.12)" }}>
          <div style={{ background: "#0052cc", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p className="font-display" style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.01em" }}>Redefine Free</p>
            <span className="font-mono" style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "rgba(255,255,255,0.2)", color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em" }}>Current plan</span>
          </div>
          <div style={{ padding: 20 }}>
            <p className="font-display" style={{ fontSize: 38, fontWeight: 700, color: "#172b4d", margin: "0 0 4px", letterSpacing: "-0.02em" }}>$0 <span style={{ fontSize: 16, fontWeight: 500, color: "#42526e" }}>/month</span></p>
            <p style={{ fontSize: 14, color: "#42526e", margin: "0 0 20px" }}>Everything you need. No limits, no upsells.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Unlimited tasks",
                "AI homework grading (Gemini)",
                "AI chore verification (GPT-4o)",
                "Live balance dashboard for kids",
                "Parent approval controls",
                "Instant parent notifications",
                "Up to 3 children per account",
              ].map(feature => (
                <div key={feature} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#e3fcef", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#36b37e", fontVariationSettings: "'FILL' 1" }}>check</span>
                  </div>
                  <p style={{ fontSize: 14, color: "#172b4d", margin: 0 }}>{feature}</p>
                </div>
              ))}
            </div>
            <Link href="/parent/signup" className="font-display" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 0", borderRadius: 12, background: "#0052cc", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", letterSpacing: "-0.01em", marginTop: 24, boxShadow: "0 4px 14px rgba(0,82,204,0.3)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>rocket_launch</span>
              Get started free
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "0 20px 56px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ background: "#0052cc", borderRadius: 16, padding: "36px 24px", textAlign: "center", backgroundImage: "linear-gradient(155deg, rgba(255,255,255,0.08) 0%, transparent 50%)", boxShadow: "0 8px 40px rgba(0,82,204,0.25)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", bottom: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, background: "rgba(255,255,255,0.15)", marginBottom: 16 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#fff" }}>bolt</span>
              <span className="font-mono" style={{ fontSize: 11, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em" }}>Takes 2 minutes to set up</span>
            </div>
            <p className="font-display" style={{ fontSize: 30, fontWeight: 700, color: "#fff", margin: "0 0 10px", lineHeight: 1.2, letterSpacing: "-0.02em" }}>Stop fighting about screen time. Let money do it.</p>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", margin: "0 0 28px", lineHeight: 1.6 }}>Free forever. No credit card. Works on any phone.</p>
            <Link href="/parent/signup" className="font-display" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "17px 0", borderRadius: 12, background: "#fff", color: "#0052cc", fontWeight: 700, fontSize: 16, textDecoration: "none", letterSpacing: "-0.01em", boxShadow: "0 4px 14px rgba(0,82,204,0.3)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>rocket_launch</span>
              Create free account
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #dfe1e6", padding: "24px 20px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <div className="font-display" style={{ width: 28, height: 28, borderRadius: 10, background: "#0052cc", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>R</div>
          <span className="font-display" style={{ fontWeight: 700, fontSize: 15, color: "#0052cc", letterSpacing: "-0.01em" }}>Redefine</span>
        </div>
        <p className="font-mono" style={{ fontSize: 11, color: "#42526e", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Every minute on social media costs real money.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
          <Link href="/parent/login"  style={{ fontSize: 13, color: "#42526e", textDecoration: "none" }}>Parent Login</Link>
          <Link href="/kid/login"     style={{ fontSize: 13, color: "#42526e", textDecoration: "none" }}>Kid Login</Link>
          <Link href="/parent/signup" style={{ fontSize: 13, color: "#42526e", textDecoration: "none" }}>Sign Up</Link>
        </div>
      </footer>

    </main>
  );
}

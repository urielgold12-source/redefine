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
    { icon: "phone_iphone",        title: "Live Screen Tracking",  desc: "Every minute on TikTok, Instagram, YouTube drains their balance in real time.", color: "#de350b", bg: "#ffebe6" },
    { icon: "auto_awesome",        title: "AI Task Verification",  desc: "Take a photo of homework or chores. Gemini & GPT-4o grade it instantly — no faking.", color: "#0052cc", bg: "#deebff" },
    { icon: "account_balance_wallet", title: "Real Money Budget",  desc: "Set a weekly budget. They can earn it back, lose it, or learn to save it.", color: "#36b37e", bg: "#e3fcef" },
    { icon: "shield_person",       title: "Parent Controls",       desc: "Approve tasks, set budgets, review AI verdicts. You're always in control.", color: "#6554c0", bg: "#f0ecff" },
  ];

  const steps = [
    { n: "01", icon: "settings",            title: "Parent sets up",        desc: "Create an account, add your kid, set a weekly budget and screen time cost per minute.", color: "#0052cc", bg: "#deebff" },
    { n: "02", icon: "assignment_turned_in", title: "Kid completes tasks",   desc: "Your child takes a photo of finished homework or chores. AI verifies it immediately.", color: "#36b37e", bg: "#e3fcef" },
    { n: "03", icon: "savings",             title: "Balance grows",          desc: "Approved tasks add money back. Screen time drains it. Real consequences, real learning.", color: "#6554c0", bg: "#f0ecff" },
  ];

  return (
    <main style={{ backgroundColor: "#faf9ff", minHeight: "100dvh", color: "#172b4d" }}>

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(250,249,255,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid #dfe1e6" : "none",
        transition: "all 0.2s", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="font-display" style={{
            width: 36, height: 36, borderRadius: 12, background: "#0052cc",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em",
          }}>R</div>
          <span className="font-display" style={{ fontWeight: 700, fontSize: 17, color: "#0052cc", letterSpacing: "-0.01em" }}>Redefine</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/parent/login" style={{
            fontSize: 14, fontWeight: 600, color: "#42526e", textDecoration: "none",
            padding: "8px 14px", borderRadius: 10, background: "transparent",
          }}>Log in</Link>
          <Link href="/parent/signup" className="font-display" style={{
            fontSize: 14, fontWeight: 700, color: "#fff", textDecoration: "none",
            padding: "9px 18px", borderRadius: 12, background: "#0052cc",
            boxShadow: "0 2px 8px rgba(0,82,204,0.25)",
            letterSpacing: "-0.01em",
          }}>Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        paddingTop: 108, paddingBottom: 56, paddingLeft: 20, paddingRight: 20,
        maxWidth: 480, margin: "0 auto", textAlign: "center", position: "relative",
      }}>
        {/* Ambient glow */}
        <div style={{
          position: "absolute", top: 60, right: -40, width: 260, height: 260,
          borderRadius: "50%", background: "rgba(0,82,204,0.08)",
          filter: "blur(60px)", pointerEvents: "none", zIndex: 0,
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* AI Insight chip */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 12px", borderRadius: 999,
            background: "#0052cc", marginBottom: 22,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#fff" }}>auto_awesome</span>
            <span className="font-mono" style={{ fontSize: 11, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em" }}>AI Insight</span>
          </div>

          <h1 className="font-display" style={{
            fontSize: 46, fontWeight: 700, color: "#172b4d",
            margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.1,
          }}>
            Screen time costs<br />
            <span style={{ color: "#0052cc" }}>real money.</span>
          </h1>

          <p style={{ fontSize: 16, color: "#42526e", margin: "0 0 32px", lineHeight: 1.65 }}>
            Redefine turns social media into a learning moment. Kids earn screen time by completing real tasks, verified by AI.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/parent/signup" className="font-display" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "16px 0", borderRadius: 12, background: "#0052cc", color: "#fff",
              fontWeight: 700, fontSize: 16, textDecoration: "none", letterSpacing: "-0.01em",
              boxShadow: "0 4px 14px rgba(0,82,204,0.3)",
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>rocket_launch</span>
              Set up free in 2 minutes
            </Link>
            <Link href="/kid/login" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "15px 0", borderRadius: 12,
              border: "1px solid #dfe1e6", background: "#fff",
              color: "#42526e", fontWeight: 600, fontSize: 15, textDecoration: "none",
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>face</span>
              I&apos;m a kid — log in
            </Link>
          </div>
        </div>
      </section>

      {/* Live demo card */}
      <section style={{ padding: "0 20px 40px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{
          background: "#fff", borderRadius: 12, padding: 24,
          border: "1px solid rgba(0,82,204,0.1)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
          position: "relative", overflow: "hidden",
        }}>
          {/* LIVE TRACKING chip */}
          <div style={{
            position: "absolute", top: 16, right: 16,
            display: "flex", alignItems: "center", gap: 5,
            padding: "4px 10px", borderRadius: 999,
            background: "#deebff",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0052cc" }} />
            <span className="font-mono" style={{ fontSize: 10, color: "#0747a6", textTransform: "uppercase", letterSpacing: "0.08em" }}>Live Tracking</span>
          </div>

          <p className="font-mono" style={{ fontSize: 11, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>Live · Jake&apos;s Balance</p>
          <p className="font-display" style={{
            fontSize: 56, fontWeight: 700, color: "#0052cc",
            margin: "0 0 4px", lineHeight: 1, letterSpacing: "-0.03em",
          }}>$7.40</p>
          <p className="font-mono" style={{ fontSize: 12, color: "#42526e", margin: "0 0 20px" }}>draining $0.10/min on TikTok</p>

          {/* Transaction row */}
          <div style={{
            background: "#f4f5f7", borderRadius: 10, padding: "12px 14px",
            display: "flex", gap: 12, alignItems: "center",
            border: "1px solid #dfe1e6",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "#e3fcef", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#36b37e" }}>task_alt</span>
            </div>
            <div style={{ flex: 1 }}>
              <p className="font-display" style={{ fontSize: 14, fontWeight: 600, color: "#172b4d", margin: 0, letterSpacing: "-0.01em" }}>Homework verified by Gemini AI</p>
              <p className="font-mono" style={{ fontSize: 11, color: "#42526e", margin: "2px 0 0" }}>20/20 questions correct</p>
            </div>
            <span className="font-display" style={{ fontSize: 16, fontWeight: 700, color: "#36b37e", flexShrink: 0 }}>+$5.00</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "0 20px 40px", maxWidth: 480, margin: "0 auto" }}>
        <p className="font-mono" style={{ fontSize: 11, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>How it works</p>
        <h2 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: "#172b4d", margin: "0 0 20px", letterSpacing: "-0.02em" }}>Three simple steps</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {steps.map(step => (
            <div key={step.n} style={{
              background: "#fff", borderRadius: 12, padding: 20,
              border: "1px solid rgba(0,82,204,0.1)",
              boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
              display: "flex", gap: 16, alignItems: "flex-start",
            }}>
              <div style={{ flexShrink: 0 }}>
                <p className="font-mono" style={{ fontSize: 10, color: step.color, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{step.n}</p>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: step.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
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

      {/* Features grid */}
      <section style={{ padding: "0 20px 40px", maxWidth: 480, margin: "0 auto" }}>
        <p className="font-mono" style={{ fontSize: 11, color: "#42526e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Features</p>
        <h2 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: "#172b4d", margin: "0 0 20px", letterSpacing: "-0.02em" }}>Everything you need</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {features.map(f => (
            <div key={f.title} style={{
              background: "#fff", borderRadius: 12, padding: 16,
              border: "1px solid rgba(0,82,204,0.1)",
              boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: f.bg,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: f.color }}>{f.icon}</span>
              </div>
              <p className="font-display" style={{ fontSize: 14, fontWeight: 600, color: "#172b4d", margin: "0 0 5px", lineHeight: 1.25, letterSpacing: "-0.01em" }}>{f.title}</p>
              <p style={{ fontSize: 13, color: "#42526e", margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI badge */}
      <section style={{ padding: "0 20px 40px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{
          borderRadius: 12, padding: 20,
          background: "rgba(222,235,255,0.35)",
          border: "1px solid rgba(0,82,204,0.18)",
        }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: "#0052cc",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#fff", fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <div style={{ flex: 1 }}>
              <p className="font-display" style={{ fontSize: 16, fontWeight: 700, color: "#172b4d", margin: "0 0 6px", letterSpacing: "-0.01em" }}>Powered by Gemini + GPT-4o</p>
              <p style={{ fontSize: 14, color: "#42526e", margin: "0 0 14px", lineHeight: 1.55 }}>Homework is graded by Google Gemini. Chores and exercise are verified by OpenAI GPT-4o. Two AIs, zero excuses.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="font-mono" style={{
                  fontSize: 11, padding: "4px 10px", borderRadius: 999,
                  background: "#deebff", color: "#0747a6", fontWeight: 500,
                  textTransform: "uppercase", letterSpacing: "0.05em",
                }}>Google Gemini</span>
                <span className="font-mono" style={{
                  fontSize: 11, padding: "4px 10px", borderRadius: 999,
                  background: "#e3fcef", color: "#006644", fontWeight: 500,
                  textTransform: "uppercase", letterSpacing: "0.05em",
                }}>OpenAI GPT-4o</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 20px 56px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{
          background: "#0052cc", borderRadius: 12, padding: "32px 24px", textAlign: "center",
          boxShadow: "0 8px 32px rgba(0,82,204,0.25)",
          backgroundImage: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, transparent 60%)",
        }}>
          <p className="font-display" style={{
            fontSize: 28, fontWeight: 700, color: "#fff",
            margin: "0 0 10px", lineHeight: 1.25, letterSpacing: "-0.02em",
          }}>Start for free today</p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.72)", margin: "0 0 24px", lineHeight: 1.6 }}>
            No credit card. No app to install. Just a smarter way to parent.
          </p>
          <Link href="/parent/signup" className="font-display" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "16px 0", borderRadius: 12,
            background: "#fff", color: "#0052cc",
            fontWeight: 700, fontSize: 16, textDecoration: "none",
            letterSpacing: "-0.01em",
            boxShadow: "0 4px 14px rgba(0,82,204,0.3)",
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>rocket_launch</span>
            Create free account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #dfe1e6", padding: "24px 20px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <div className="font-display" style={{
            width: 28, height: 28, borderRadius: 10, background: "#0052cc",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 13, letterSpacing: "-0.01em",
          }}>R</div>
          <span className="font-display" style={{ fontWeight: 700, fontSize: 15, color: "#0052cc", letterSpacing: "-0.01em" }}>Redefine</span>
        </div>
        <p className="font-mono" style={{ fontSize: 11, color: "#42526e", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Every minute on social media costs real money.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
          <Link href="/parent/login" style={{ fontSize: 13, color: "#42526e", textDecoration: "none" }}>Parent Login</Link>
          <Link href="/kid/login" style={{ fontSize: 13, color: "#42526e", textDecoration: "none" }}>Kid Login</Link>
          <Link href="/parent/signup" style={{ fontSize: 13, color: "#42526e", textDecoration: "none" }}>Sign Up</Link>
        </div>
      </footer>

    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const HG = { fontFamily: "'Hanken Grotesk', sans-serif" };
const Mono = { fontFamily: "'JetBrains Mono', monospace" };

const apps = ["Instagram", "TikTok", "Snapchat", "YouTube", "Twitter"];

const features = [
  { icon: "auto_awesome",        title: "AI Task Verification",     desc: "Kids submit a photo of their completed task. Gemini and GPT-4o read the image and decide instantly whether the task was genuinely completed. No faking. No loopholes." },
  { icon: "account_balance_wallet", title: "Real-time Balance Drain", desc: "The moment your child opens a social media app, their balance starts dropping in real time. Every second costs money. They can watch it happen — and so can you." },
  { icon: "photo_camera",        title: "Parent Photo Review",       desc: "Every photo your child submits is stored and viewable from your dashboard. You can review, approve, or reject any submission before balance is restored." },
  { icon: "notifications_active", title: "Instant Parent Alerts",    desc: "Get notified the moment your child submits a task that requires your approval. No delays. You stay informed without hovering." },
  { icon: "edit_note",           title: "Custom Tasks",              desc: "Create any task you want — make your bed, walk the dog, read for 20 minutes. Set your own reward amount. Full flexibility for every family." },
  { icon: "tune",                title: "Per-App Rates",             desc: "TikTok costs more than YouTube in your house? That's your call. Set a custom rate per minute for every social media app your child uses." },
  { icon: "bar_chart",           title: "Weekly Reports",            desc: "Every Sunday, get a full breakdown of where your child spent their time and money. See which apps cost the most and which tasks they completed." },
  { icon: "lock",                title: "Auto Lock",                 desc: "When the balance hits zero, social media locks automatically. No manual intervention needed. The system enforces the rules so you don't have to." },
];

function FeatureSlideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActive((prev) => (prev + 1) % features.length), 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="border-y" style={{ backgroundColor: "#f1f3ff", borderColor: "#e1e8ff" }}>
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-wider mb-3" style={{ ...Mono, color: "#737685" }}>Features</p>
          <h2 className="font-black text-4xl sm:text-5xl" style={{ ...HG, color: "#051a3e" }}>
            Everything you need.<br />Nothing you don&apos;t.
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Tabs */}
          <div className="flex flex-col gap-1.5 lg:w-64 flex-shrink-0">
            {features.map((f, i) => (
              <button key={i} onClick={() => setActive(i)}
                className="text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-2.5"
                style={{
                  backgroundColor: active === i ? "#003d9b" : "#ffffff",
                  borderColor: active === i ? "#003d9b" : "#e1e8ff",
                  color: active === i ? "#ffffff" : "#434654",
                  fontWeight: active === i ? 700 : 400,
                }}>
                <span className="material-symbols-outlined text-lg flex-shrink-0" style={{ fontVariationSettings: active === i ? "'FILL' 1" : "'FILL' 0" }}>{f.icon}</span>
                <span className="text-sm">{f.title}</span>
              </button>
            ))}
          </div>

          {/* Active panel */}
          <div className="flex-1 glass-card rounded-2xl p-10 min-h-64 flex flex-col justify-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: "#e9edff" }}>
              <span className="material-symbols-outlined text-3xl" style={{ color: "#003d9b", fontVariationSettings: "'FILL' 1" }}>{features[active].icon}</span>
            </div>
            <h3 className="font-black text-3xl mb-4" style={{ ...HG, color: "#051a3e" }}>{features[active].title}</h3>
            <p className="text-lg leading-relaxed" style={{ color: "#434654" }}>{features[active].desc}</p>
            <div className="flex items-center gap-2 mt-8">
              {features.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} className="rounded-full transition-all"
                  style={{ width: active === i ? 24 : 8, height: 8, backgroundColor: active === i ? "#003d9b" : "#c3c6d6" }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [currentApp, setCurrentApp] = useState(0);
  const [balance, setBalance] = useState(20.00);
  const [ticking, setTicking] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setCurrentApp((prev) => (prev + 1) % apps.length), 2000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!ticking) return;
    const t = setInterval(() => {
      setBalance((prev) => { if (prev <= 0) { setTicking(false); return 0; } return Math.max(0, +(prev - 0.01).toFixed(2)); });
    }, 80);
    return () => clearInterval(t);
  }, [ticking]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#faf9ff", color: "#051a3e" }}>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b" style={{ backgroundColor: "rgba(250,249,255,0.95)", backdropFilter: "blur(20px)", borderColor: "#e1e8ff" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm" style={{ backgroundColor: "#003d9b", color: "#ffffff" }}>R</div>
              <span className="font-black text-base" style={{ ...HG, color: "#003d9b" }}>Redefine</span>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              {["How it works", "Features", "Pricing"].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="text-sm transition hover:opacity-70" style={{ color: "#434654" }}>{item}</a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/parent/login" className="text-sm font-medium" style={{ color: "#434654" }}>Sign in</Link>
            <Link href="/parent/signup" className="text-sm font-black px-5 py-2.5 rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
              style={{ backgroundColor: "#003d9b", color: "#ffffff", ...HG }}>
              Get Started
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="flex flex-col lg:flex-row gap-16 items-center">

          {/* Left copy */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-6"
              style={{ ...Mono, backgroundColor: "#e9edff", borderColor: "#c4d2ff", color: "#003d9b" }}>
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Trusted by 10,000+ families
            </div>

            <h1 className="font-black text-5xl sm:text-6xl leading-tight mb-6" style={{ ...HG, color: "#051a3e" }}>
              The only app that makes
              <br />
              <span style={{ color: "#003d9b" }}>screen time</span>
              <br />
              cost something real.
            </h1>

            <p className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: "#434654" }}>
              Redefine automatically charges kids from their allowance for every minute on social media — and lets them earn it back through real tasks, verified by AI. No arguments. No negotiations.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Link href="/parent/signup"
                className="font-black px-7 py-3.5 rounded-xl transition-all active:scale-95 text-sm flex items-center gap-2"
                style={{ backgroundColor: "#003d9b", color: "#ffffff", ...HG }}>
                Start Free Today
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
              <Link href="/kid/login"
                className="font-bold px-7 py-3.5 rounded-xl border text-sm transition-all"
                style={{ borderColor: "#c3c6d6", color: "#434654" }}>
                I&apos;m a kid
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: "#737685" }}>
              {["Free plan available", "No credit card required", "Setup in 2 mins"].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base" style={{ color: "#006e2a", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Live demo card */}
          <div className="flex-1 w-full max-w-sm">
            <div className="glass-card rounded-2xl overflow-hidden">

              {/* Card header */}
              <div className="px-6 py-5 relative overflow-hidden" style={{ backgroundColor: "#003d9b" }}>
                <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: "#ffffff" }} />
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ ...Mono, color: "rgba(255,255,255,0.5)" }}>Jake&apos;s Balance</p>
                    <p className="font-black text-5xl tabular-nums" style={{ ...HG, color: balance < 5 ? "#ff6b6b" : balance < 10 ? "#ffd166" : "#ffffff" }}>
                      ${balance.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ ...Mono, color: "rgba(255,255,255,0.5)" }}>Budget</p>
                    <p className="font-black text-xl" style={{ ...HG, color: "#ffffff" }}>$20.00</p>
                  </div>
                </div>
                <div className="mt-4 w-full rounded-full h-1.5" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                  <div className="h-1.5 rounded-full transition-all duration-100" style={{
                    width: `${(balance / 20) * 100}%`,
                    backgroundColor: balance < 5 ? "#ff6b6b" : balance < 10 ? "#ffd166" : "#69ff87",
                  }} />
                </div>
              </div>

              {/* Live status */}
              <div className="px-5 py-3 flex items-center justify-between border-b" style={{ borderColor: "#e1e8ff" }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: ticking ? "#ba1a1a" : "#006e2a" }} />
                  <p className="text-sm font-bold" style={{ color: "#051a3e" }}>
                    {ticking ? `Active on ${apps[currentApp]}` : "Social media locked"}
                  </p>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ ...Mono, backgroundColor: ticking ? "#fff0f0" : "#f0fff4", color: ticking ? "#ba1a1a" : "#006e2a" }}>
                  {ticking ? "−$0.10/min" : "Balance empty"}
                </span>
              </div>

              {/* Tasks */}
              <div className="px-5 py-4" style={{ backgroundColor: "#f1f3ff" }}>
                <p className="text-xs uppercase tracking-wider mb-3" style={{ ...Mono, color: "#737685" }}>Tasks to earn back</p>
                {[
                  { name: "Make your bed", reward: "$1.00", done: true, icon: "cleaning_services" },
                  { name: "Do homework",   reward: "$2.00", done: false, icon: "menu_book" },
                  { name: "Take out trash", reward: "$1.50", done: false, icon: "delete" },
                ].map((task, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: "#e1e8ff" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: task.done ? "#003d9b" : "transparent", borderColor: task.done ? "#003d9b" : "#c3c6d6" }}>
                        {task.done && <span className="material-symbols-outlined text-xs text-white" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}>check</span>}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm" style={{ color: task.done ? "#c3c6d6" : "#434654" }}>{task.icon}</span>
                        <span className="text-sm" style={{ color: task.done ? "#c3c6d6" : "#051a3e", textDecoration: task.done ? "line-through" : "none" }}>{task.name}</span>
                      </div>
                    </div>
                    <span className="text-sm font-black" style={{ ...HG, color: task.done ? "#c3c6d6" : "#006e2a" }}>{task.reward}</span>
                  </div>
                ))}
              </div>

              {!ticking && (
                <div className="px-5 py-3 border-t" style={{ borderColor: "#e1e8ff" }}>
                  <button onClick={() => { setBalance(20.00); setTicking(true); }}
                    className="w-full text-sm font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: "#e9edff", color: "#003d9b", ...HG }}>
                    <span className="material-symbols-outlined text-base">refresh</span>
                    Reset Demo
                  </button>
                </div>
              )}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 mt-4 px-2">
              <div className="flex -space-x-2">
                {["#003d9b", "#006e2a", "#6b54a2", "#b45309"].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-black"
                    style={{ backgroundColor: c, borderColor: "#faf9ff", color: "#ffffff", ...HG }}>
                    {["S","M","J","K"][i]}
                  </div>
                ))}
              </div>
              <p className="text-xs" style={{ color: "#737685" }}>
                <span className="font-bold" style={{ color: "#051a3e" }}>2,400+</span> parents joined this week
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y" style={{ backgroundColor: "#003d9b", borderColor: "#0040a2" }}>
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-3 gap-8 text-center">
          {[
            { value: "4.2 hrs", label: "Average teen daily screen time" },
            { value: "73%",     label: "Of kids reduce usage in week 1" },
            { value: "10,000+", label: "Families using Redefine" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="font-black text-3xl mb-1" style={{ ...HG, color: "#69ff87" }}>{stat.value}</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-wider mb-3" style={{ ...Mono, color: "#737685" }}>How it works</p>
          <h2 className="font-black text-4xl sm:text-5xl" style={{ ...HG, color: "#051a3e" }}>
            Simple for parents.<br />Effective for kids.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: "tune",                 step: "01", title: "You set the rules",            color: "#003d9b", bg: "#e9edff", desc: "Choose how much each social media app costs per minute. Set a weekly budget. Full control. Takes less than 2 minutes to get started." },
            { icon: "account_balance_wallet", step: "02", title: "Balance drains automatically", color: "#ba1a1a", bg: "#fff0f0", desc: "Every second on social media costs real money. No alerts, no warnings — just a balance that drops in real time. When it hits zero, social media locks." },
            { icon: "camera_alt",           step: "03", title: "Kids earn it back",            color: "#006e2a", bg: "#f0fff4", desc: "Your child completes tasks you set. They take a photo as proof. AI verifies it instantly. Balance is restored. Responsibility built naturally." },
          ].map((item, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: item.bg }}>
                  <span className="material-symbols-outlined text-2xl" style={{ color: item.color, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                </div>
                <span className="font-black text-3xl" style={{ ...HG, color: "#e1e8ff" }}>{item.step}</span>
              </div>
              <h3 className="font-black text-lg mb-3" style={{ ...HG, color: "#051a3e" }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#434654" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features slideshow */}
      <FeatureSlideshow />

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-wider mb-3" style={{ ...Mono, color: "#737685" }}>Testimonials</p>
          <h2 className="font-black text-4xl sm:text-5xl" style={{ ...HG, color: "#051a3e" }}>Parents love it.</h2>
          <p className="mt-3 text-lg" style={{ color: "#434654" }}>Real families. Real results.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { name: "Sarah M.", role: "Mom of 2", text: "My son went from 6 hours of TikTok a day to 45 minutes. He did it himself once he saw his balance dropping. Best $9.99 I ever spent." },
            { name: "David K.", role: "Dad of 3", text: "The AI task verification is brilliant. My kids can't cheat it. They actually clean their rooms now because they WANT their balance back." },
            { name: "Rachel T.", role: "Mom of 1", text: "I've tried every screen time app. Redefine is the only one that actually works because it's connected to something kids actually care about — money." },
          ].map((review, i) => (
            <div key={i} className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="material-symbols-outlined text-lg" style={{ color: "#b45309", fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#434654" }}>&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center gap-3 border-t pt-4" style={{ borderColor: "#e1e8ff" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs" style={{ backgroundColor: "#e9edff", color: "#003d9b", ...HG }}>
                  {review.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#051a3e" }}>{review.name}</p>
                  <p className="text-xs" style={{ ...Mono, color: "#737685" }}>{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-y" style={{ backgroundColor: "#f1f3ff", borderColor: "#e1e8ff" }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-wider mb-3" style={{ ...Mono, color: "#737685" }}>Pricing</p>
            <h2 className="font-black text-4xl sm:text-5xl" style={{ ...HG, color: "#051a3e" }}>Start free.<br />Upgrade anytime.</h2>
            <p className="mt-3 text-lg" style={{ color: "#434654" }}>No credit card required to get started.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Free */}
            <div className="glass-card rounded-2xl p-8">
              <p className="text-xs uppercase tracking-wider mb-2" style={{ ...Mono, color: "#737685" }}>Free</p>
              <p className="font-black text-5xl mb-1" style={{ ...HG, color: "#051a3e" }}>$0</p>
              <p className="text-sm mb-6" style={{ color: "#737685" }}>Forever free</p>
              <div className="h-px mb-6" style={{ backgroundColor: "#e1e8ff" }} />
              <ul className="flex flex-col gap-3 mb-8">
                {["1 child account", "All core features", "AI task verification", "Weekly reports", "Per-app rate setting"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "#434654" }}>
                    <span className="material-symbols-outlined text-base" style={{ color: "#006e2a", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/parent/signup" className="block text-center font-bold py-3 rounded-xl border text-sm transition-all hover:opacity-80"
                style={{ borderColor: "#c3c6d6", color: "#051a3e" }}>
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-2xl p-8 relative overflow-hidden" style={{ backgroundColor: "#003d9b" }}>
              <div className="absolute top-4 right-4 text-xs font-black px-3 py-1 rounded-full" style={{ ...Mono, backgroundColor: "#69ff87", color: "#003d9b" }}>
                POPULAR
              </div>
              <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full opacity-10" style={{ backgroundColor: "#ffffff" }} />
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-wider mb-2" style={{ ...Mono, color: "rgba(255,255,255,0.5)" }}>Pro</p>
                <p className="font-black text-5xl mb-1" style={{ ...HG, color: "#ffffff" }}>$9.99</p>
                <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>per month · cancel anytime</p>
                <div className="h-px mb-6" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
                <ul className="flex flex-col gap-3 mb-8">
                  {["Up to 5 children", "Everything in Free", "Custom task templates", "Instant parent alerts", "Chrome extension (coming soon)", "Priority support"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
                      <span className="material-symbols-outlined text-base" style={{ color: "#69ff87", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/parent/signup" className="block text-center font-black py-3 rounded-xl text-sm transition-all active:scale-[0.98]"
                  style={{ backgroundColor: "#69ff87", color: "#003d9b", ...HG }}>
                  Start free trial →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ backgroundColor: "#003d9b" }}>
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <p className="text-xs uppercase tracking-wider mb-4" style={{ ...Mono, color: "rgba(255,255,255,0.5)" }}>Get started today</p>
          <h2 className="font-black text-4xl sm:text-5xl mb-4" style={{ ...HG, color: "#ffffff" }}>
            Ready to redefine<br />
            <span style={{ color: "#69ff87" }}>screen time?</span>
          </h2>
          <p className="text-lg mb-10 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
            Join thousands of families who have already taken back control. Free to start. No credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/parent/signup"
              className="font-black px-8 py-4 rounded-xl transition-all active:scale-95 text-sm flex items-center justify-center gap-2"
              style={{ backgroundColor: "#69ff87", color: "#003d9b", ...HG }}>
              Create Free Account
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
            <Link href="/kid/login"
              className="font-bold px-8 py-4 rounded-xl border text-sm transition-all"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}>
              I&apos;m a kid — Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ backgroundColor: "#faf9ff", borderColor: "#e1e8ff" }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs" style={{ backgroundColor: "#003d9b", color: "#ffffff" }}>R</div>
            <span className="font-black text-sm" style={{ ...HG, color: "#003d9b" }}>Redefine</span>
          </div>
          <div className="flex items-center gap-6 text-xs" style={{ color: "#737685" }}>
            {["Privacy Policy", "Terms of Service", "Contact"].map((link) => (
              <a key={link} href="#" className="hover:underline">{link}</a>
            ))}
          </div>
          <span className="text-xs" style={{ ...Mono, color: "#737685" }}>© 2026 Redefine</span>
        </div>
      </footer>
    </main>
  );
}

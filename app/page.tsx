"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const apps = ["Instagram", "TikTok", "Snapchat", "YouTube", "Twitter"];

const features = [
  { title: "AI Task Verification", desc: "Kids submit a photo of their completed task. Our AI reads the image and decides instantly whether the task was genuinely completed. No faking. No loopholes." },
  { title: "Real-time Balance Drain", desc: "The moment your child opens a social media app, their balance starts dropping in real time. Every second costs money. They can watch it happen — and so can you." },
  { title: "Parent Photo Review", desc: "Every photo your child submits is stored and viewable from your dashboard. You can review, approve, or reject any submission before balance is restored." },
  { title: "Instant Parent Alerts", desc: "Get notified the moment your child submits a task that requires your approval. No delays. You stay informed without hovering." },
  { title: "Custom Tasks", desc: "Create any task you want — make your bed, walk the dog, read for 20 minutes. Set your own reward amount. Full flexibility for every family." },
  { title: "Per-App Rates", desc: "TikTok costs more than YouTube in your house? That's your call. Set a custom rate per minute for every social media app your child uses." },
  { title: "Weekly Reports", desc: "Every Sunday, get a full breakdown of where your child spent their time and money. See which apps cost the most and which tasks they completed." },
  { title: "Auto Lock", desc: "When the balance hits zero, social media locks automatically. No manual intervention needed. The system enforces the rules so you don't have to." },
];

function FeatureSlideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % features.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className="relative z-20 border-y" style={{ backgroundColor: "#EBF5EE", borderColor: "#C8D9C8" }}>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black" style={{ color: "#1B4332" }}>Everything you need.<br />Nothing you don't.</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Feature list tabs */}
          <div className="flex flex-col gap-2 lg:w-72 flex-shrink-0">
            {features.map((f, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="text-left px-4 py-3 rounded-xl border transition-all"
                style={{
                  backgroundColor: active === i ? "#1B4332" : "#FFFDF9",
                  borderColor: active === i ? "#1B4332" : "#D1E8D1",
                  color: active === i ? "#FFFDF9" : "#4A6741",
                  fontWeight: active === i ? 700 : 400,
                }}
              >
                <span className="text-sm">{f.title}</span>
                {active === i && (
                  <div className="mt-1 h-0.5 rounded-full" style={{ backgroundColor: "#FF9900" }} />
                )}
              </button>
            ))}
          </div>

          {/* Active feature display */}
          <div className="flex-1 rounded-2xl p-10 border min-h-64 flex flex-col justify-center" style={{ backgroundColor: "#FFFDF9", borderColor: "#D1E8D1" }}>
            <h3 className="text-3xl font-black mb-6" style={{ color: "#1B4332" }}>
              {features[active].title}
            </h3>
            <p className="text-lg leading-relaxed" style={{ color: "#6B7280" }}>
              {features[active].desc}
            </p>

            {/* Progress dots */}
            <div className="flex items-center gap-2 mt-8">
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: active === i ? "24px" : "8px",
                    height: "8px",
                    backgroundColor: active === i ? "#FF9900" : "#D1E8D1",
                  }}
                />
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
    const appInterval = setInterval(() => {
      setCurrentApp((prev) => (prev + 1) % apps.length);
    }, 2000);
    return () => clearInterval(appInterval);
  }, []);

  useEffect(() => {
    if (!ticking) return;
    const moneyInterval = setInterval(() => {
      setBalance((prev) => {
        if (prev <= 0) { setTicking(false); return 0; }
        return Math.max(0, +(prev - 0.01).toFixed(2));
      });
    }, 80);
    return () => clearInterval(moneyInterval);
  }, [ticking]);

  return (
    <main className="min-h-screen font-sans" style={{ backgroundColor: "#F8F4ED", color: "#1A1A2E" }}>

      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-10 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 border-b" style={{ backgroundColor: "#1B4332", borderColor: "#2D6A4F" }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm" style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>R</div>
              <span className="text-lg font-bold" style={{ color: "#FFFDF9" }}>Redefine</span>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              {["How it works", "Features", "Pricing", "For Parents"].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="text-sm transition" style={{ color: "#A7C4B5" }}>{item}</a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/parent/login" className="text-sm font-medium transition" style={{ color: "#A7C4B5" }}>Sign in</Link>
            <Link href="/parent/signup" className="text-sm font-bold px-5 py-2 rounded-lg transition hover:opacity-90" style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>
              Get Started →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="flex flex-col lg:flex-row gap-12 items-center">

          {/* Left */}
          <div className="flex-1">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mb-6" style={{ backgroundColor: "#EBF5EE", borderColor: "#52B788", color: "#1B4332" }}>
              ★★★★★ &nbsp; Trusted by 10,000+ families
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-5" style={{ color: "#1B4332" }}>
              The only app that makes
              <br />
              <span style={{ color: "#FF9900" }}>screen time cost</span>
              <br />
              something real.
            </h1>

            <p className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: "#4A6741" }}>
              Redefine automatically charges kids from their allowance for every minute on social media — and lets them earn it back through real tasks, verified by AI. No arguments. No negotiations.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Link href="/parent/signup" className="font-bold px-7 py-3.5 rounded-lg transition hover:opacity-90 text-sm" style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>
                Start Free Today →
              </Link>
              <Link href="/parent/login" className="font-semibold px-7 py-3.5 rounded-lg border transition text-sm" style={{ borderColor: "#C8B89A", color: "#4A6741", backgroundColor: "transparent" }}>
                Sign in
              </Link>
            </div>

            <div className="flex items-center gap-4 text-sm" style={{ color: "#6B7280" }}>
              <span>✓ Free plan available</span>
              <span style={{ color: "#C8B89A" }}>|</span>
              <span>✓ No credit card required</span>
              <span style={{ color: "#C8B89A" }}>|</span>
              <span>✓ Setup in 2 mins</span>
            </div>
          </div>

          {/* Right — Live Demo Card */}
          <div className="flex-1 w-full max-w-md">
            <div className="rounded-2xl overflow-hidden shadow-2xl border" style={{ borderColor: "#C8B89A", backgroundColor: "#FFFDF9" }}>

              {/* Card header */}
              <div className="px-6 py-5 flex justify-between items-start" style={{ backgroundColor: "#1B4332" }}>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: "#52B788" }}>Jake's Balance</p>
                  <p className="text-5xl font-black tabular-nums" style={{
                    color: balance < 5 ? "#FF6B6B" : balance < 10 ? "#FF9900" : "#FFFDF9"
                  }}>
                    ${balance.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: "#52B788" }}>Weekly Budget</p>
                  <p className="text-xl font-bold" style={{ color: "#FFFDF9" }}>$20.00</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="px-6 py-4" style={{ backgroundColor: "#FFFDF9" }}>
                <div className="flex justify-between text-xs mb-2" style={{ color: "#6B7280" }}>
                  <span>Balance remaining</span>
                  <span className="font-bold" style={{ color: balance < 5 ? "#FF6B6B" : balance < 10 ? "#FF9900" : "#1B4332" }}>
                    {Math.round((balance / 20) * 100)}%
                  </span>
                </div>
                <div className="w-full rounded-full h-2.5" style={{ backgroundColor: "#E5E7EB" }}>
                  <div
                    className="h-2.5 rounded-full transition-all duration-100"
                    style={{
                      width: `${(balance / 20) * 100}%`,
                      backgroundColor: balance < 5 ? "#EF5350" : balance < 10 ? "#FF9900" : "#52B788"
                    }}
                  />
                </div>
              </div>

              {/* Live status */}
              <div className="px-6 py-3 flex items-center justify-between border-t border-b" style={{ borderColor: "#E5E7EB" }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: ticking ? "#EF5350" : "#52B788" }} />
                  <p className="text-sm font-semibold" style={{ color: "#1B4332" }}>
                    {ticking ? `Active on ${apps[currentApp]}` : "🔒 Social media locked"}
                  </p>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: ticking ? "#FFF0F0" : "#EBF5EE", color: ticking ? "#EF5350" : "#2D6A4F" }}>
                  {ticking ? `−$0.10/min` : "Balance empty"}
                </span>
              </div>

              {/* Tasks */}
              <div className="px-6 py-4" style={{ backgroundColor: "#F8F4ED" }}>
                <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#6B7280" }}>
                  Tasks to earn back
                </p>
                {[
                  { name: "Make your bed", reward: "$1.00", done: true, icon: "🧹" },
                  { name: "Do homework", reward: "$2.00", done: false, icon: "📚" },
                  { name: "Take out trash", reward: "$1.50", done: false, icon: "🗑️" },
                ].map((task, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: "#E5E7EB" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                        style={{ backgroundColor: task.done ? "#2D6A4F" : "transparent", borderColor: task.done ? "#2D6A4F" : "#C8B89A" }}>
                        {task.done && <span className="text-xs font-bold" style={{ color: "#FFFDF9" }}>✓</span>}
                      </div>
                      <span className="text-sm" style={{ color: task.done ? "#9CA3AF" : "#1B4332", textDecoration: task.done ? "line-through" : "none" }}>
                        {task.icon} {task.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: task.done ? "#9CA3AF" : "#2D6A4F" }}>{task.reward}</span>
                  </div>
                ))}
              </div>

              {!ticking && (
                <div className="px-6 py-3 border-t" style={{ borderColor: "#E5E7EB" }}>
                  <button
                    onClick={() => { setBalance(20.00); setTicking(true); }}
                    className="w-full text-xs font-bold py-2 rounded-lg transition hover:opacity-90"
                    style={{ backgroundColor: "#FF9900", color: "#1B4332" }}
                  >
                    Reset Demo ↺
                  </button>
                </div>
              )}
            </div>

            {/* Social proof under card */}
            <div className="flex items-center gap-4 mt-4 px-2">
              <div className="flex -space-x-2">
                {["#2D6A4F", "#52B788", "#FF9900", "#1B4332"].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: c, borderColor: "#F8F4ED", color: "#FFFDF9" }}>
                    {["S", "M", "J", "K"][i]}
                  </div>
                ))}
              </div>
              <p className="text-xs" style={{ color: "#6B7280" }}>
                <span className="font-bold" style={{ color: "#1B4332" }}>2,400+</span> parents joined this week
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative z-20 border-y" style={{ backgroundColor: "#1B4332", borderColor: "#2D6A4F" }}>
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-3 gap-8 text-center">
          {[
            { value: "4.2 hrs", label: "Average teen daily screen time" },
            { value: "73%", label: "Of kids reduce usage in week 1" },
            { value: "10,000+", label: "Families using Redefine" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-3xl font-black mb-1" style={{ color: "#FF9900" }}>{stat.value}</p>
              <p className="text-sm" style={{ color: "#A7C4B5" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-20 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black" style={{ color: "#1B4332" }}>Simple for parents.<br />Effective for kids.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: "You set the rules", desc: "Choose how much each social media app costs per minute. Set a weekly budget for your child. You're fully in control of every setting, every rate, and every task. Takes less than 2 minutes to get started." },
            { title: "Balance drains automatically", desc: "Every second your child spends on social media costs real money from their weekly allowance. There are no alerts, no warnings — just a balance that drops in real time. When it hits zero, social media locks. No arguments needed." },
            { title: "Kids earn it back", desc: "Your child completes tasks you set — chores, homework, exercise. They take a photo as proof. AI verifies it instantly. Balance is restored. Responsibility is built naturally, without conflict or negotiation." },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl p-8 border hover:shadow-lg transition-shadow" style={{ backgroundColor: "#FFFDF9", borderColor: "#E5E7EB" }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: "#1B4332" }}>{item.title}</h3>
              <p className="text-base leading-relaxed" style={{ color: "#6B7280" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Slideshow */}
      <FeatureSlideshow />

      {/* Testimonials */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black" style={{ color: "#1B4332" }}>Parents love it.</h2>
          <p className="mt-4 text-lg" style={{ color: "#6B7280" }}>Real families. Real results.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { name: "Sarah M.", role: "Mom of 2", stars: 5, text: "My son went from 6 hours of TikTok a day to 45 minutes. He did it himself once he saw his balance dropping. Best $9.99 I ever spent." },
            { name: "David K.", role: "Dad of 3", stars: 5, text: "The AI task verification is brilliant. My kids can't cheat it. They actually clean their rooms now because they WANT their balance back." },
            { name: "Rachel T.", role: "Mom of 1", stars: 5, text: "I've tried every screen time app. Redefine is the only one that actually works because it's connected to something kids actually care about — money." },
          ].map((review, i) => (
            <div key={i} className="rounded-2xl p-6 border" style={{ backgroundColor: "#FFFDF9", borderColor: "#E5E7EB" }}>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(review.stars)].map((_, j) => (
                  <span key={j} style={{ color: "#FF9900" }}>★</span>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#4A6741" }}>"{review.text}"</p>
              <div>
                <p className="text-sm font-bold" style={{ color: "#1B4332" }}>{review.name}</p>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-20 border-y" style={{ backgroundColor: "#F0EBE0", borderColor: "#C8B89A" }}>
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black" style={{ color: "#1B4332" }}>Start free.<br />Upgrade anytime.</h2>
            <p className="mt-4 text-lg" style={{ color: "#6B7280" }}>No credit card required to get started.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">

            {/* Free */}
            <div className="rounded-2xl p-8 border" style={{ backgroundColor: "#FFFDF9", borderColor: "#E5E7EB" }}>
              <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#6B7280" }}>Free</p>
              <p className="text-5xl font-black mb-1" style={{ color: "#1B4332" }}>$0</p>
              <p className="text-sm mb-6" style={{ color: "#9CA3AF" }}>Forever free</p>
              <div className="h-px mb-6" style={{ backgroundColor: "#E5E7EB" }} />
              <ul className="flex flex-col gap-3 mb-8">
                {[
                  "1 child account",
                  "All core features",
                  "AI task verification",
                  "Weekly reports",
                  "Per-app rate setting",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "#4A6741" }}>
                    <span className="font-bold" style={{ color: "#52B788" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/parent/signup" className="block text-center font-bold py-3 rounded-lg border transition text-sm hover:opacity-80" style={{ borderColor: "#C8B89A", color: "#1B4332" }}>
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-2xl p-8 relative overflow-hidden border-2" style={{ backgroundColor: "#1B4332", borderColor: "#FF9900" }}>
              <div className="absolute top-4 right-4 text-xs font-black px-3 py-1 rounded-full" style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>
                MOST POPULAR
              </div>
              <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#52B788" }}>Pro</p>
              <p className="text-5xl font-black mb-1" style={{ color: "#FFFDF9" }}>$9.99</p>
              <p className="text-sm mb-6" style={{ color: "#A7C4B5" }}>per month · cancel anytime</p>
              <div className="h-px mb-6" style={{ backgroundColor: "#2D6A4F" }} />
              <ul className="flex flex-col gap-3 mb-8">
                {[
                  "Up to 5 children",
                  "Everything in Free",
                  "Custom task templates",
                  "Instant parent alerts",
                  "Chrome extension (coming soon)",
                  "Priority support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "#C8E8C8" }}>
                    <span className="font-bold" style={{ color: "#FF9900" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/parent/signup" className="block text-center font-black py-3 rounded-lg transition text-sm hover:opacity-90" style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>
                Start free trial →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-20" style={{ backgroundColor: "#1B4332" }}>
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: "#FFFDF9" }}>
            Ready to redefine
            <br />
            <span style={{ color: "#FF9900" }}>screen time?</span>
          </h2>
          <p className="text-lg mb-10 max-w-md mx-auto" style={{ color: "#A7C4B5" }}>
            Join thousands of families who have already taken back control. Free to start. No credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/parent/signup" className="font-black px-8 py-4 rounded-lg transition hover:opacity-90 text-sm" style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>
              Create Free Account →
            </Link>
            <Link href="/kid/login" className="font-semibold px-8 py-4 rounded-lg border transition text-sm" style={{ borderColor: "#2D6A4F", color: "#A7C4B5" }}>
              I'm a kid — Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t" style={{ backgroundColor: "#F8F4ED", borderColor: "#D4C9B0" }}>
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs" style={{ backgroundColor: "#1B4332", color: "#F8F4ED" }}>R</div>
            <span className="font-bold" style={{ color: "#1B4332" }}>Redefine</span>
          </div>
          <div className="flex items-center gap-6 text-xs" style={{ color: "#9CA3AF" }}>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
          <span className="text-xs" style={{ color: "#9CA3AF" }}>© 2026 Redefine. All rights reserved.</span>
        </div>
      </footer>

    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const stats = [
  { value: "4.2hrs", label: "Average teen screen time daily" },
  { value: "$0.70", label: "Cost per hour with Redefine" },
  { value: "73%", label: "Of teens reduce usage in week 1" },
];

const apps = ["Instagram", "TikTok", "Snapchat", "YouTube", "Twitter", "Reddit"];

export default function Home() {
  const [currentApp, setCurrentApp] = useState(0);
  const [balance, setBalance] = useState(20.00);
  const [ticking, setTicking] = useState(true);

  useEffect(() => {
    const appInterval = setInterval(() => {
      setCurrentApp((prev) => (prev + 1) % apps.length);
    }, 1500);
    return () => clearInterval(appInterval);
  }, []);

  useEffect(() => {
    if (!ticking) return;
    const moneyInterval = setInterval(() => {
      setBalance((prev) => {
        if (prev <= 0) { setTicking(false); return 0; }
        return Math.max(0, prev - 0.01);
      });
    }, 100);
    return () => clearInterval(moneyInterval);
  }, [ticking]);

  return (
    <main className="min-h-screen bg-[#050508] text-white overflow-hidden">

      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-purple-700 opacity-20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-pink-700 opacity-20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-blue-700 opacity-10 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-black tracking-tight">
          Re<span className="text-purple-400">define</span>
        </h1>
        <div className="flex gap-4">
          <Link href="/parent/signup" className="text-gray-400 hover:text-white transition text-sm font-medium">
            For Parents
          </Link>
          <Link href="/kid/login" className="bg-purple-600 hover:bg-purple-500 transition text-white text-sm font-semibold px-4 py-2 rounded-lg">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-16 pb-24">

        {/* Live demo pill */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-gray-300">Live demo — watch the balance drop</span>
        </div>

        {/* Main heading */}
        <h2 className="text-6xl sm:text-8xl font-black tracking-tight leading-none mb-6">
          Every scroll
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            has a price.
          </span>
        </h2>

        <p className="text-gray-400 text-xl max-w-xl mb-12">
          Redefine charges kids real money for every minute on social media — and lets them earn it back through real-world tasks.
        </p>

        {/* Live balance demo */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 mb-12 w-full max-w-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-gray-400 text-sm">Currently on</span>
            </div>
            <span className="text-purple-400 font-bold text-sm">{apps[currentApp]}</span>
          </div>

          <p className="text-gray-500 text-sm mb-1">Jake's balance</p>
          <p className={`text-6xl font-black mb-2 transition-all ${balance < 5 ? "text-red-400" : balance < 10 ? "text-yellow-400" : "text-white"}`}>
            ${balance.toFixed(2)}
          </p>
          <p className="text-gray-500 text-xs">
            {ticking ? "💸 $0.10 per minute draining..." : "🔒 Balance empty — social media locked"}
          </p>

          {!ticking && (
            <button
              onClick={() => { setBalance(20.00); setTicking(true); }}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-500 transition text-white font-bold py-2 rounded-xl text-sm"
            >
              Complete a task to unlock →
            </button>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/parent/signup" className="bg-white text-black px-8 py-4 rounded-xl text-lg font-black hover:bg-gray-200 transition">
            I'm a Parent — Get Started
          </Link>
          <Link href="/kid/login" className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white/20 transition backdrop-blur-sm">
            I'm a Kid
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 border-t border-white/10 py-12 px-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <p className="text-4xl font-black text-purple-400 mb-1">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-10 py-20 max-w-5xl mx-auto">
        <h3 className="text-4xl font-black text-center mb-12">
          How it <span className="text-purple-400">works</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { emoji: "⚙️", title: "Parent sets the rules", desc: "Set a rate per app — $0.10/min on TikTok, $0.05/min on Instagram. You're in control." },
            { emoji: "💸", title: "Balance drops in real time", desc: "Every second your kid scrolls, their balance drops. When it hits zero — social media locks automatically." },
            { emoji: "💪", title: "Earn it back for real", desc: "Complete tasks like chores or homework. AI verifies a photo of the completed task. Balance restored instantly." },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition backdrop-blur-sm">
              <p className="text-4xl mb-4">{item.emoji}</p>
              <h4 className="text-lg font-bold mb-2">{item.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 text-center py-20 px-10">
        <h3 className="text-5xl font-black mb-4">Ready to <span className="text-purple-400">Redefine</span> screen time?</h3>
        <p className="text-gray-400 mb-8">Join thousands of parents taking back control.</p>
        <Link href="/parent/signup" className="bg-purple-600 hover:bg-purple-500 transition text-white px-10 py-4 rounded-xl text-xl font-black">
          Start Free Today →
        </Link>
      </section>

    </main>
  );
}
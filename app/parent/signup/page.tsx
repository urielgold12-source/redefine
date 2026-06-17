"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function ParentSignup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    kidName: "",
    weeklyBudget: "20",
    screenTimeCost: "0.10",
  });
  const [error, setError] = useState("");

  function updateForm(key: string, val: string) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setStep(2);
  }

  function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    if (!form.kidName) {
      setError("Enter your child's name.");
      return;
    }
    setError("");
    setStep(3);
  }

  return (
    <main className="bg-background min-h-dvh flex flex-col">
      <header className="h-16 flex items-center justify-between px-5">
        <Logo />
        <Link href="/parent/login" className="text-sm text-primary font-bold no-underline">
          Log in
        </Link>
      </header>

      <div className="flex-1 flex flex-col justify-center px-6 pb-12">
        <div className="max-w-sm mx-auto w-full">

          {/* Step progress bar */}
          <div className="flex gap-1.5 mb-7">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
                  s <= step ? "bg-primary" : "bg-outline"
                }`}
              />
            ))}
          </div>

          {/* ── Step 1: Account ── */}
          {step === 1 && (
            <>
              <div className="w-16 h-16 rounded-[20px] bg-primary flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[32px] text-white icon-fill">person_add</span>
              </div>
              <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">Step 1 of 3</p>
              <h1 className="font-display text-[34px] font-black text-on-surface tracking-tight leading-[1.1] mb-2">
                Create your account
              </h1>
              <p className="text-[15px] text-on-variant mb-7">Free forever. No credit card needed.</p>

              <form onSubmit={handleStep1} className="flex flex-col gap-3.5">
                <div>
                  <label className="font-mono text-[11px] text-muted uppercase tracking-widest block mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full px-4 py-3.5 rounded-[14px] border-[1.5px] border-outline text-base text-on-surface bg-surface outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] text-muted uppercase tracking-widest block mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-3.5 rounded-[14px] border-[1.5px] border-outline text-base text-on-surface bg-surface outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] text-muted uppercase tracking-widest block mb-1.5">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => updateForm("password", e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full px-4 py-3.5 rounded-[14px] border-[1.5px] border-outline text-base text-on-surface bg-surface outline-none"
                  />
                </div>
                {error && <p className="text-[13px] text-error">{error}</p>}
                <button
                  type="submit"
                  className="font-display w-full py-4 rounded-2xl border-none bg-primary text-white text-base font-black cursor-pointer mt-1"
                >
                  Continue
                </button>
              </form>
            </>
          )}

          {/* ── Step 2: Child ── */}
          {step === 2 && (
            <>
              <div className="w-16 h-16 rounded-[20px] bg-secondary flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[32px] text-white icon-fill">child_care</span>
              </div>
              <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">Step 2 of 3</p>
              <h1 className="font-display text-[34px] font-black text-on-surface tracking-tight leading-[1.1] mb-2">
                Set up your child
              </h1>
              <p className="text-[15px] text-on-variant mb-7">You can add more children later.</p>

              <form onSubmit={handleStep2} className="flex flex-col gap-3.5">
                <div>
                  <label className="font-mono text-[11px] text-muted uppercase tracking-widest block mb-1.5">
                    Child&apos;s Name
                  </label>
                  <input
                    type="text"
                    value={form.kidName}
                    onChange={(e) => updateForm("kidName", e.target.value)}
                    placeholder="e.g. Jake"
                    className="w-full px-4 py-3.5 rounded-[14px] border-[1.5px] border-outline text-base text-on-surface bg-surface outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] text-muted uppercase tracking-widest block mb-1.5">
                    Weekly Budget ($)
                  </label>
                  <input
                    type="number"
                    value={form.weeklyBudget}
                    onChange={(e) => updateForm("weeklyBudget", e.target.value)}
                    min="1"
                    max="500"
                    className="w-full px-4 py-3.5 rounded-[14px] border-[1.5px] border-outline text-base text-on-surface bg-surface outline-none"
                  />
                  <p className="text-xs text-muted mt-1.5">This resets every Monday. They earn it back with tasks.</p>
                </div>
                {error && <p className="text-[13px] text-error">{error}</p>}
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-2xl border border-outline bg-surface text-on-variant font-bold text-base cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="font-display flex-[2] py-4 rounded-2xl border-none bg-primary text-white text-base font-black cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ── Step 3: Screen time cost ── */}
          {step === 3 && (
            <>
              <div className="w-16 h-16 rounded-[20px] bg-tertiary flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[32px] text-white icon-fill">phone_iphone</span>
              </div>
              <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">Step 3 of 3</p>
              <h1 className="font-display text-[34px] font-black text-on-surface tracking-tight leading-[1.1] mb-2">
                Set the screen time cost
              </h1>
              <p className="text-[15px] text-on-variant mb-7">
                Every minute on social media drains the balance by this amount.
              </p>

              <div className="flex flex-col gap-3.5 mb-6">
                {[
                  { label: "Gentle",   value: "0.05", desc: "$0.05/min — soft limit" },
                  { label: "Standard", value: "0.10", desc: "$0.10/min — recommended" },
                  { label: "Strict",   value: "0.25", desc: "$0.25/min — strict household" },
                ].map((opt) => {
                  const selected = form.screenTimeCost === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => updateForm("screenTimeCost", opt.value)}
                      className={`glass-card px-4 py-4 rounded-[14px] text-left cursor-pointer flex justify-between items-center transition-colors ${
                        selected ? "border-[2px] border-primary bg-primary-container" : "border border-outline"
                      }`}
                    >
                      <div>
                        <p className="font-display text-base font-black text-on-surface m-0">{opt.label}</p>
                        <p className="font-mono text-xs text-on-variant m-0 mt-1">{opt.desc}</p>
                      </div>
                      {selected && (
                        <span className="material-symbols-outlined text-[22px] text-primary icon-fill">check_circle</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 rounded-2xl border border-outline bg-surface text-on-variant font-bold text-base cursor-pointer"
                >
                  Back
                </button>
                <Link
                  href="/parent/dashboard"
                  className="font-display flex-[2] py-4 rounded-2xl border-none bg-primary text-white text-base font-black cursor-pointer no-underline flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">rocket_launch</span>
                  <span>Finish Setup</span>
                </Link>
              </div>
            </>
          )}

          <p className="mt-7 text-center text-[13px] text-muted">
            Already have an account?{" "}
            <Link href="/parent/login" className="text-primary font-bold no-underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

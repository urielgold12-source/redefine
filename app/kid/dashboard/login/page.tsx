"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function KidLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", pin: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!form.username || !form.pin) {
      setError("Please enter your username and PIN.");
      return;
    }
    setLoading(true);
    setError("");

    // Simulate login for now
    setTimeout(() => {
      if (form.username === "jake" && form.pin === "1234") {
        router.push("/kid/dashboard");
      } else {
        setError("Wrong username or PIN. Ask your parent for help.");
        setLoading(false);
      }
    }, 1000);
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white flex flex-col items-center justify-center p-6">

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-cyan-700 opacity-20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-700 opacity-20 rounded-full blur-[120px]" />
      </div>

      {/* Logo */}
      <Link href="/" className="text-2xl font-black tracking-tight mb-3">
        Re<span className="text-cyan-400">define</span>
      </Link>
      <p className="text-gray-400 text-sm mb-10">Kid login</p>

      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
        <h2 className="text-3xl font-black mb-1">Hey! 👋</h2>
        <p className="text-gray-400 text-sm mb-8">Log in to see your balance and tasks.</p>

        <div className="flex flex-col gap-4">

          {/* Username */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Your username</label>
            <input
              type="text"
              placeholder="e.g. jake"
              value={form.username}
              onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* PIN */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Your PIN</label>
            <input
              type="password"
              placeholder="4-digit PIN"
              maxLength={4}
              value={form.pin}
              onChange={(e) => setForm((prev) => ({ ...prev, pin: e.target.value }))}
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition text-center text-2xl tracking-widest"
            />
          </div>

          {/* PIN pad */}
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[1,2,3,4,5,6,7,8,9,"⌫",0,"✓"].map((key) => (
              <button
                key={key}
                onClick={() => {
                  if (key === "⌫") {
                    setForm((prev) => ({ ...prev, pin: prev.pin.slice(0, -1) }));
                  } else if (key === "✓") {
                    handleLogin();
                  } else {
                    if (form.pin.length < 4) {
                      setForm((prev) => ({ ...prev, pin: prev.pin + key }));
                    }
                  }
                }}
                className={`py-4 rounded-xl text-lg font-bold transition ${
                  key === "✓"
                    ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                    : key === "⌫"
                    ? "bg-white/10 hover:bg-white/20 text-gray-400"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-center">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={loading || !form.username || form.pin.length < 4}
            className="w-full bg-cyan-600 hover:bg-cyan-500 transition text-white font-black py-4 rounded-xl text-lg disabled:opacity-40 mt-2"
          >
            {loading ? "Logging in..." : "Log In →"}
          </button>

        </div>
      </div>

      <p className="text-gray-600 text-xs mt-6">
        Don't know your PIN? Ask your parent.
      </p>

      <Link href="/parent/login" className="text-cyan-400 text-sm mt-3 hover:underline">
        I'm a parent →
      </Link>

    </main>
  );
}
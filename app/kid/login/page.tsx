"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function KidLogin() {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (username === "jake" && pin === "1234") {
      router.push("/kid/dashboard");
    } else {
      setError("Wrong username or PIN. Try: jake / 1234");
    }
  }

  return (
    <main style={{ backgroundColor: "#faf9ff", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <header style={{ height: 64, display: "flex", alignItems: "center", padding: "0 20px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div className="font-display" style={{ width: 32, height: 32, borderRadius: 10, background: "#0052cc", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14 }}>R</div>
          <span className="font-display" style={{ fontWeight: 800, fontSize: 16, color: "#0052cc" }}>Redefine</span>
        </Link>
      </header>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px 48px" }}>
        <div style={{ maxWidth: 400, margin: "0 auto", width: "100%" }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: "#0052cc", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: "#fff", fontVariationSettings: "'FILL' 1" }}>face</span>
          </div>

          <p className="font-mono" style={{ fontSize: 11, color: "#737685", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>Kid Portal</p>
          <h1 className="font-display" style={{ fontSize: 38, fontWeight: 900, color: "#051a3e", margin: "0 0 8px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>Welcome back!</h1>
          <p style={{ fontSize: 15, color: "#434654", margin: "0 0 32px" }}>Log in to see your tasks and balance.</p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label className="font-mono" style={{ fontSize: 11, color: "#737685", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. jake" autoCapitalize="none"
                style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "1.5px solid #e1e8ff", fontSize: 16, color: "#051a3e", background: "#fff", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label className="font-mono" style={{ fontSize: 11, color: "#737685", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>PIN</label>
              <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="Your 4-digit PIN" maxLength={6} inputMode="numeric"
                style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "1.5px solid #e1e8ff", fontSize: 16, color: "#051a3e", background: "#fff", outline: "none", boxSizing: "border-box" }} />
            </div>

            {error && (
              <div style={{ background: "#fff0f0", border: "1px solid #ffcdd2", borderRadius: 12, padding: "12px 14px", display: "flex", gap: 8, alignItems: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#ba1a1a" }}>error</span>
                <p style={{ fontSize: 13, color: "#ba1a1a", margin: 0 }}>{error}</p>
              </div>
            )}

            <button type="submit" className="font-display" style={{ width: "100%", padding: "16px 0", borderRadius: 16, border: "none", background: "#0052cc", color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer", marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>login</span>
              Log In
            </button>
          </form>

          <div style={{ marginTop: 24, padding: "14px 16px", borderRadius: 14, background: "#f1f3ff", border: "1px solid #e1e8ff" }}>
            <p className="font-mono" style={{ fontSize: 11, color: "#737685", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Demo credentials</p>
            <p style={{ fontSize: 14, color: "#434654", margin: 0 }}>Username: <strong>jake</strong> · PIN: <strong>1234</strong></p>
          </div>

          <p style={{ marginTop: 24, textAlign: "center", fontSize: 14, color: "#737685" }}>
            Are you a parent?{" "}
            <Link href="/parent/login" style={{ color: "#0052cc", fontWeight: 700, textDecoration: "none" }}>Log in here</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

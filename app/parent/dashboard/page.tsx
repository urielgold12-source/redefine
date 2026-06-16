"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const KID_ID = "3773eeac-6e2c-4d2f-8521-5ba7f16629cf";

const APP_LOGOS: Record<string, { bg: string; svg: string }> = {
  "TikTok": { bg: "#000000", svg: `<svg viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.15 8.15 0 0 0 4.77 1.52V6.77a4.85 4.85 0 0 1-1-.08z"/></svg>` },
  "Instagram": { bg: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", svg: `<svg viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>` },
  "Snapchat": { bg: "#FFFC00", svg: `<svg viewBox="0 0 40 40"><text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-size="16" font-weight="900" font-family="Arial" fill="#000">SC</text></svg>` },
  "YouTube": { bg: "#FF0000", svg: `<svg viewBox="0 0 24 24" fill="white"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>` },
  "Twitter/X": { bg: "#000000", svg: `<svg viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>` },
  "Reddit": { bg: "#FF4500", svg: `<svg viewBox="0 0 24 24" fill="white"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>` },
  "Facebook": { bg: "#1877F2", svg: `<svg viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>` },
};

function AppLogo({ app, size = 10 }: { app: string; size?: number }) {
  const logo = APP_LOGOS[app];
  const px = size * 4;
  if (!logo) return (
    <div className="rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0" style={{ width: px, height: px, backgroundColor: "#e9edff", color: "#003d9b", fontFamily: "'Hanken Grotesk', sans-serif" }}>
      {app.slice(0, 2).toUpperCase()}
    </div>
  );
  return (
    <div className="rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ width: px, height: px, background: logo.bg }}>
      <div style={{ width: 22, height: 22 }} dangerouslySetInnerHTML={{ __html: logo.svg }} />
    </div>
  );
}

type Task = { id: string; title: string; reward: number; status: string; task_type: string; ai_verdict: string; fail_count: number; photo_url: string; requires_parent_approval: boolean; };

const recentActivity = [
  { app: "TikTok", duration: "23 mins", cost: "$2.30", time: "2 mins ago" },
  { app: "Instagram", duration: "15 mins", cost: "$1.20", time: "1 hour ago" },
  { app: "YouTube", duration: "45 mins", cost: "$2.25", time: "3 hours ago" },
  { app: "Snapchat", duration: "10 mins", cost: "$0.80", time: "5 hours ago" },
];

const HG = { fontFamily: "'Hanken Grotesk', sans-serif" };
const Mono = { fontFamily: "'JetBrains Mono', monospace" };

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "settings">("overview");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [balance, setBalance] = useState(20.00);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", reward: "", task_type: "chore", requires_parent_approval: false });
  const [appRates, setAppRates] = useState([
    { app: "TikTok", rate: "0.10" }, { app: "Instagram", rate: "0.08" },
    { app: "Snapchat", rate: "0.08" }, { app: "YouTube", rate: "0.05" }, { app: "Twitter/X", rate: "0.05" },
  ]);
  const [newApp, setNewApp] = useState({ app: "", rate: "0.05" });
  const [showAddApp, setShowAddApp] = useState(false);
  const [ratesSaved, setRatesSaved] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const res = await fetch(`/api/tasks?kidId=${KID_ID}`);
    const data = await res.json(); setTasks(data);
    const kidRes = await fetch(`/api/kid?kidId=${KID_ID}`);
    if (kidRes.ok) { const kidData = await kidRes.json(); setBalance(kidData.balance); }
  }

  async function approveTask(taskId: string) {
    await fetch("/api/tasks", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ taskId, status: "approved", kidId: KID_ID, reward: tasks.find(t => t.id === taskId)?.reward }) });
    setSelectedTask(null); loadData();
  }

  async function deleteTask(taskId: string) {
    await fetch("/api/tasks", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ taskId }) });
    loadData();
  }

  async function rejectTask(taskId: string) {
    await fetch("/api/tasks", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ taskId, status: "active" }) });
    setSelectedTask(null); loadData();
  }

  async function addTask() {
    if (!newTask.title || !newTask.reward) return;
    const res = await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kid_id: KID_ID, title: newTask.title, description: newTask.description, reward: parseFloat(newTask.reward), task_type: newTask.task_type, requires_parent_approval: newTask.requires_parent_approval }) });
    if (res.ok) { setShowAddTask(false); setNewTask({ title: "", description: "", reward: "", task_type: "chore", requires_parent_approval: false }); loadData(); }
  }

  async function saveRates() {
    for (const rate of appRates) {
      await fetch("/api/rates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kid_id: KID_ID, app_name: rate.app, rate_per_minute: parseFloat(rate.rate) }) });
    }
    setRatesSaved(true); setTimeout(() => setRatesSaved(false), 2000);
  }

  const cappedBalance = Math.min(balance, 20);
  const topApp = [...appRates].sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate))[0];
  const pendingCount = tasks.filter(t => t.status === "pending_review").length;

  const tabs = [
    { key: "overview", icon: "dashboard", label: "Overview" },
    { key: "tasks",    icon: "task_alt",  label: "Tasks" },
    { key: "settings", icon: "tune",      label: "Settings" },
  ] as const;

  return (
    <main className="min-h-screen pb-24" style={{ backgroundColor: "#faf9ff" }}>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-xl" style={{ ...HG, color: "#051a3e" }}>Add New Task</h2>
              <button onClick={() => setShowAddTask(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#f1f3ff" }}>
                <span className="material-symbols-outlined text-base" style={{ color: "#434654" }}>close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <input type="text" placeholder="Task title (e.g. Clean your room)"
                value={newTask.title} onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                style={{ borderColor: "#c3c6d6", backgroundColor: "#ffffff", color: "#051a3e" }} />
              <input type="text" placeholder="Description (e.g. Take a photo of your made bed)"
                value={newTask.description} onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                style={{ borderColor: "#c3c6d6", backgroundColor: "#ffffff", color: "#051a3e" }} />
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ ...Mono, color: "#434654" }}>Reward ($)</label>
                  <input type="number" placeholder="1.00" step="0.50" value={newTask.reward}
                    onChange={(e) => setNewTask(prev => ({ ...prev, reward: e.target.value }))}
                    className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                    style={{ borderColor: "#c3c6d6", backgroundColor: "#ffffff", color: "#051a3e" }} />
                </div>
                <div className="flex-1">
                  <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ ...Mono, color: "#434654" }}>Task type</label>
                  <select value={newTask.task_type} onChange={(e) => setNewTask(prev => ({ ...prev, task_type: e.target.value }))}
                    className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                    style={{ borderColor: "#c3c6d6", backgroundColor: "#ffffff", color: "#051a3e" }}>
                    <option value="chore">Chore</option>
                    <option value="homework">Homework</option>
                    <option value="exercise">Exercise</option>
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer border" style={{ borderColor: "#e1e8ff", backgroundColor: "#f1f3ff" }}>
                <input type="checkbox" checked={newTask.requires_parent_approval}
                  onChange={(e) => setNewTask(prev => ({ ...prev, requires_parent_approval: e.target.checked }))} className="w-4 h-4 accent-blue-700" />
                <span className="text-sm" style={{ color: "#434654" }}>Require my approval after AI verifies</span>
              </label>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddTask(false)} className="flex-1 font-bold py-3 rounded-xl border text-sm" style={{ borderColor: "#c3c6d6", color: "#434654" }}>Cancel</button>
              <button onClick={addTask} disabled={!newTask.title || !newTask.reward}
                className="flex-1 font-black py-3 rounded-xl text-sm disabled:opacity-40"
                style={{ backgroundColor: "#003d9b", color: "#ffffff", ...HG }}>Add Task</button>
            </div>
          </div>
        </div>
      )}

      {/* Task Review Modal */}
      {selectedTask !== null && (() => {
        const task = tasks.find((t) => t.id === selectedTask);
        if (!task) return null;
        return (
          <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-4">
            <div className="glass-card rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-black text-xl" style={{ ...HG, color: "#051a3e" }}>{task.title}</h2>
                <button onClick={() => setSelectedTask(null)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#f1f3ff" }}>
                  <span className="material-symbols-outlined text-base" style={{ color: "#434654" }}>close</span>
                </button>
              </div>
              <p className="text-sm mb-4" style={{ color: "#434654" }}>Review Jake&apos;s submission</p>

              {task.photo_url ? (
                <div className="w-full h-52 relative rounded-2xl overflow-hidden mb-4 border" style={{ borderColor: "#e1e8ff" }}>
                  <Image src={task.photo_url} alt="Task submission" fill className="object-cover" unoptimized />
                </div>
              ) : (
                <div className="w-full h-24 flex items-center justify-center rounded-2xl mb-4" style={{ backgroundColor: "#f1f3ff", border: "1px solid #e1e8ff" }}>
                  <div className="flex items-center gap-2" style={{ color: "#737685" }}>
                    <span className="material-symbols-outlined">image_not_supported</span>
                    <p className="text-sm">No photo submitted yet</p>
                  </div>
                </div>
              )}

              {task.ai_verdict && (
                <div className="rounded-xl p-4 mb-4 flex items-start gap-2" style={{ backgroundColor: "#e9edff", border: "1px solid #c4d2ff" }}>
                  <span className="material-symbols-outlined text-base mt-0.5" style={{ color: "#003d9b" }}>auto_awesome</span>
                  <div>
                    <p className="text-xs font-bold mb-1" style={{ ...Mono, color: "#003d9b" }}>AI VERDICT</p>
                    <p className="text-sm" style={{ color: "#434654" }}>{task.ai_verdict}</p>
                  </div>
                </div>
              )}

              {task.fail_count >= 2 && (
                <div className="rounded-xl p-4 mb-4 flex items-start gap-2" style={{ backgroundColor: "#fff3e0", border: "1px solid #ffcc02" }}>
                  <span className="material-symbols-outlined text-base mt-0.5" style={{ color: "#bf360c" }}>warning</span>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#bf360c" }}>Failed {task.fail_count} times before getting it right.</p>
                    <p className="text-xs mt-0.5" style={{ color: "#e64a19" }}>You may want to check in with Jake.</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => rejectTask(task.id)} className="flex-1 font-bold py-3 rounded-xl text-sm border" style={{ borderColor: "#ffcdd2", color: "#ba1a1a", backgroundColor: "#fff0f0" }}>Reject</button>
                <button onClick={() => approveTask(task.id)} className="flex-1 font-black py-3 rounded-xl text-sm" style={{ backgroundColor: "#006e2a", color: "#ffffff", ...HG }}>Approve</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Header */}
      <header className="h-16 flex items-center justify-between px-5 border-b sticky top-0 z-40" style={{ backgroundColor: "#ffffff", borderColor: "#e1e8ff" }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm" style={{ backgroundColor: "#003d9b", color: "#ffffff" }}>R</div>
          <span className="font-black text-base" style={{ ...HG, color: "#003d9b" }}>Redefine</span>
        </Link>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#fff3e0" }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#bf360c" }} />
              <span className="text-xs font-bold" style={{ ...Mono, color: "#bf360c" }}>{pendingCount} pending</span>
            </div>
          )}
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm" style={{ backgroundColor: "#e9edff", color: "#003d9b", ...HG }}>P</div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 py-6">

        {/* Greeting + Add Task */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-xs uppercase tracking-wider" style={{ ...Mono, color: "#737685" }}>Parent Dashboard</p>
            <h1 className="font-black text-2xl mt-0.5" style={{ ...HG, color: "#051a3e" }}>Good morning</h1>
            <p className="text-sm" style={{ color: "#434654" }}>Here&apos;s what Jake has been up to today.</p>
          </div>
          <button onClick={() => setShowAddTask(true)}
            className="font-black px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition-all active:scale-95"
            style={{ backgroundColor: "#003d9b", color: "#ffffff", ...HG }}>
            <span className="material-symbols-outlined text-base">add</span>
            Add Task
          </button>
        </div>

        {/* Live status card */}
        <div className="rounded-2xl p-5 mb-5 relative overflow-hidden" style={{ backgroundColor: "#003d9b" }}>
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10" style={{ backgroundColor: "#ffffff" }} />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AppLogo app={topApp?.app ?? "TikTok"} size={10} />
              <span className="w-2.5 h-2.5 rounded-full animate-pulse flex-shrink-0" style={{ backgroundColor: "#ff6b6b" }} />
              <div>
                <p className="font-bold text-base" style={{ color: "#ffffff" }}>Jake is on {topApp?.app ?? "TikTok"}</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)", ...Mono }}>${parseFloat(topApp?.rate ?? "0.10").toFixed(2)}/min draining</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-3xl" style={{ ...HG, color: "#69ff87" }}>${cappedBalance.toFixed(2)}</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)", ...Mono }}>balance left</p>
            </div>
          </div>
          <div className="mt-4 w-full rounded-full h-1.5" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
            <div className="h-1.5 rounded-full" style={{ width: `${Math.min((cappedBalance / 20) * 100, 100)}%`, backgroundColor: "#69ff87" }} />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Weekly Budget", value: "$20.00", icon: "account_balance_wallet", color: "#003d9b", bg: "#e9edff" },
            { label: "Spent Today",   value: `$${Math.max(0, 20 - balance).toFixed(2)}`, icon: "trending_down", color: "#ba1a1a", bg: "#fff0f0" },
            { label: "Remaining",     value: `$${cappedBalance.toFixed(2)}`, icon: "savings", color: "#006e2a", bg: "#f0fff4" },
            { label: "Tasks Done",    value: `${tasks.filter(t => t.status === "approved").length}/${tasks.length}`, icon: "task_alt", color: "#6b54a2", bg: "#f3e8ff" },
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: stat.bg }}>
                <span className="material-symbols-outlined text-lg" style={{ color: stat.color }}>{stat.icon}</span>
              </div>
              <p className="text-xs mb-1" style={{ ...Mono, color: "#737685" }}>{stat.label}</p>
              <p className="font-black text-xl" style={{ ...HG, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ backgroundColor: "#e9edff" }}>
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-bold transition-all"
              style={{
                backgroundColor: activeTab === tab.key ? "#ffffff" : "transparent",
                color: activeTab === tab.key ? "#003d9b" : "#737685",
                boxShadow: activeTab === tab.key ? "0 1px 4px rgba(0,0,0,0.08)" : undefined,
                ...HG,
              }}>
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: activeTab === tab.key ? "'FILL' 1" : "'FILL' 0" }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <p className="text-xs uppercase tracking-wider mb-4" style={{ ...Mono, color: "#737685" }}>Recent activity</p>
            <div className="flex flex-col gap-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="glass-card rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AppLogo app={item.app} size={9} />
                    <div>
                      <p className="font-bold text-sm" style={{ color: "#051a3e" }}>{item.app}</p>
                      <p className="text-xs" style={{ ...Mono, color: "#737685" }}>{item.duration} · {item.time}</p>
                    </div>
                  </div>
                  <p className="font-black text-sm" style={{ ...HG, color: "#ba1a1a" }}>{item.cost}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-wider" style={{ ...Mono, color: "#737685" }}>All tasks</p>
              <p className="text-xs" style={{ color: "#737685" }}>Completed tasks restore Jake&apos;s balance</p>
            </div>
            <div className="flex flex-col gap-3">
              {tasks.length === 0 && (
                <div className="glass-card rounded-xl p-8 text-center">
                  <span className="material-symbols-outlined text-3xl mb-2 block" style={{ color: "#c3c6d6" }}>task_alt</span>
                  <p className="text-sm" style={{ color: "#737685" }}>No tasks yet. Add one above.</p>
                </div>
              )}
              {tasks.map((task) => {
                const isPending = task.status === "pending_review";
                const isApproved = task.status === "approved";
                return (
                  <div key={task.id} className="glass-card rounded-xl p-4 border" style={{
                    borderColor: isPending ? "#ffd166" : isApproved ? "#69ff87" : "#e1e8ff",
                    backgroundColor: isPending ? "#fffbea" : isApproved ? "#f0fff4" : "#ffffff",
                  }}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{
                          backgroundColor: isApproved ? "#f0fff4" : isPending ? "#fffbea" : "#f1f3ff",
                        }}>
                          <span className="material-symbols-outlined text-lg" style={{ color: isApproved ? "#006e2a" : isPending ? "#b45309" : "#737685", fontVariationSettings: isApproved ? "'FILL' 1" : "'FILL' 0" }}>
                            {isApproved ? "check_circle" : isPending ? "pending" : "radio_button_unchecked"}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-sm" style={{ color: "#051a3e" }}>{task.title}</p>
                            {task.fail_count >= 2 && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#fff3e0", color: "#bf360c", ...Mono }}>{task.fail_count} fails</span>
                            )}
                          </div>
                          <p className="text-xs mt-0.5" style={{ color: isPending ? "#b45309" : isApproved ? "#006e2a" : "#737685", ...Mono }}>
                            {isPending ? "Photo submitted — needs your review" : isApproved ? "Approved — balance restored" : "Waiting for Jake to complete"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="text-right">
                          <p className="font-black text-sm" style={{ ...HG, color: "#006e2a" }}>${task.reward?.toFixed(2)}</p>
                        </div>
                        {isPending && (
                          <button onClick={() => setSelectedTask(task.id)}
                            className="font-bold text-xs px-3 py-2 rounded-lg"
                            style={{ backgroundColor: "#003d9b", color: "#ffffff", ...HG }}>
                            Review
                          </button>
                        )}
                        <button onClick={() => deleteTask(task.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center border"
                          style={{ borderColor: "#ffcdd2", backgroundColor: "#fff0f0" }}>
                          <span className="material-symbols-outlined text-base" style={{ color: "#ba1a1a" }}>delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wider mb-0.5" style={{ ...Mono, color: "#737685" }}>App rates</p>
                <p className="text-sm" style={{ color: "#434654" }}>How much Jake pays per minute on each app.</p>
              </div>
              <button onClick={() => setShowAddApp(!showAddApp)}
                className="font-bold text-sm px-3 py-2 rounded-xl border flex items-center gap-1"
                style={{ borderColor: "#c3c6d6", color: "#003d9b" }}>
                <span className="material-symbols-outlined text-base">add</span> App
              </button>
            </div>

            {showAddApp && (
              <div className="rounded-xl p-4 border mb-4" style={{ backgroundColor: "#e9edff", borderColor: "#c4d2ff" }}>
                <p className="text-sm font-bold mb-3" style={{ color: "#003d9b" }}>Add a new app</p>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ ...Mono, color: "#434654" }}>App name</label>
                    <input type="text" placeholder="e.g. BeReal, Facebook"
                      value={newApp.app} onChange={(e) => setNewApp(p => ({ ...p, app: e.target.value }))}
                      className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                      style={{ borderColor: "#c3c6d6", backgroundColor: "#ffffff", color: "#051a3e" }} />
                  </div>
                  <div className="w-28">
                    <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ ...Mono, color: "#434654" }}>$/min</label>
                    <input type="number" step="0.01" placeholder="0.05"
                      value={newApp.rate} onChange={(e) => setNewApp(p => ({ ...p, rate: e.target.value }))}
                      className="w-full border rounded-xl px-3 py-2.5 text-sm text-center focus:outline-none"
                      style={{ borderColor: "#c3c6d6", backgroundColor: "#ffffff", color: "#051a3e" }} />
                  </div>
                  <button onClick={() => { if (!newApp.app) return; setAppRates(prev => [...prev, { app: newApp.app, rate: newApp.rate }]); setNewApp({ app: "", rate: "0.05" }); setShowAddApp(false); }}
                    disabled={!newApp.app} className="font-black py-2.5 px-4 rounded-xl text-sm disabled:opacity-40"
                    style={{ backgroundColor: "#003d9b", color: "#ffffff", ...HG }}>Add</button>
                </div>
              </div>
            )}

            <div className="glass-card rounded-2xl overflow-hidden mb-4 divide-y" style={{ borderColor: "#e1e8ff" }}>
              {appRates.map((item, i) => (
                <div key={item.app} className="flex items-center justify-between px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <AppLogo app={item.app} size={9} />
                    <span className="font-bold text-sm" style={{ color: "#051a3e" }}>{item.app}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm" style={{ ...Mono, color: "#737685" }}>$</span>
                    <input type="number" value={item.rate} step="0.01"
                      onChange={(e) => { const u = [...appRates]; u[i] = { ...u[i], rate: e.target.value }; setAppRates(u); }}
                      className="w-16 border rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none"
                      style={{ borderColor: "#c3c6d6", color: "#051a3e", backgroundColor: "#ffffff", ...Mono }} />
                    <span className="text-sm" style={{ ...Mono, color: "#737685" }}>/min</span>
                    <button onClick={() => setAppRates(prev => prev.filter((_, j) => j !== i))}
                      className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ color: "#ba1a1a", backgroundColor: "#fff0f0" }}>
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={saveRates} className="w-full font-black py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
              style={{ backgroundColor: ratesSaved ? "#006e2a" : "#003d9b", color: "#ffffff", ...HG }}>
              <span className="material-symbols-outlined text-base">{ratesSaved ? "check" : "save"}</span>
              {ratesSaved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 pb-safe border-t" style={{ backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderColor: "#e1e8ff" }}>
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
            style={{ color: activeTab === tab.key ? "#003d9b" : "#737685" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24, fontVariationSettings: activeTab === tab.key ? "'FILL' 1" : "'FILL' 0" }}>{tab.icon}</span>
            <span className="text-xs font-bold" style={{ ...Mono }}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}

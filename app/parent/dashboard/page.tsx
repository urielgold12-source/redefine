"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const KID_ID = "3773eeac-6e2c-4d2f-8521-5ba7f16629cf";
const PARENT_ID = "359bb543-1c5e-4eb3-bf0c-84016adb58f1";

const APP_LOGOS: Record<string, { bg: string; svg: string }> = {
  "TikTok": {
    bg: "#000000",
    svg: `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.15 8.15 0 0 0 4.77 1.52V6.77a4.85 4.85 0 0 1-1-.08z"/></svg>`
  },
  "Instagram": {
    bg: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
    svg: `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`
  },
  "Snapchat": {
    bg: "#FFFC00",
    svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-size="16" font-weight="900" font-family="Arial" fill="#000">SC</text></svg>`
  },
  "YouTube": {
    bg: "#FF0000",
    svg: `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>`
  },
  "Twitter/X": {
    bg: "#000000",
    svg: `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
  },
  "Reddit": {
    bg: "#FF4500",
    svg: `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>`
  },
  "Facebook": {
    bg: "#1877F2",
    svg: `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
  },
  "BeReal": {
    bg: "#000000",
    svg: `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><text x="2" y="18" font-size="14" font-weight="bold" font-family="Arial">BR</text></svg>`
  },
};

function AppLogo({ app, size = 10 }: { app: string; size?: number }) {
  const logo = APP_LOGOS[app];
  const sizeClass = `w-${size} h-${size}`;
  if (!logo) {
    return (
      <div className={`${sizeClass} rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0`}
        style={{ backgroundColor: "#E5E7EB", color: "#1B4332" }}>
        {app.slice(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    <div className={`${sizeClass} rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden`}
      style={{ background: logo.bg }}>
      <div className="w-6 h-6" dangerouslySetInnerHTML={{ __html: logo.svg }} />
    </div>
  );
}

type Task = {
  id: string;
  title: string;
  reward: number;
  status: string;
  task_type: string;
  ai_verdict: string;
  fail_count: number;
  photo_url: string;
  requires_parent_approval: boolean;
};

const recentActivity = [
  { app: "TikTok", duration: "23 mins", cost: "$2.30", time: "2 mins ago", icon: "🎵" },
  { app: "Instagram", duration: "15 mins", cost: "$1.20", time: "1 hour ago", icon: "📸" },
  { app: "YouTube", duration: "45 mins", cost: "$2.25", time: "3 hours ago", icon: "▶️" },
  { app: "Snapchat", duration: "10 mins", cost: "$0.80", time: "5 hours ago", icon: "👻" },
];

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "settings">("overview");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [balance, setBalance] = useState(20.00);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", reward: "", task_type: "chore", requires_parent_approval: false });
  const [appRates, setAppRates] = useState([
    { app: "TikTok", rate: "0.10" },
    { app: "Instagram", rate: "0.08" },
    { app: "Snapchat", rate: "0.08" },
    { app: "YouTube", rate: "0.05" },
    { app: "Twitter/X", rate: "0.05" },
  ]);
  const [newApp, setNewApp] = useState({ app: "", rate: "0.05" });
  const [showAddApp, setShowAddApp] = useState(false);
  const [ratesSaved, setRatesSaved] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    // Load tasks
    const res = await fetch(`/api/tasks?kidId=${KID_ID}`);
    const data = await res.json();
    setTasks(data);

    // Load balance
    const kidRes = await fetch(`/api/kid?kidId=${KID_ID}`);
    if (kidRes.ok) {
      const kidData = await kidRes.json();
      setBalance(kidData.balance);
    }
  }

  async function approveTask(taskId: string) {
    await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId,
        status: "approved",
        kidId: KID_ID,
        reward: tasks.find(t => t.id === taskId)?.reward,
      }),
    });
    setSelectedTask(null);
    loadData();
  }

  async function deleteTask(taskId: string) {
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId }),
    });
    loadData();
  }

  async function rejectTask(taskId: string) {
    await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, status: "active" }),
    });
    setSelectedTask(null);
    loadData();
  }

  async function addTask() {
    if (!newTask.title || !newTask.reward) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kid_id: KID_ID,
        title: newTask.title,
        description: newTask.description,
        reward: parseFloat(newTask.reward),
        task_type: newTask.task_type,
        requires_parent_approval: newTask.requires_parent_approval,
      }),
    });
    if (res.ok) {
      setShowAddTask(false);
      setNewTask({ title: "", description: "", reward: "", task_type: "chore", requires_parent_approval: false });
      loadData();
    }
  }

  async function saveRates() {
    for (const rate of appRates) {
      await fetch("/api/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kid_id: KID_ID,
          app_name: rate.app,
          rate_per_minute: parseFloat(rate.rate),
        }),
      });
    }
    setRatesSaved(true);
    setTimeout(() => setRatesSaved(false), 2000);
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F8F4ED", color: "#1A1A2E" }}>

      {/* Nav */}
      <nav className="border-b px-8 py-4 flex items-center justify-between sticky top-0 z-50" style={{ backgroundColor: "#1B4332", borderColor: "#2D6A4F" }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm" style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>R</div>
          <span className="text-lg font-bold" style={{ color: "#FFFDF9" }}>Redefine</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm" style={{ color: "#A7C4B5" }}>Parent Dashboard</span>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>P</div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10" style={{ backgroundColor: "#F8F4ED", minHeight: "100vh" }}>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black" style={{ color: "#1B4332" }}>Good morning</h1>
            <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>Here is what Jake has been up to today.</p>
          </div>
          <button onClick={() => setShowAddTask(true)}
            className="font-bold px-5 py-2.5 rounded-xl text-sm transition hover:opacity-90"
            style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>
            + Add Task
          </button>
        </div>

        {/* Live status card — shows the most expensive app (most likely to be used) */}
        {(() => {
          const topApp = [...appRates].sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate))[0];
          const appName = topApp?.app ?? "TikTok";
          const rate = topApp?.rate ?? "0.10";
          return (
        <div className="rounded-2xl p-6 mb-6 border overflow-hidden" style={{ backgroundColor: "#1B4332", borderColor: "#2D6A4F" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AppLogo app={appName} />
              <span className="w-2.5 h-2.5 rounded-full animate-pulse flex-shrink-0" style={{ backgroundColor: "#EF5350" }} />
              <div>
                <p className="font-bold text-lg" style={{ color: "#FFFDF9" }}>Jake is on {appName} right now</p>
                <p className="text-sm" style={{ color: "#A7C4B5" }}>Balance draining at ${parseFloat(rate).toFixed(2)}/min</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black" style={{ color: "#FF9900" }}>${Math.min(balance, 20).toFixed(2)}</p>
              <p className="text-sm" style={{ color: "#A7C4B5" }}>current balance</p>
            </div>
          </div>
          {/* Balance bar */}
          <div className="mt-4 w-full rounded-full h-1.5" style={{ backgroundColor: "#2D6A4F" }}>
            <div className="h-1.5 rounded-full transition-all" style={{ width: `${Math.min((balance / 20) * 100, 100)}%`, backgroundColor: "#52B788" }} />
          </div>
        </div>
          );
        })()}

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Weekly Budget", value: "$20.00", accent: "#1B4332" },
            { label: "Spent Today", value: `$${Math.max(0, 20 - balance).toFixed(2)}`, accent: "#DC2626" },
            { label: "Remaining", value: `$${Math.min(balance, 20).toFixed(2)}`, accent: "#2D6A4F" },
            { label: "Tasks Done", value: `${tasks.filter(t => t.status === "approved").length}/${tasks.length}`, accent: "#FF9900" },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl p-4 border" style={{ backgroundColor: "#FFFDF9", borderColor: "#E5E7EB" }}>
              <p className="text-xs mb-1" style={{ color: "#6B7280" }}>{stat.label}</p>
              <p className="text-2xl font-black" style={{ color: stat.accent }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b pb-4" style={{ borderColor: "#E5E7EB" }}>
          {(["overview", "tasks", "settings"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-lg text-sm font-bold capitalize transition"
              style={{
                backgroundColor: activeTab === tab ? "#1B4332" : "transparent",
                color: activeTab === tab ? "#FFFDF9" : "#6B7280",
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <h2 className="text-lg font-bold mb-4" style={{ color: "#1B4332" }}>Recent Activity</h2>
            <div className="flex flex-col gap-3">
              {recentActivity.map((item, i) => {
                const logo = APP_LOGOS[item.app] ?? { bg: "#E5E7EB", text: "#1B4332", label: item.app[0] };
                return (
                  <div key={i} className="rounded-2xl p-4 border flex items-center justify-between" style={{ backgroundColor: "#FFFDF9", borderColor: "#E5E7EB" }}>
                    <div className="flex items-center gap-4">
                      <AppLogo app={item.app} />
                      <div>
                        <p className="font-bold text-sm" style={{ color: "#1B4332" }}>{item.app}</p>
                        <p className="text-xs" style={{ color: "#6B7280" }}>{item.duration} · {item.time}</p>
                      </div>
                    </div>
                    <p className="font-bold text-sm" style={{ color: "#DC2626" }}>{item.cost}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Task Modal */}
        {showAddTask && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
            <div className="rounded-2xl border p-6 w-full max-w-md shadow-2xl" style={{ backgroundColor: "#FFFDF9", borderColor: "#E5E7EB" }}>
              <h2 className="text-xl font-black mb-4" style={{ color: "#1B4332" }}>Add New Task</h2>
              <div className="flex flex-col gap-3">
                <input type="text" placeholder="Task title (e.g. Clean your room)"
                  value={newTask.title} onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                  style={{ borderColor: "#D1D5DB", backgroundColor: "#FFFFFF", color: "#1A1A2E" }} />
                <input type="text" placeholder="Description (e.g. Take a photo of your clean room)"
                  value={newTask.description} onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                  style={{ borderColor: "#D1D5DB", backgroundColor: "#FFFFFF", color: "#1A1A2E" }} />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-semibold block mb-1" style={{ color: "#1B4332" }}>Reward ($)</label>
                    <input type="number" placeholder="1.00" step="0.50" value={newTask.reward}
                      onChange={(e) => setNewTask(prev => ({ ...prev, reward: e.target.value }))}
                      className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                      style={{ borderColor: "#D1D5DB", backgroundColor: "#FFFFFF", color: "#1A1A2E" }} />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold block mb-1" style={{ color: "#1B4332" }}>Task type</label>
                    <select value={newTask.task_type} onChange={(e) => setNewTask(prev => ({ ...prev, task_type: e.target.value }))}
                      className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                      style={{ borderColor: "#D1D5DB", backgroundColor: "#FFFFFF", color: "#1A1A2E" }}>
                      <option value="chore">Chore</option>
                      <option value="homework">Homework</option>
                      <option value="exercise">Exercise</option>
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer border" style={{ borderColor: "#E5E7EB", backgroundColor: "#F8F4ED" }}>
                  <input type="checkbox" checked={newTask.requires_parent_approval}
                    onChange={(e) => setNewTask(prev => ({ ...prev, requires_parent_approval: e.target.checked }))} className="w-4 h-4" />
                  <span className="text-sm" style={{ color: "#4A6741" }}>Require my approval after AI verifies</span>
                </label>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowAddTask(false)} className="flex-1 font-bold py-3 rounded-xl border text-sm"
                  style={{ borderColor: "#C8B89A", color: "#1B4332" }}>Cancel</button>
                <button onClick={addTask} disabled={!newTask.title || !newTask.reward}
                  className="flex-1 font-black py-3 rounded-xl text-sm transition hover:opacity-90 disabled:opacity-40"
                  style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>Add Task</button>
              </div>
            </div>
          </div>
        )}

        {/* Task Review Modal */}
        {selectedTask !== null && (() => {
          const task = tasks.find((t) => t.id === selectedTask);
          if (!task) return null;
          return (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
              <div className="rounded-2xl border p-6 w-full max-w-md shadow-2xl" style={{ backgroundColor: "#FFFDF9", borderColor: "#E5E7EB" }}>
                <h2 className="text-xl font-black mb-1" style={{ color: "#1B4332" }}>{task.title}</h2>
                <p className="text-sm mb-4" style={{ color: "#6B7280" }}>Review Jake's submission</p>

                {task.photo_url ? (
                  <div className="w-full h-52 relative rounded-2xl overflow-hidden mb-4 border" style={{ borderColor: "#E5E7EB" }}>
                    <Image src={task.photo_url} alt="Task submission" fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="w-full h-24 flex items-center justify-center rounded-2xl mb-4 border" style={{ borderColor: "#E5E7EB", backgroundColor: "#F8F4ED" }}>
                    <p className="text-sm" style={{ color: "#9CA3AF" }}>No photo submitted yet</p>
                  </div>
                )}

                {task.ai_verdict && (
                  <div className="rounded-xl p-4 mb-4 border" style={{ backgroundColor: "#EBF5EE", borderColor: "#C8D9C8" }}>
                    <p className="text-xs font-bold mb-1" style={{ color: "#2D6A4F" }}>AI Verdict</p>
                    <p className="text-sm" style={{ color: "#4A6741" }}>{task.ai_verdict}</p>
                  </div>
                )}

                {task.fail_count >= 2 && (
                  <div className="rounded-xl p-4 mb-4 border" style={{ backgroundColor: "#FFF7ED", borderColor: "#FED7AA" }}>
                    <p className="text-sm font-bold" style={{ color: "#C2410C" }}>Jake failed this task {task.fail_count} times before getting it right.</p>
                    <p className="text-xs mt-1" style={{ color: "#EA580C" }}>You may want to check in with them.</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => rejectTask(task.id)}
                    className="flex-1 font-bold py-3 rounded-xl text-sm border transition"
                    style={{ borderColor: "#FCA5A5", color: "#DC2626", backgroundColor: "#FEF2F2" }}>
                    Reject
                  </button>
                  <button onClick={() => approveTask(task.id)}
                    className="flex-1 font-black py-3 rounded-xl text-sm transition hover:opacity-90"
                    style={{ backgroundColor: "#2D6A4F", color: "#FFFDF9" }}>
                    Approve
                  </button>
                </div>

                <button onClick={() => setSelectedTask(null)}
                  className="w-full mt-3 font-bold py-2 rounded-xl text-sm"
                  style={{ color: "#9CA3AF" }}>Close</button>
              </div>
            </div>
          );
        })()}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: "#1B4332" }}>Tasks</h2>
              <p className="text-xs" style={{ color: "#6B7280" }}>Completed tasks restore balance to your child</p>
            </div>
            <div className="flex flex-col gap-3">
              {tasks.length === 0 && (
                <p className="text-sm text-center py-8" style={{ color: "#9CA3AF" }}>No tasks yet. Add one above.</p>
              )}
              {tasks.map((task) => (
                <div key={task.id} className="border rounded-2xl p-4 transition" style={{
                  backgroundColor: task.status === "pending_review" ? "#FFFBEB" : task.status === "approved" ? "#F0FDF4" : "#FFFDF9",
                  borderColor: task.status === "pending_review" ? "#FCD34D" : task.status === "approved" ? "#86EFAC" : "#E5E7EB",
                }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm" style={{
                        backgroundColor: task.status === "approved" ? "#D1FAE5" : task.status === "pending_review" ? "#FEF3C7" : "#F3F4F6",
                        color: task.status === "approved" ? "#059669" : task.status === "pending_review" ? "#D97706" : "#6B7280",
                      }}>
                        {task.status === "approved" ? "✓" : task.status === "pending_review" ? "!" : "—"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm" style={{ color: "#1B4332" }}>{task.title}</p>
                          {task.fail_count >= 2 && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FFF7ED", color: "#C2410C" }}>
                              {task.fail_count} fails
                            </span>
                          )}
                        </div>
                        <p className="text-xs mt-0.5" style={{
                          color: task.status === "pending_review" ? "#D97706" : task.status === "approved" ? "#059669" : "#9CA3AF"
                        }}>
                          {task.status === "pending_review" ? "Photo submitted — needs your review" : task.status === "approved" ? "Approved — balance restored" : "Waiting for child to complete"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-sm" style={{ color: "#2D6A4F" }}>${task.reward?.toFixed(2)}</p>
                        <p className="text-xs" style={{ color: "#9CA3AF" }}>reward</p>
                      </div>
                      {task.status === "pending_review" && (
                        <button onClick={() => setSelectedTask(task.id)}
                          className="font-bold text-xs px-3 py-2 rounded-lg transition hover:opacity-90"
                          style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>
                          Review →
                        </button>
                      )}
                      <button onClick={() => deleteTask(task.id)}
                        className="text-xs px-2 py-1.5 rounded-lg border transition hover:opacity-80"
                        style={{ borderColor: "#FECACA", color: "#DC2626", backgroundColor: "#FEF2F2" }}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold" style={{ color: "#1B4332" }}>App Rates</h2>
              <button onClick={() => setShowAddApp(!showAddApp)}
                className="text-sm font-bold px-3 py-1.5 rounded-lg border transition"
                style={{ borderColor: "#C8B89A", color: "#1B4332" }}>
                + Add App
              </button>
            </div>
            <p className="text-sm mb-5" style={{ color: "#6B7280" }}>Set how much Jake pays per minute on each social media app.</p>

            {/* Add custom app */}
            {showAddApp && (
              <div className="rounded-2xl p-4 border mb-4" style={{ backgroundColor: "#EBF5EE", borderColor: "#C8D9C8" }}>
                <p className="text-sm font-bold mb-3" style={{ color: "#1B4332" }}>Add a new app</p>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="text-xs font-semibold block mb-1" style={{ color: "#1B4332" }}>App name</label>
                    <input type="text" placeholder="e.g. BeReal, Facebook"
                      value={newApp.app}
                      onChange={(e) => setNewApp(p => ({ ...p, app: e.target.value }))}
                      className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none"
                      style={{ borderColor: "#D1D5DB", backgroundColor: "#FFFFFF", color: "#1A1A2E" }} />
                  </div>
                  <div className="w-28">
                    <label className="text-xs font-semibold block mb-1" style={{ color: "#1B4332" }}>Rate ($/min)</label>
                    <input type="number" step="0.01" placeholder="0.05"
                      value={newApp.rate}
                      onChange={(e) => setNewApp(p => ({ ...p, rate: e.target.value }))}
                      className="w-full border rounded-xl px-3 py-2 text-sm text-center focus:outline-none"
                      style={{ borderColor: "#D1D5DB", backgroundColor: "#FFFFFF", color: "#1A1A2E" }} />
                  </div>
                  <button
                    onClick={() => {
                      if (!newApp.app) return;
                      setAppRates(prev => [...prev, { app: newApp.app, rate: newApp.rate }]);
                      setNewApp({ app: "", rate: "0.05" });
                      setShowAddApp(false);
                    }}
                    disabled={!newApp.app}
                    className="font-black py-2 px-4 rounded-xl text-sm disabled:opacity-40"
                    style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>
                    Add
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {appRates.map((item, i) => {
                const logo = APP_LOGOS[item.app] ?? { bg: "#E5E7EB", text: "#1B4332", label: item.app.slice(0, 2).toUpperCase() };
                return (
                  <div key={item.app} className="rounded-2xl px-5 py-4 border flex items-center justify-between" style={{ backgroundColor: "#FFFDF9", borderColor: "#E5E7EB" }}>
                    <div className="flex items-center gap-3">
                      <AppLogo app={item.app} size={9} />
                      <span className="font-semibold text-sm" style={{ color: "#1B4332" }}>{item.app}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm" style={{ color: "#6B7280" }}>$</span>
                      <input type="number" value={item.rate} step="0.01"
                        onChange={(e) => { const u = [...appRates]; u[i] = { ...u[i], rate: e.target.value }; setAppRates(u); }}
                        className="w-16 border rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none"
                        style={{ borderColor: "#D1D5DB", color: "#1A1A2E", backgroundColor: "#FFFFFF" }} />
                      <span className="text-sm" style={{ color: "#6B7280" }}>/min</span>
                      <button onClick={() => setAppRates(prev => prev.filter((_, j) => j !== i))}
                        className="text-xs px-2 py-1 rounded-lg ml-2"
                        style={{ color: "#9CA3AF" }}>✕</button>
                    </div>
                  </div>
                );
              })}
              <button onClick={saveRates}
                className="mt-2 font-black py-3 rounded-xl text-sm transition hover:opacity-90"
                style={{ backgroundColor: ratesSaved ? "#2D6A4F" : "#FF9900", color: ratesSaved ? "#FFFDF9" : "#1B4332" }}>
                {ratesSaved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
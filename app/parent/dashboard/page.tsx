"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type Task = {
  id: string;
  title: string;
  reward: number;
  description: string;
  task_type: string;
  status: string;
  requires_parent_approval: boolean;
};

const KID_ID = "3773eeac-6e2c-4d2f-8521-5ba7f16629cf";

const taskTypeConfig: Record<string, { icon: string; color: string; bg: string }> = {
  chore:    { icon: "cleaning_services", color: "#006e2a", bg: "#e8f5e9" },
  homework: { icon: "menu_book",         color: "#0052cc", bg: "#deecff" },
  exercise: { icon: "fitness_center",    color: "#6554c0", bg: "#ecdfff" },
};

export default function ParentDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", reward: "", task_type: "chore", requires_parent_approval: false });
  const [balance, setBalance] = useState(20.00);
  const [weeklyBudget] = useState(20.00);
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "add">("overview");
  const [pendingApprovals, setPendingApprovals] = useState<Task[]>([]);
  const [addStatus, setAddStatus] = useState<"idle" | "adding" | "done" | "error">("idle");
  const [editId, setEditId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const res = await fetch(`/api/tasks?kidId=${KID_ID}`);
    const data = await res.json();
    setTasks(data);
    setPendingApprovals(data.filter((t: Task) => t.status === "pending_review"));
    const kidRes = await fetch(`/api/kid?kidId=${KID_ID}`);
    if (kidRes.ok) { const d = await kidRes.json(); setBalance(d.balance); }
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.title || !newTask.reward) return;
    setAddStatus("adding");
    try {
      const res = await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newTask, reward: parseFloat(newTask.reward), kid_id: KID_ID }) });
      if (res.ok) {
        setAddStatus("done"); setNewTask({ title: "", description: "", reward: "", task_type: "chore", requires_parent_approval: false });
        await loadData(); setTimeout(() => setAddStatus("idle"), 2000);
      } else setAddStatus("error");
    } catch { setAddStatus("error"); }
  }

  async function handleApprove(taskId: string) {
    await fetch("/api/tasks", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ taskId, action: "approve", kidId: KID_ID }) });
    await loadData();
  }

  async function handleDelete(taskId: string) {
    setDeletingId(taskId);
    await fetch(`/api/tasks?taskId=${taskId}`, { method: "DELETE" });
    await loadData(); setDeletingId(null);
  }

  const pct = Math.min((balance / weeklyBudget) * 100, 100);
  const completedCount = tasks.filter(t => t.status === "approved").length;

  return (
    <main style={{ backgroundColor: "#faf9ff", minHeight: "100dvh", paddingBottom: 96 }}>

      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e1e8ff", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div className="font-display" style={{ width: 32, height: 32, borderRadius: 10, background: "#0052cc", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14 }}>R</div>
          <span className="font-display" style={{ fontWeight: 800, fontSize: 16, color: "#0052cc" }}>Redefine</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {pendingApprovals.length > 0 && (
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#ba1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="font-mono" style={{ fontSize: 11, color: "#fff", fontWeight: 700 }}>{pendingApprovals.length}</span>
            </div>
          )}
          <div className="font-display" style={{ width: 32, height: 32, borderRadius: 999, background: "#e8f5e9", color: "#006e2a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>P</div>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#434654" }}>Parent</span>
        </div>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 20px 0" }}>

        {/* Balance card */}
        <div style={{ background: "#051a3e", borderRadius: 20, padding: 20, marginBottom: 12, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -30, top: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <div>
                <p className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Jake&apos;s Balance</p>
                <p className="font-display" style={{ fontSize: 52, fontWeight: 900, color: balance < 5 ? "#ff6b6b" : "#fff", margin: "4px 0 0", lineHeight: 1, letterSpacing: "-0.02em" }}>${balance.toFixed(2)}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Weekly</p>
                <p className="font-display" style={{ fontSize: 18, fontWeight: 800, color: "rgba(255,255,255,0.6)", margin: "4px 0 0" }}>${weeklyBudget}</p>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 999, height: 6, margin: "16px 0 8px" }}>
              <div style={{ height: 6, borderRadius: 999, width: `${pct}%`, background: balance < 5 ? "#ff6b6b" : balance < 10 ? "#ffd166" : "#69ff87", transition: "width 0.3s" }} />
            </div>
            <p className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{pct.toFixed(0)}% of weekly budget remaining</p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
          {[
            { icon: "task_alt", label: "Done", value: completedCount, color: "#006e2a", bg: "#e8f5e9" },
            { icon: "pending", label: "Pending", value: tasks.filter(t => t.status === "pending_review").length, color: "#0052cc", bg: "#deecff" },
            { icon: "hourglass_empty", label: "Waiting", value: tasks.filter(t => t.status === "idle" || !t.status).length, color: "#6554c0", bg: "#ecdfff" },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: s.color }}>{s.icon}</span>
              </div>
              <p className="font-display" style={{ fontSize: 22, fontWeight: 900, color: "#051a3e", margin: 0 }}>{s.value}</p>
              <p className="font-mono" style={{ fontSize: 10, color: "#737685", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Pending approvals */}
        {pendingApprovals.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p className="font-mono" style={{ fontSize: 11, color: "#737685", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Needs your approval</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pendingApprovals.map(t => (
                <div key={t.id} className="glass-card" style={{ borderRadius: 16, padding: 16, borderColor: "#c4d2ff", background: "#f1f3ff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <p className="font-display" style={{ fontSize: 16, fontWeight: 800, color: "#051a3e", margin: "0 0 4px" }}>{t.title}</p>
                      <p style={{ fontSize: 13, color: "#434654", margin: 0 }}>{t.description}</p>
                    </div>
                    <span className="font-display" style={{ fontSize: 18, fontWeight: 900, color: "#2e6c00" }}>${t.reward.toFixed(2)}</span>
                  </div>
                  <button onClick={() => handleApprove(t.id)} className="font-display" style={{ width: "100%", padding: "12px 0", borderRadius: 12, border: "none", background: "#006e2a", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span> Approve & Pay
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Segmented tabs */}
        <div style={{ background: "#f1f3ff", borderRadius: 14, padding: 4, display: "flex", gap: 4, marginBottom: 20 }}>
          {(["overview", "tasks", "add"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? "font-display" : ""}
              style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: activeTab === tab ? "#fff" : "transparent", color: activeTab === tab ? "#051a3e" : "#737685", fontWeight: activeTab === tab ? 800 : 500, fontSize: 13, cursor: "pointer", boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.1)" : "none", textTransform: "capitalize" }}>
              {tab === "add" ? "+ Add Task" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="glass-card" style={{ borderRadius: 16, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#0052cc" }}>phone_iphone</span>
                <p className="font-display" style={{ fontSize: 16, fontWeight: 800, color: "#051a3e", margin: 0 }}>Screen Time Today</p>
              </div>
              <p className="font-display" style={{ fontSize: 38, fontWeight: 900, color: "#ba1a1a", margin: "0 0 4px" }}>2h 34m</p>
              <p className="font-mono" style={{ fontSize: 12, color: "#737685", margin: 0 }}>TikTok: 1h 12m · Instagram: 52m · YouTube: 30m</p>
            </div>
            <div className="glass-card" style={{ borderRadius: 16, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#006e2a" }}>trending_up</span>
                <p className="font-display" style={{ fontSize: 16, fontWeight: 800, color: "#051a3e", margin: 0 }}>This Week</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Tasks completed", value: completedCount },
                  { label: "Money earned", value: `$${tasks.filter(t => t.status === "approved").reduce((s, t) => s + t.reward, 0).toFixed(2)}` },
                ].map(m => (
                  <div key={m.label}>
                    <p className="font-display" style={{ fontSize: 26, fontWeight: 900, color: "#051a3e", margin: 0 }}>{m.value}</p>
                    <p className="font-mono" style={{ fontSize: 11, color: "#737685", margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tasks tab */}
        {activeTab === "tasks" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {tasks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#c3c6d6" }}>assignment</span>
                <p className="font-display" style={{ fontSize: 18, fontWeight: 800, color: "#434654", marginTop: 8 }}>No tasks yet</p>
                <p style={{ fontSize: 14, color: "#737685" }}>Add your first task to get started.</p>
                <button onClick={() => setActiveTab("add")} className="font-display" style={{ marginTop: 12, padding: "12px 24px", borderRadius: 12, border: "none", background: "#0052cc", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>Add a Task</button>
              </div>
            ) : tasks.map(task => {
              const cfg = taskTypeConfig[task.task_type] ?? taskTypeConfig["chore"];
              return (
                <div key={task.id} className="glass-card" style={{ borderRadius: 16, padding: 16 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: cfg.bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: cfg.color }}>{cfg.icon}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <p className="font-display" style={{ fontSize: 15, fontWeight: 800, color: "#051a3e", margin: "0 0 4px", lineHeight: 1.2 }}>{task.title}</p>
                        <span className="font-display" style={{ fontSize: 16, fontWeight: 900, color: "#2e6c00", flexShrink: 0, marginLeft: 8 }}>${task.reward.toFixed(2)}</span>
                      </div>
                      <p style={{ fontSize: 13, color: "#434654", margin: "0 0 8px" }}>{task.description}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="font-mono" style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: task.status === "approved" ? "#e8f5e9" : task.status === "pending_review" ? "#deecff" : "#f1f3ff", color: task.status === "approved" ? "#006e2a" : task.status === "pending_review" ? "#0052cc" : "#737685", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {task.status === "pending_review" ? "Pending Approval" : task.status ?? "Not done"}
                        </span>
                        <button onClick={() => handleDelete(task.id)} disabled={deletingId === task.id} style={{ padding: "4px 10px", borderRadius: 8, border: "1px solid #ffcdd2", background: "#fff0f0", color: "#ba1a1a", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                          {deletingId === task.id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add task tab */}
        {activeTab === "add" && (
          <form onSubmit={handleAddTask} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="glass-card" style={{ borderRadius: 16, padding: 18 }}>
              <p className="font-display" style={{ fontSize: 18, fontWeight: 800, color: "#051a3e", margin: "0 0 16px" }}>New Task</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label className="font-mono" style={{ fontSize: 11, color: "#737685", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Task Title</label>
                  <input value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Clean the bathroom"
                    style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "1.5px solid #e1e8ff", fontSize: 15, color: "#051a3e", background: "#fff", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label className="font-mono" style={{ fontSize: 11, color: "#737685", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Description</label>
                  <textarea rows={3} value={newTask.description} onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))} placeholder="Tell them exactly what to do..."
                    style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "1.5px solid #e1e8ff", fontSize: 15, color: "#051a3e", background: "#fff", outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                </div>
                <div>
                  <label className="font-mono" style={{ fontSize: 11, color: "#737685", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Task Type</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {(["chore", "homework", "exercise"] as const).map(type => {
                      const cfg = taskTypeConfig[type];
                      return (
                        <button key={type} type="button" onClick={() => setNewTask(p => ({ ...p, task_type: type }))}
                          style={{ padding: "12px 0", borderRadius: 12, border: newTask.task_type === type ? `2px solid ${cfg.color}` : "1.5px solid #e1e8ff", background: newTask.task_type === type ? cfg.bg : "#fff", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 20, color: cfg.color }}>{cfg.icon}</span>
                          <span className="font-mono" style={{ fontSize: 11, color: cfg.color, textTransform: "capitalize", fontWeight: 500 }}>{type}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="font-mono" style={{ fontSize: 11, color: "#737685", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Reward ($)</label>
                  <input type="number" value={newTask.reward} onChange={e => setNewTask(p => ({ ...p, reward: e.target.value }))} placeholder="e.g. 2.50" step="0.25" min="0"
                    style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "1.5px solid #e1e8ff", fontSize: 15, color: "#051a3e", background: "#fff", outline: "none", boxSizing: "border-box" }} />
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={newTask.requires_parent_approval} onChange={e => setNewTask(p => ({ ...p, requires_parent_approval: e.target.checked }))} style={{ width: 18, height: 18, accentColor: "#0052cc" }} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#051a3e", margin: 0 }}>Require my approval</p>
                    <p style={{ fontSize: 12, color: "#737685", margin: "2px 0 0" }}>You&apos;ll review AI verdict before paying</p>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" disabled={addStatus === "adding" || !newTask.title || !newTask.reward} className="font-display"
              style={{ width: "100%", padding: "16px 0", borderRadius: 16, border: "none", background: addStatus === "done" ? "#006e2a" : "#0052cc", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", opacity: !newTask.title || !newTask.reward ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {addStatus === "adding" ? "Adding…" : addStatus === "done" ? (
                <><span className="material-symbols-outlined" style={{ fontSize: 20 }}>check</span> Task Added!</>
              ) : <><span className="material-symbols-outlined" style={{ fontSize: 20 }}>add_circle</span> Add Task</>}
            </button>
          </form>
        )}
      </div>

      {/* Bottom Nav */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid #e1e8ff", height: 80, display: "flex", justifyContent: "space-around", alignItems: "center", paddingBottom: "env(safe-area-inset-bottom, 0px)", zIndex: 50 }}>
        {[
          { icon: "dashboard", label: "Overview", tab: "overview" },
          { icon: "assignment", label: "Tasks", tab: "tasks" },
          { icon: "add_circle", label: "Add", tab: "add" },
        ].map(item => {
          const active = activeTab === item.tab;
          return (
            <div key={item.label} onClick={() => setActiveTab(item.tab as typeof activeTab)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: active ? "#0052cc" : "#737685", fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
              <span className="font-mono" style={{ fontSize: 10, color: active ? "#0052cc" : "#737685", fontWeight: 500 }}>{item.label}</span>
            </div>
          );
        })}
      </nav>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

export default function ParentDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", reward: "", task_type: "chore", requires_parent_approval: false });
  const [balance, setBalance] = useState(20.0);
  const [weeklyBudget] = useState(20.0);
  const [activeSection, setActiveSection] = useState("overview");
  const [pendingApprovals, setPendingApprovals] = useState<Task[]>([]);
  const [addStatus, setAddStatus] = useState<"idle" | "adding" | "done" | "error">("idle");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { loadData(); }, []);

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
      if (res.ok) { setAddStatus("done"); setNewTask({ title: "", description: "", reward: "", task_type: "chore", requires_parent_approval: false }); await loadData(); setTimeout(() => setAddStatus("idle"), 2000); }
      else setAddStatus("error");
    } catch { setAddStatus("error"); }
  }

  async function handleApprove(taskId: string) {
    await fetch("/api/tasks", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ taskId, action: "approve", kidId: KID_ID }) });
    await loadData();
  }

  async function handleDelete(taskId: string) {
    setDeletingId(taskId);
    await fetch(`/api/tasks?taskId=${taskId}`, { method: "DELETE" });
    await loadData();
    setDeletingId(null);
  }

  const completedCount = tasks.filter(t => t.status === "approved").length;
  const pendingCount = tasks.filter(t => t.status === "pending_review").length;
  const earnedTotal = tasks.filter(t => t.status === "approved").reduce((s, t) => s + t.reward, 0);
  const spent = weeklyBudget - balance;
  const pct = Math.min((balance / weeklyBudget) * 100, 100);

  const navItems = [
    { id: "overview",  label: "Overview"  },
    { id: "tasks",     label: "Tasks"     },
    { id: "approvals", label: "Approvals", badge: pendingApprovals.length },
    { id: "budget",    label: "Budget"    },
    { id: "settings",  label: "Settings"  },
  ];

  const taskTypeLabel: Record<string, string> = { chore: "Chore", homework: "Homework", exercise: "Exercise" };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "248px 1fr", minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif", background: "#f8f9fa", color: "#374151" }}>

      {/* ── Sidebar ── */}
      <aside style={{ background: "#fff", borderRight: "1px solid #e5e7eb", padding: "18px 14px", display: "flex", flexDirection: "column", gap: 4, position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, padding: "2px 8px 16px", textDecoration: "none" }}>
          <span style={{ width: 28, height: 28, borderRadius: 8, background: "#111", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 16 }}>R</span>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#111", letterSpacing: "-0.02em" }}>Redefine</span>
        </Link>

        {navItems.map(item => (
          <button key={item.id} onClick={() => setActiveSection(item.id)}
            style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 10px", borderRadius: 8, border: "none", background: activeSection === item.id ? "#eef0fe" : "transparent", color: activeSection === item.id ? "#312e81" : "#6b7280", fontWeight: activeSection === item.id ? 600 : 500, fontSize: 14, cursor: "pointer", textAlign: "left", width: "100%" }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: activeSection === item.id ? "#4f46e5" : "currentColor", opacity: activeSection === item.id ? 1 : 0.4, flexShrink: 0 }} />
            {item.label}
            {item.badge ? (
              <span style={{ marginLeft: "auto", background: "#fde8f3", color: "#c41d6f", fontSize: 12, fontWeight: 600, padding: "3px 8px", borderRadius: 999 }}>{item.badge}</span>
            ) : null}
          </button>
        ))}

        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderTop: "1px solid #e5e7eb" }}>
          <span style={{ width: 36, height: 36, borderRadius: "50%", background: "#fb923c", color: "#fff", display: "grid", placeItems: "center", fontWeight: 600, fontSize: 14, flexShrink: 0 }}>P</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: "#111" }}>Parent</div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              <Link href="/parent/login" style={{ color: "#6b7280", textDecoration: "none" }}>Sign out</Link>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div>
        {/* Topbar */}
        <header style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 5 }}>
          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 2 }}>Welcome back</div>
            <h1 style={{ fontWeight: 700, fontSize: 22, color: "#111", letterSpacing: "-0.3px" }}>
              {navItems.find(n => n.id === activeSection)?.label ?? "Dashboard"}
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {pendingApprovals.length > 0 && (
              <button onClick={() => setActiveSection("approvals")}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 14px", height: 40, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#111", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#c41d6f" }} />
                {pendingApprovals.length} pending
              </button>
            )}
            <button onClick={() => setActiveSection("tasks")}
              style={{ padding: "0 18px", height: 40, borderRadius: 8, border: "none", background: "#4f46e5", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
              + New task
            </button>
          </div>
        </header>

        <div style={{ padding: "28px 32px 56px", maxWidth: 1080 }}>

          {/* ══ OVERVIEW ══ */}
          {activeSection === "overview" && (
            <>
              {/* KPIs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  { label: "Jake's Balance",      val: `$${balance.toFixed(2)}`,    sub: `${pct.toFixed(0)}% of $${weeklyBudget} weekly budget`, subColor: "#0f8a5a" },
                  { label: "Tasks completed",      val: completedCount,              sub: `$${earnedTotal.toFixed(2)} earned back`,                subColor: "#0f8a5a" },
                  { label: "Pending approvals",    val: pendingCount,                sub: "Awaiting your review",                                  subColor: "#6b7280" },
                ].map(k => (
                  <div key={k.label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: "#6b7280" }}>{k.label}</div>
                    <div style={{ fontWeight: 700, fontSize: 34, letterSpacing: "-0.02em", color: "#111", marginTop: 8 }}>{k.val}</div>
                    <div style={{ fontSize: 14, marginTop: 4, color: k.subColor }}>{k.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
                {/* Pending approvals panel */}
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 style={{ fontWeight: 600, fontSize: 16, color: "#111" }}>Pending approvals</h3>
                    <button onClick={() => setActiveSection("approvals")} style={{ fontSize: 13, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>View all</button>
                  </div>
                  {pendingApprovals.length === 0 ? (
                    <p style={{ fontSize: 14, color: "#6b7280", textAlign: "center", padding: "20px 0" }}>No pending approvals</p>
                  ) : pendingApprovals.map(t => (
                    <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #e5e7eb" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 8, background: "#e4f9f1", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{t.title} · Jake</div>
                        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Photo proof · +${t.reward.toFixed(2)}</div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", color: "#6b7280", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>✕</button>
                        <button onClick={() => handleApprove(t.id)} style={{ width: 32, height: 32, borderRadius: 6, border: "none", background: "#4f46e5", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>✓</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Balance panel */}
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 style={{ fontWeight: 600, fontSize: 16, color: "#111" }}>Jake&apos;s balance</h3>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 16 }}>
                    <span style={{ width: 36, height: 36, borderRadius: "50%", background: "#8b5cf6", color: "#fff", display: "grid", placeItems: "center", fontWeight: 600, fontSize: 14, flexShrink: 0 }}>J</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>Jake · 14</div>
                      <div style={{ height: 6, borderRadius: 999, background: "#f5f5f5", marginTop: 8, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 999, background: "#34d399", width: `${pct}%` }} />
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 22, color: balance < 5 ? "#c41d6f" : "#0f8a5a" }}>${balance.toFixed(2)}</div>
                  </div>
                  <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
                      <span>Weekly budget</span><span style={{ color: "#111", fontWeight: 500 }}>${weeklyBudget.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
                      <span>Spent (screen time)</span><span style={{ color: "#c41d6f", fontWeight: 500 }}>${spent.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280" }}>
                      <span>Earned back (tasks)</span><span style={{ color: "#0f8a5a", fontWeight: 500 }}>+${earnedTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══ TASKS ══ */}
          {activeSection === "tasks" && (
            <>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <button onClick={() => setActiveSection("add")} style={{ padding: "0 18px", height: 40, borderRadius: 8, border: "none", background: "#4f46e5", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>+ New task</button>
              </div>
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
                {tasks.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "48px 0" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                    <p style={{ fontWeight: 600, fontSize: 18, color: "#374151" }}>No tasks yet</p>
                    <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Add your first task to get started.</p>
                    <button onClick={() => setActiveSection("add")} style={{ marginTop: 16, padding: "10px 24px", borderRadius: 8, border: "none", background: "#4f46e5", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Add a task</button>
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["Task", "Type", "Reward", "Verification", "Status", ""].map(h => (
                          <th key={h} style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: "#6b7280", textAlign: "left", padding: "0 16px 13px", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map(task => {
                        const statusLabel = task.status === "approved" ? "Done" : task.status === "pending_review" ? "Pending" : "Active";
                        const statusStyle = task.status === "approved"
                          ? { background: "#e4f9f1", color: "#0f8a5a" }
                          : task.status === "pending_review"
                          ? { background: "#fde8f3", color: "#c41d6f" }
                          : { background: "#eef0fe", color: "#4f46e5" };
                        return (
                          <tr key={task.id}>
                            <td style={{ padding: "15px 16px", borderTop: "1px solid #e5e7eb", fontWeight: 600, fontSize: 14, color: "#111" }}>{task.title}</td>
                            <td style={{ padding: "15px 16px", borderTop: "1px solid #e5e7eb" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 999, background: "#f5f5f5", fontSize: 12, fontWeight: 500, color: "#111" }}>{taskTypeLabel[task.task_type] ?? task.task_type}</span>
                            </td>
                            <td style={{ padding: "15px 16px", borderTop: "1px solid #e5e7eb", fontSize: 14, color: "#0f8a5a", fontWeight: 500 }}>+${task.reward.toFixed(2)}</td>
                            <td style={{ padding: "15px 16px", borderTop: "1px solid #e5e7eb", fontSize: 14, color: "#6b7280" }}>Photo · AI</td>
                            <td style={{ padding: "15px 16px", borderTop: "1px solid #e5e7eb" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, ...statusStyle }}>{statusLabel}</span>
                            </td>
                            <td style={{ padding: "15px 16px", borderTop: "1px solid #e5e7eb" }}>
                              <button onClick={() => handleDelete(task.id)} disabled={deletingId === task.id}
                                style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", color: "#6b7280", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                                {deletingId === task.id ? "…" : "Delete"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* ══ ADD TASK ══ */}
          {activeSection === "add" && (
            <form onSubmit={handleAddTask}>
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 28, maxWidth: 540 }}>
                <h3 style={{ fontWeight: 600, fontSize: 18, color: "#111", marginBottom: 24 }}>New Task</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Task title</label>
                    <input value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Clean the bathroom"
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, color: "#111", outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Description</label>
                    <textarea rows={3} value={newTask.description} onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))} placeholder="Tell them exactly what to do..."
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, color: "#111", outline: "none", resize: "none", fontFamily: "inherit" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Task type</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {(["chore", "homework", "exercise"] as const).map(type => (
                        <button key={type} type="button" onClick={() => setNewTask(p => ({ ...p, task_type: type }))}
                          style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: newTask.task_type === type ? "2px solid #4f46e5" : "1px solid #e5e7eb", background: newTask.task_type === type ? "#eef0fe" : "#fff", color: newTask.task_type === type ? "#4338ca" : "#6b7280", fontWeight: 600, fontSize: 13, cursor: "pointer", textTransform: "capitalize" }}>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Reward ($)</label>
                    <input type="number" value={newTask.reward} onChange={e => setNewTask(p => ({ ...p, reward: e.target.value }))} placeholder="e.g. 2.50" step="0.25" min="0"
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, color: "#111", outline: "none" }} />
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                    <input type="checkbox" checked={newTask.requires_parent_approval} onChange={e => setNewTask(p => ({ ...p, requires_parent_approval: e.target.checked }))}
                      style={{ width: 18, height: 18, accentColor: "#4f46e5" }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>Require my approval</div>
                      <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>You&apos;ll review the AI verdict before money is released</div>
                    </div>
                  </label>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button type="button" onClick={() => setActiveSection("tasks")}
                  style={{ padding: "0 18px", height: 40, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" disabled={addStatus === "adding" || !newTask.title || !newTask.reward}
                  style={{ padding: "0 24px", height: 40, borderRadius: 8, border: "none", background: addStatus === "done" ? "#0f8a5a" : "#4f46e5", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", opacity: !newTask.title || !newTask.reward ? 0.5 : 1 }}>
                  {addStatus === "adding" ? "Adding…" : addStatus === "done" ? "✓ Task added!" : "Add task"}
                </button>
              </div>
            </form>
          )}

          {/* ══ APPROVALS ══ */}
          {activeSection === "approvals" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 22 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ fontWeight: 600, fontSize: 16, color: "#111" }}>Needs review</h3>
                  <span style={{ fontSize: 13, color: "#6b7280" }}>{pendingApprovals.length} pending</span>
                </div>
                {pendingApprovals.length === 0 ? (
                  <p style={{ fontSize: 14, color: "#6b7280", textAlign: "center", padding: "20px 0" }}>All caught up! No pending approvals.</p>
                ) : pendingApprovals.map(t => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #e5e7eb" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: "#e4f9f1", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{t.title}</div>
                      <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Photo proof · +${t.reward.toFixed(2)}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", color: "#6b7280", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>✕</button>
                      <button onClick={() => handleApprove(t.id)} style={{ width: 32, height: 32, borderRadius: 6, border: "none", background: "#4f46e5", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>✓</button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 22 }}>
                <h3 style={{ fontWeight: 600, fontSize: 16, color: "#111", marginBottom: 16 }}>Recently approved</h3>
                {tasks.filter(t => t.status === "approved").length === 0 ? (
                  <p style={{ fontSize: 14, color: "#6b7280" }}>No approved tasks yet.</p>
                ) : tasks.filter(t => t.status === "approved").map(t => (
                  <div key={t.id} style={{ display: "flex", gap: 12, padding: "11px 0", borderBottom: "1px solid #f5f5f5" }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#e4f9f1", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 14, color: "#111" }}><strong>Jake</strong> · {t.title} <span style={{ color: "#0f8a5a" }}>+${t.reward.toFixed(2)}</span></div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>AI verified · approved</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ BUDGET ══ */}
          {activeSection === "budget" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  { label: "Weekly budget",  val: `$${weeklyBudget.toFixed(2)}`, sub: "Resets Monday",             subColor: "#6b7280" },
                  { label: "Spent",          val: `$${spent.toFixed(2)}`,         sub: `${(100-pct).toFixed(0)}% of budget`, subColor: "#c41d6f" },
                  { label: "Remaining",      val: `$${balance.toFixed(2)}`,        sub: "Jake's current balance",  subColor: "#0f8a5a" },
                ].map(k => (
                  <div key={k.label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: "#6b7280" }}>{k.label}</div>
                    <div style={{ fontWeight: 700, fontSize: 34, letterSpacing: "-0.02em", color: "#111", marginTop: 8 }}>{k.val}</div>
                    <div style={{ fontSize: 14, marginTop: 4, color: k.subColor }}>{k.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 22 }}>
                <h3 style={{ fontWeight: 600, fontSize: 16, color: "#111", marginBottom: 20 }}>Jake&apos;s allowance</h3>
                <div style={{ padding: "16px 0", borderTop: "1px solid #e5e7eb" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 14, fontWeight: 500, color: "#111" }}>
                    <span>Jake</span>
                    <span style={{ color: "#6b7280", fontWeight: 400 }}>${spent.toFixed(2)} spent · ${weeklyBudget.toFixed(2)}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: "#f5f5f5", overflow: "hidden", marginTop: 9 }}>
                    <div style={{ height: "100%", borderRadius: 999, background: "#34d399", width: `${100-pct}%` }} />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══ SETTINGS ══ */}
          {activeSection === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 640 }}>
              {/* Account */}
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 22 }}>
                <h3 style={{ fontWeight: 600, fontSize: 16, color: "#111", marginBottom: 12 }}>Account</h3>
                {[{ k: "Email", d: "parent@test.com" }, { k: "Password", d: "Last changed 3 months ago" }].map((row, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: "17px 0", borderTop: "1px solid #e5e7eb" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{row.k}</div>
                      <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>{row.d}</div>
                    </div>
                    <button style={{ padding: "0 13px", height: 34, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#111", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Edit</button>
                  </div>
                ))}
              </div>

              {/* Family preferences */}
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 22 }}>
                <h3 style={{ fontWeight: 600, fontSize: 16, color: "#111", marginBottom: 12 }}>Family preferences</h3>
                {[
                  { k: "Auto-approve AI-verified tasks", d: "Release money instantly when both models agree it's done.", on: true },
                  { k: "Pause all apps at bedtime", d: "Lock social apps from 9:00 PM to 7:00 AM.", on: true },
                  { k: "Weekend rollover", d: "Let unspent allowance carry into the next week.", on: false },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: "17px 0", borderTop: "1px solid #e5e7eb" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{row.k}</div>
                      <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>{row.d}</div>
                    </div>
                    <div style={{ width: 42, height: 25, borderRadius: 999, background: row.on ? "#4f46e5" : "#f5f5f5", border: `1px solid ${row.on ? "#4f46e5" : "#e5e7eb"}`, position: "relative", flexShrink: 0 }}>
                      <div style={{ position: "absolute", top: 2, ...(row.on ? { right: 2 } : { left: 2 }), width: 19, height: 19, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Plan */}
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 22 }}>
                <h3 style={{ fontWeight: 600, fontSize: 16, color: "#111", marginBottom: 12 }}>Plan</h3>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: "17px 0", borderTop: "1px solid #e5e7eb" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>Current plan</div>
                    <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>First child free forever · then $9.99/month for the whole family.</div>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 999, background: "#e4f9f1", color: "#0f8a5a", fontSize: 12, fontWeight: 600 }}>Free</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

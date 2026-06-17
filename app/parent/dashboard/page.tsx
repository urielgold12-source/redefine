"use client";

import { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import BalanceCard from "@/components/BalanceCard";
import BottomNav, { NavItem } from "@/components/BottomNav";

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

const typeConfig: Record<string, { icon: string; textColor: string; bgColor: string }> = {
  chore:    { icon: "cleaning_services", textColor: "text-chore",    bgColor: "bg-chore-bg"    },
  homework: { icon: "menu_book",         textColor: "text-homework",  bgColor: "bg-homework-bg" },
  exercise: { icon: "fitness_center",    textColor: "text-exercise",  bgColor: "bg-exercise-bg" },
};

const NAV_ITEMS: NavItem[] = [
  { icon: "dashboard",  label: "Overview", value: "overview" },
  { icon: "assignment", label: "Tasks",    value: "tasks"    },
  { icon: "add_circle", label: "Add",      value: "add"      },
];

export default function ParentDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", reward: "", task_type: "chore", requires_parent_approval: false });
  const [balance, setBalance] = useState(20.0);
  const [weeklyBudget] = useState(20.0);
  const [activeTab, setActiveTab] = useState("overview");
  const [pendingApprovals, setPendingApprovals] = useState<Task[]>([]);
  const [addStatus, setAddStatus] = useState<"idle" | "adding" | "done" | "error">("idle");
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
    if (kidRes.ok) {
      const d = await kidRes.json();
      setBalance(d.balance);
    }
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.title || !newTask.reward) return;
    setAddStatus("adding");
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newTask, reward: parseFloat(newTask.reward), kid_id: KID_ID }),
      });
      if (res.ok) {
        setAddStatus("done");
        setNewTask({ title: "", description: "", reward: "", task_type: "chore", requires_parent_approval: false });
        await loadData();
        setTimeout(() => setAddStatus("idle"), 2000);
      } else {
        setAddStatus("error");
      }
    } catch {
      setAddStatus("error");
    }
  }

  async function handleApprove(taskId: string) {
    await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, action: "approve", kidId: KID_ID }),
    });
    await loadData();
  }

  async function handleDelete(taskId: string) {
    setDeletingId(taskId);
    await fetch(`/api/tasks?taskId=${taskId}`, { method: "DELETE" });
    await loadData();
    setDeletingId(null);
  }

  const completedCount = tasks.filter((t) => t.status === "approved").length;
  const pendingCount = tasks.filter((t) => t.status === "pending_review").length;
  const waitingCount = tasks.filter((t) => !t.status || t.status === "idle").length;
  const earnedTotal = tasks.filter((t) => t.status === "approved").reduce((s, t) => s + t.reward, 0);

  return (
    <main className="bg-background min-h-dvh pb-24">

      {/* Top nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-outline h-16 flex items-center justify-between px-5">
        <Logo />
        <div className="flex items-center gap-2">
          {pendingApprovals.length > 0 && (
            <div className="w-5 h-5 rounded-full bg-error flex items-center justify-center">
              <span className="font-mono text-[11px] text-white font-bold">{pendingApprovals.length}</span>
            </div>
          )}
          <div className="font-display w-8 h-8 rounded-full bg-secondary-container text-secondary flex items-center justify-center font-black text-[13px]">
            P
          </div>
          <span className="text-sm font-medium text-on-variant">Parent</span>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto px-5 pt-5">

        {/* Balance card — dark mode for parent view */}
        <BalanceCard balance={balance} weeklyBudget={weeklyBudget} name="Jake's" darkMode={true} />

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { icon: "task_alt",       label: "Done",    value: completedCount, textColor: "text-chore",    bgColor: "bg-chore-bg"    },
            { icon: "pending",        label: "Pending", value: pendingCount,   textColor: "text-homework",  bgColor: "bg-homework-bg" },
            { icon: "hourglass_empty",label: "Waiting", value: waitingCount,   textColor: "text-exercise",  bgColor: "bg-exercise-bg" },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-[14px] p-3 text-center">
              <div className={`w-9 h-9 rounded-[10px] ${s.bgColor} flex items-center justify-center mx-auto mb-1.5`}>
                <span className={`material-symbols-outlined text-lg ${s.textColor}`}>{s.icon}</span>
              </div>
              <p className="font-display text-[22px] font-black text-on-surface m-0">{s.value}</p>
              <p className="font-mono text-[10px] text-muted uppercase tracking-wider m-0">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Pending approvals */}
        {pendingApprovals.length > 0 && (
          <div className="mb-5">
            <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-2.5">Needs your approval</p>
            <div className="flex flex-col gap-2.5">
              {pendingApprovals.map((t) => (
                <div key={t.id} className="glass-card rounded-[16px] p-4 border-pending-border bg-pending-bg/30">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-display text-base font-black text-on-surface m-0 mb-1">{t.title}</p>
                      <p className="text-[13px] text-on-variant m-0">{t.description}</p>
                    </div>
                    <span className="font-display text-lg font-black text-chore flex-shrink-0 ml-3">${t.reward.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => handleApprove(t.id)}
                    className="font-display w-full py-3 rounded-[12px] border-none bg-secondary text-white font-black text-sm cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-lg">check</span>
                    Approve &amp; Pay
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Segmented control */}
        <div className="bg-surface-container rounded-[14px] p-1 flex gap-1 mb-5">
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.value;
            return (
              <button
                key={item.value}
                onClick={() => setActiveTab(item.value)}
                className={`flex-1 py-2.5 rounded-[10px] border-none text-[13px] cursor-pointer transition-colors ${
                  active ? "font-display font-black text-on-surface bg-surface shadow-sm" : "font-medium text-muted bg-transparent"
                }`}
              >
                {item.value === "add" ? "+ Add Task" : item.label}
              </button>
            );
          })}
        </div>

        {/* ── Overview tab ── */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-3">
            <div className="glass-card rounded-[16px] p-[18px]">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="material-symbols-outlined text-xl text-primary">phone_iphone</span>
                <p className="font-display text-base font-black text-on-surface m-0">Screen Time Today</p>
              </div>
              <p className="font-display text-[38px] font-black text-error m-0 mb-1">2h 34m</p>
              <p className="font-mono text-xs text-muted m-0">TikTok: 1h 12m · Instagram: 52m · YouTube: 30m</p>
            </div>

            <div className="glass-card rounded-[16px] p-[18px]">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="material-symbols-outlined text-xl text-chore">trending_up</span>
                <p className="font-display text-base font-black text-on-surface m-0">This Week</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Tasks completed", value: completedCount },
                  { label: "Money earned",    value: `$${earnedTotal.toFixed(2)}` },
                ].map((m) => (
                  <div key={m.label}>
                    <p className="font-display text-[26px] font-black text-on-surface m-0">{m.value}</p>
                    <p className="font-mono text-[11px] text-muted uppercase tracking-wider m-0 mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tasks tab ── */}
        {activeTab === "tasks" && (
          <div className="flex flex-col gap-3">
            {tasks.length === 0 ? (
              <div className="text-center py-10">
                <span className="material-symbols-outlined text-[48px] text-outline">assignment</span>
                <p className="font-display text-lg font-black text-on-variant mt-2">No tasks yet</p>
                <p className="text-sm text-muted">Add your first task to get started.</p>
                <button
                  onClick={() => setActiveTab("add")}
                  className="font-display mt-3 px-6 py-3 rounded-[12px] border-none bg-primary text-white font-black text-sm cursor-pointer"
                >
                  Add a Task
                </button>
              </div>
            ) : (
              tasks.map((task) => {
                const cfg = typeConfig[task.task_type] ?? typeConfig["chore"];
                const statusLabel =
                  task.status === "approved" ? "Approved" :
                  task.status === "pending_review" ? "Pending Approval" :
                  "Not done";
                const statusColor =
                  task.status === "approved" ? "bg-chore-bg text-chore" :
                  task.status === "pending_review" ? "bg-homework-bg text-homework" :
                  "bg-surface-container text-muted";

                return (
                  <div key={task.id} className="glass-card rounded-[16px] p-4">
                    <div className="flex gap-3 items-start">
                      <div className={`w-10 h-10 rounded-[12px] ${cfg.bgColor} flex-shrink-0 flex items-center justify-center`}>
                        <span className={`material-symbols-outlined text-xl ${cfg.textColor}`}>{cfg.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-display text-[15px] font-black text-on-surface m-0 mb-1 leading-snug">{task.title}</p>
                          <span className="font-display text-base font-black text-chore flex-shrink-0 ml-2">${task.reward.toFixed(2)}</span>
                        </div>
                        <p className="text-[13px] text-on-variant m-0 mb-2">{task.description}</p>
                        <div className="flex justify-between items-center">
                          <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${statusColor}`}>
                            {statusLabel}
                          </span>
                          <button
                            onClick={() => handleDelete(task.id)}
                            disabled={deletingId === task.id}
                            className="px-2.5 py-1 rounded-lg border border-error/30 bg-error-light text-error text-xs font-semibold cursor-pointer disabled:opacity-50"
                          >
                            {deletingId === task.id ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── Add task tab ── */}
        {activeTab === "add" && (
          <form onSubmit={handleAddTask} className="flex flex-col gap-4">
            <div className="glass-card rounded-[16px] p-[18px]">
              <p className="font-display text-lg font-black text-on-surface m-0 mb-4">New Task</p>
              <div className="flex flex-col gap-3.5">
                <div>
                  <label className="font-mono text-[11px] text-muted uppercase tracking-widest block mb-1.5">Task Title</label>
                  <input
                    value={newTask.title}
                    onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Clean the bathroom"
                    className="w-full px-4 py-3.5 rounded-[14px] border-[1.5px] border-outline text-[15px] text-on-surface bg-surface outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] text-muted uppercase tracking-widest block mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    value={newTask.description}
                    onChange={(e) => setNewTask((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Tell them exactly what to do..."
                    className="w-full px-4 py-3.5 rounded-[14px] border-[1.5px] border-outline text-[15px] text-on-surface bg-surface outline-none resize-none font-inherit"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] text-muted uppercase tracking-widest block mb-1.5">Task Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["chore", "homework", "exercise"] as const).map((type) => {
                      const cfg = typeConfig[type];
                      const selected = newTask.task_type === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewTask((p) => ({ ...p, task_type: type }))}
                          className={`py-3 rounded-[12px] flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                            selected ? `border-2 ${cfg.bgColor} ${cfg.textColor}` : "border border-outline bg-surface"
                          }`}
                          style={{ borderColor: selected ? undefined : undefined }}
                        >
                          <span className={`material-symbols-outlined text-xl ${cfg.textColor}`}>{cfg.icon}</span>
                          <span className={`font-mono text-[11px] font-medium capitalize ${cfg.textColor}`}>{type}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="font-mono text-[11px] text-muted uppercase tracking-widest block mb-1.5">Reward ($)</label>
                  <input
                    type="number"
                    value={newTask.reward}
                    onChange={(e) => setNewTask((p) => ({ ...p, reward: e.target.value }))}
                    placeholder="e.g. 2.50"
                    step="0.25"
                    min="0"
                    className="w-full px-4 py-3.5 rounded-[14px] border-[1.5px] border-outline text-[15px] text-on-surface bg-surface outline-none"
                  />
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newTask.requires_parent_approval}
                    onChange={(e) => setNewTask((p) => ({ ...p, requires_parent_approval: e.target.checked }))}
                    className="w-[18px] h-[18px] accent-primary"
                  />
                  <div>
                    <p className="text-sm font-semibold text-on-surface m-0">Require my approval</p>
                    <p className="text-xs text-muted m-0 mt-0.5">You&apos;ll review AI verdict before paying</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={addStatus === "adding" || !newTask.title || !newTask.reward}
              className={`font-display w-full py-4 rounded-[16px] border-none font-black text-base text-white cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 ${
                addStatus === "done" ? "bg-secondary" : "bg-primary"
              }`}
            >
              {addStatus === "adding" ? (
                "Adding…"
              ) : addStatus === "done" ? (
                <>
                  <span className="material-symbols-outlined text-xl">check</span>
                  Task Added!
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">add_circle</span>
                  Add Task
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <BottomNav items={NAV_ITEMS} active={activeTab} onChange={setActiveTab} />
    </main>
  );
}

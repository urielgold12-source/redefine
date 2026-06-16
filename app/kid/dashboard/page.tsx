"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type TaskType = "chore" | "homework" | "exercise";
type TaskStatus = "idle" | "verifying" | "approved" | "rejected" | "pending_parent";

type Task = {
  id: string;
  title: string;
  reward: number;
  description: string;
  task_type: TaskType;
  requires_parent_approval: boolean;
  status: string;
};

const taskTypeConfig: Record<string, { icon: string; label: string; color: string; bg: string }> = {
  chore:    { icon: "cleaning_services", label: "Chore",    color: "#006e2a", bg: "#e8f5e9" },
  homework: { icon: "menu_book",         label: "Homework", color: "#0052cc", bg: "#deecff" },
  exercise: { icon: "fitness_center",    label: "Exercise", color: "#6554c0", bg: "#ecdfff" },
};

const KID_ID = "3773eeac-6e2c-4d2f-8521-5ba7f16629cf";

export default function KidDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [balance, setBalance] = useState(20.00);
  const [weeklyBudget] = useState(20.00);
  const [taskStatuses, setTaskStatuses] = useState<Record<string, TaskStatus>>({});
  const [taskPhotos, setTaskPhotos] = useState<Record<string, string>>({});
  const [taskFeedback, setTaskFeedback] = useState<Record<string, { reason: string; feedback?: string; questionsChecked?: number; correctAnswers?: number }>>({});
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [linkInputs, setLinkInputs] = useState<Record<string, string>>({});
  const [showLinkInput, setShowLinkInput] = useState<Record<string, boolean>>({});
  const [pastedText, setPastedText] = useState<Record<string, string>>({});
  const [showPasteInput, setShowPasteInput] = useState<Record<string, boolean>>({});
  const [failCounts, setFailCounts] = useState<Record<string, number>>({});
  const [parentAlerted, setParentAlerted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      const res = await fetch(`/api/tasks?kidId=${KID_ID}`);
      const data = await res.json();
      setTasks(data);
      const statuses: Record<string, TaskStatus> = {};
      data.forEach((t: Task) => {
        if (t.status === "approved") statuses[t.id] = "approved";
        else if (t.status === "pending_review") statuses[t.id] = "pending_parent";
        else statuses[t.id] = "idle";
      });
      setTaskStatuses(statuses);
      const kidRes = await fetch(`/api/kid?kidId=${KID_ID}`);
      if (kidRes.ok) { const d = await kidRes.json(); setBalance(d.balance); }
    }
    loadData();
  }, []);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  async function openCamera(taskId: string) {
    setActiveTask(taskId); setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 100);
    } catch { alert("Could not access camera."); setCameraOpen(false); }
  }

  function closeCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null; setCameraOpen(false);
  }

  async function captureAndVerify() {
    if (!videoRef.current || !activeTask) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    const photo = canvas.toDataURL("image/jpeg");
    closeCamera();
    const task = tasks.find(t => t.id === activeTask);
    setTaskPhotos(p => ({ ...p, [activeTask]: photo }));
    setTaskStatuses(p => ({ ...p, [activeTask]: "verifying" }));
    try {
      const res = await fetch("/api/verify-task", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: photo, taskTitle: task?.title, taskDescription: task?.description, taskType: task?.task_type, requiresParentApproval: task?.requires_parent_approval, taskId: activeTask, kidId: KID_ID }) });
      const data = await res.json();
      setTaskFeedback(p => ({ ...p, [activeTask]: data }));
      if (data.pendingParentApproval) setTaskStatuses(p => ({ ...p, [activeTask]: "pending_parent" }));
      else if (data.approved) { setTaskStatuses(p => ({ ...p, [activeTask]: "approved" })); setBalance(p => p + (typeof task?.reward === "number" ? task.reward : parseFloat(String(task?.reward ?? "0")))); }
      else { setTaskStatuses(p => ({ ...p, [activeTask]: "rejected" })); handleRejection(activeTask, task?.title ?? ""); }
    } catch { setTaskStatuses(p => ({ ...p, [activeTask]: "rejected" })); handleRejection(activeTask, task?.title ?? ""); }
  }

  async function submitLink(taskId: string) {
    const link = linkInputs[taskId]; if (!link) return;
    const task = tasks.find(t => t.id === taskId);
    setTaskStatuses(p => ({ ...p, [taskId]: "verifying" })); setShowLinkInput(p => ({ ...p, [taskId]: false }));
    try {
      const res = await fetch("/api/verify-task", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ link, taskTitle: task?.title, taskDescription: task?.description, taskType: task?.task_type, requiresParentApproval: task?.requires_parent_approval }) });
      const data = await res.json(); setTaskFeedback(p => ({ ...p, [taskId]: data }));
      if (data.pendingParentApproval) setTaskStatuses(p => ({ ...p, [taskId]: "pending_parent" }));
      else if (data.approved) { setTaskStatuses(p => ({ ...p, [taskId]: "approved" })); setBalance(p => p + (typeof task?.reward === "number" ? task.reward : parseFloat(String(task?.reward ?? "0")))); }
      else { setTaskStatuses(p => ({ ...p, [taskId]: "rejected" })); handleRejection(taskId, task?.title ?? ""); }
    } catch { setTaskStatuses(p => ({ ...p, [taskId]: "rejected" })); handleRejection(taskId, task?.title ?? ""); }
  }

  function handleRejection(taskId: string, taskTitle: string) {
    setFailCounts(p => {
      const n = (p[taskId] ?? 0) + 1;
      if (n >= 2) { setParentAlerted(p => ({ ...p, [taskId]: true })); console.log(`PARENT ALERT: ${taskTitle} failed ${n} times`); }
      return { ...p, [taskId]: n };
    });
  }

  async function handleScreenshot(taskId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const task = tasks.find(t => t.id === taskId);
    const reader = new FileReader();
    reader.onload = async () => {
      const image = reader.result as string;
      setTaskPhotos(p => ({ ...p, [taskId]: image }));
      setTaskStatuses(p => ({ ...p, [taskId]: "verifying" }));
      try {
        const res = await fetch("/api/verify-task", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image, taskTitle: task?.title, taskDescription: task?.description, taskType: task?.task_type, requiresParentApproval: task?.requires_parent_approval }) });
        const data = await res.json(); setTaskFeedback(p => ({ ...p, [taskId]: data }));
        if (data.pendingParentApproval) setTaskStatuses(p => ({ ...p, [taskId]: "pending_parent" }));
        else if (data.approved) { setTaskStatuses(p => ({ ...p, [taskId]: "approved" })); setBalance(p => p + (typeof task?.reward === "number" ? task.reward : parseFloat(String(task?.reward ?? "0")))); }
        else { setTaskStatuses(p => ({ ...p, [taskId]: "rejected" })); }
      } catch { setTaskStatuses(p => ({ ...p, [taskId]: "rejected" })); handleRejection(taskId, task?.title ?? ""); }
    };
    reader.readAsDataURL(file);
  }

  async function submitPastedText(taskId: string) {
    const text = pastedText[taskId]; if (!text) return;
    const task = tasks.find(t => t.id === taskId);
    setTaskStatuses(p => ({ ...p, [taskId]: "verifying" })); setShowPasteInput(p => ({ ...p, [taskId]: false }));
    try {
      const res = await fetch("/api/verify-task", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pastedText: text, taskTitle: task?.title, taskDescription: task?.description, taskType: task?.task_type, requiresParentApproval: task?.requires_parent_approval, taskId, kidId: KID_ID }) });
      const data = await res.json(); setTaskFeedback(p => ({ ...p, [taskId]: data }));
      if (data.pendingParentApproval) setTaskStatuses(p => ({ ...p, [taskId]: "pending_parent" }));
      else if (data.approved) { setTaskStatuses(p => ({ ...p, [taskId]: "approved" })); setBalance(p => p + (typeof task?.reward === "number" ? task.reward : parseFloat(String(task?.reward ?? "0")))); }
      else { setTaskStatuses(p => ({ ...p, [taskId]: "rejected" })); handleRejection(taskId, task?.title ?? ""); }
    } catch { setTaskStatuses(p => ({ ...p, [taskId]: "rejected" })); handleRejection(taskId, task?.title ?? ""); }
  }

  const capped = Math.min(balance, weeklyBudget);
  const pct = (capped / weeklyBudget) * 100;

  return (
    <main style={{ backgroundColor: "#faf9ff", minHeight: "100dvh", paddingBottom: 96 }}>

      {/* Camera Modal */}
      {cameraOpen && activeTask && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "flex-end", padding: 16 }}>
          <div className="glass-card" style={{ borderRadius: 20, padding: 20, width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="font-display" style={{ fontSize: 18, fontWeight: 800, color: "#051a3e" }}>Take your proof photo</span>
              <button onClick={closeCamera} style={{ width: 32, height: 32, borderRadius: 999, background: "#f1f3ff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#434654" }}>close</span>
              </button>
            </div>
            <p style={{ fontSize: 14, color: "#434654", margin: 0 }}>{tasks.find(t => t.id === activeTask)?.description}</p>
            {tasks.find(t => t.id === activeTask)?.task_type === "homework" && (
              <div style={{ background: "#deecff", borderRadius: 12, padding: "10px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#0052cc", marginTop: 1 }}>auto_awesome</span>
                <div>
                  <p className="font-display" style={{ fontSize: 13, fontWeight: 700, color: "#0052cc", margin: 0 }}>Gemini AI will check your answers</p>
                  <p style={{ fontSize: 12, color: "#0040a2", margin: "2px 0 0" }}>Make sure all questions and answers are clearly visible</p>
                </div>
              </div>
            )}
            <video ref={videoRef} autoPlay playsInline style={{ width: "100%", borderRadius: 12, background: "#000" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={closeCamera} style={{ flex: 1, padding: "14px 0", borderRadius: 14, border: "1px solid #c3c6d6", background: "#fff", fontWeight: 700, fontSize: 14, color: "#434654", cursor: "pointer" }}>Cancel</button>
              <button onClick={captureAndVerify} className="font-display" style={{ flex: 1, padding: "14px 0", borderRadius: 14, border: "none", background: "#0052cc", fontWeight: 800, fontSize: 14, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>camera_alt</span> Submit Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e1e8ff", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div className="font-display" style={{ width: 32, height: 32, borderRadius: 10, background: "#0052cc", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14 }}>R</div>
          <span className="font-display" style={{ fontWeight: 800, fontSize: 16, color: "#0052cc" }}>Redefine</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="font-display" style={{ width: 32, height: 32, borderRadius: 999, background: "#deecff", color: "#0052cc", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>J</div>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#434654" }}>Jake</span>
        </div>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 20px 0" }}>

        {/* Balance hero */}
        <div style={{ background: "#0052cc", borderRadius: 20, padding: 20, marginBottom: 12, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -30, top: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Your Balance</span>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff6b6b", animation: "pulse 2s infinite" }} />
              <span className="font-mono" style={{ fontSize: 11, color: "#ff6b6b" }}>Draining</span>
            </div>
            <p className="font-display" style={{ fontSize: 52, fontWeight: 900, color: capped < 5 ? "#ff6b6b" : capped < 10 ? "#ffd166" : "#fff", margin: "0 0 16px", lineHeight: 1, letterSpacing: "-0.02em" }}>
              ${capped.toFixed(2)}
            </p>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 999, height: 6, marginBottom: 8 }}>
              <div style={{ height: 6, borderRadius: 999, width: `${Math.min(pct, 100)}%`, background: capped < 5 ? "#ff6b6b" : capped < 10 ? "#ffd166" : "#69ff87", transition: "width 0.3s" }} />
            </div>
            <span className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>${capped.toFixed(2)} of ${weeklyBudget.toFixed(2)} weekly budget</span>
          </div>
        </div>

        {/* Live pill */}
        <div style={{ background: "#fff0f0", border: "1px solid #ffcdd2", borderRadius: 14, padding: "12px 16px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ba1a1a", flexShrink: 0 }} />
          <div>
            <p className="font-display" style={{ fontSize: 14, fontWeight: 700, color: "#ba1a1a", margin: 0 }}>You are on TikTok right now</p>
            <p className="font-mono" style={{ fontSize: 12, color: "#c62828", margin: "2px 0 0" }}>$0.10/min draining your balance</p>
          </div>
        </div>

        {/* Section label */}
        <p className="font-mono" style={{ fontSize: 11, color: "#737685", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Earn it back</p>
        <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: "#051a3e", margin: "0 0 4px" }}>Complete a task</h2>
        <p style={{ fontSize: 14, color: "#434654", margin: "0 0 20px" }}>Finish a task, take a photo, and AI verifies it instantly.</p>

        {/* Task cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {tasks.map(task => {
            const status = taskStatuses[task.id] ?? "idle";
            const photo = taskPhotos[task.id];
            const feedback = taskFeedback[task.id];
            const cfg = taskTypeConfig[task.task_type] ?? taskTypeConfig["chore"];

            const cardBorder = status === "approved" ? "#b6f304" : status === "pending_parent" ? "#c4d2ff" : status === "rejected" ? "#ffcdd2" : status === "verifying" ? "#ffd166" : "#e1e8ff";
            const cardBg = status === "approved" ? "#f9ffe0" : status === "pending_parent" ? "#f1f3ff" : status === "rejected" ? "#fff0f0" : "#fff";

            return (
              <div key={task.id} className="glass-card" style={{ borderRadius: 18, padding: 18, borderColor: cardBorder, background: cardBg, transition: "border-color 0.2s" }}>

                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: cfg.bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 22, color: cfg.color }}>{cfg.icon}</span>
                    </div>
                    <div>
                      <p className="font-display" style={{ fontSize: 16, fontWeight: 800, color: "#051a3e", margin: "0 0 6px", lineHeight: 1.2 }}>{task.title}</p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <span className="font-mono" style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 999, background: cfg.bg, color: cfg.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>{cfg.label}</span>
                        {task.requires_parent_approval && <span className="font-mono" style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 999, background: "#ecdfff", color: "#6554c0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Parent approval</span>}
                      </div>
                    </div>
                  </div>
                  <span className="font-display" style={{ fontSize: 20, fontWeight: 900, color: "#2e6c00", flexShrink: 0 }}>${task.reward.toFixed(2)}</span>
                </div>

                <p style={{ fontSize: 13, color: "#434654", margin: "0 0 12px" }}>{task.description}</p>

                {/* Photo preview */}
                {photo && (
                  <div style={{ width: "100%", height: 140, position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 12, border: "1px solid #e1e8ff" }}>
                    <Image src={photo} alt="Task photo" fill style={{ objectFit: "cover" }} />
                  </div>
                )}

                {/* Status banners */}
                {status === "verifying" && (
                  <div style={{ background: "#fffbea", border: "1px solid #ffd166", borderRadius: 12, padding: "10px 14px", marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#b45309", animation: "spin 1s linear infinite" }}>progress_activity</span>
                    <div>
                      <p className="font-display" style={{ fontSize: 13, fontWeight: 700, color: "#b45309", margin: 0 }}>AI is checking your photo…</p>
                      {task.task_type === "homework" && <p style={{ fontSize: 12, color: "#92400e", margin: "2px 0 0" }}>Gemini is reading your answers</p>}
                    </div>
                  </div>
                )}

                {status === "approved" && (
                  <div style={{ background: "#f0ffe8", border: "1px solid #b6f304", borderRadius: 12, padding: "12px 14px", marginBottom: 12, textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#2e6c00", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span className="font-display" style={{ fontSize: 18, fontWeight: 800, color: "#2e6c00" }}>AI Approved!</span>
                    </div>
                    {feedback?.questionsChecked && <p style={{ fontSize: 13, color: "#2e6c00", margin: "0 0 4px" }}>{feedback.correctAnswers}/{feedback.questionsChecked} questions correct</p>}
                    {feedback?.feedback && <p style={{ fontSize: 13, color: "#2e6c00", margin: "0 0 4px" }}>{feedback.feedback}</p>}
                    <p className="font-mono" style={{ fontSize: 12, fontWeight: 500, color: "#2e6c00", margin: 0 }}>+${task.reward.toFixed(2)} added to balance</p>
                  </div>
                )}

                {status === "pending_parent" && (
                  <div style={{ background: "#f1f3ff", border: "1px solid #c4d2ff", borderRadius: 12, padding: "12px 14px", marginBottom: 12, textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#0052cc" }}>hourglass_top</span>
                      <span className="font-display" style={{ fontSize: 16, fontWeight: 800, color: "#0052cc" }}>Waiting for parent</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#434654", margin: 0 }}>AI approved — your parent got a notification.</p>
                  </div>
                )}

                {status === "rejected" && (
                  <div style={{ background: "#fff0f0", border: "1px solid #ffcdd2", borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#ba1a1a", fontVariationSettings: "'FILL' 1" }}>cancel</span>
                      <span className="font-display" style={{ fontSize: 16, fontWeight: 800, color: "#ba1a1a" }}>Not verified</span>
                    </div>
                    {feedback?.feedback && <p style={{ fontSize: 13, color: "#c62828", margin: "0 0 4px" }}>{feedback.feedback}</p>}
                    {feedback?.questionsChecked && <p style={{ fontSize: 13, color: "#c62828", margin: "0 0 8px" }}>{feedback.correctAnswers}/{feedback.questionsChecked} correct — fix the rest and try again</p>}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #ffcdd2", paddingTop: 8 }}>
                      <span className="font-mono" style={{ fontSize: 11, color: "#ba1a1a" }}>Attempts: {failCounts[task.id] ?? 0}</span>
                      {parentAlerted[task.id] ? <span className="font-mono" style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 999, background: "#fff3e0", color: "#bf360c" }}>Parent notified</span>
                        : <span className="font-mono" style={{ fontSize: 11, color: "#737685" }}>Parent notified after 2 fails</span>}
                    </div>
                  </div>
                )}

                {/* Link input */}
                {task.task_type === "homework" && showLinkInput[task.id] && status !== "approved" && status !== "pending_parent" && (
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 13, color: "#434654", margin: "0 0 8px" }}>Paste your Google Doc or homework link:</p>
                    <input type="url" placeholder="https://docs.google.com/..." value={linkInputs[task.id] ?? ""}
                      onChange={e => setLinkInputs(p => ({ ...p, [task.id]: e.target.value }))}
                      style={{ width: "100%", border: "1px solid #c3c6d6", borderRadius: 12, padding: "12px 16px", fontSize: 14, marginBottom: 8, outline: "none", boxSizing: "border-box", color: "#051a3e" }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setShowLinkInput(p => ({ ...p, [task.id]: false }))} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "1px solid #c3c6d6", background: "#fff", fontWeight: 700, fontSize: 14, color: "#434654", cursor: "pointer" }}>Cancel</button>
                      <button onClick={() => submitLink(task.id)} disabled={!linkInputs[task.id]} className="font-display" style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", background: "#0052cc", fontWeight: 800, fontSize: 14, color: "#fff", cursor: "pointer", opacity: linkInputs[task.id] ? 1 : 0.4 }}>Submit Link</button>
                    </div>
                  </div>
                )}

                {/* Paste text */}
                {task.task_type === "homework" && showPasteInput[task.id] && status !== "approved" && status !== "pending_parent" && (
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 13, color: "#434654", margin: "0 0 8px" }}>Paste your homework — copy from Google Docs, Word, or anywhere:</p>
                    <textarea rows={7} placeholder={"Paste your homework here...\n\n1. What is 12 × 8?\nAnswer: 96"}
                      value={pastedText[task.id] ?? ""}
                      onChange={e => setPastedText(p => ({ ...p, [task.id]: e.target.value }))}
                      style={{ width: "100%", border: "1px solid #c3c6d6", borderRadius: 12, padding: "12px 16px", fontSize: 14, marginBottom: 8, resize: "none", outline: "none", boxSizing: "border-box", color: "#051a3e", fontFamily: "inherit" }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setShowPasteInput(p => ({ ...p, [task.id]: false }))} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "1px solid #c3c6d6", background: "#fff", fontWeight: 700, fontSize: 14, color: "#434654", cursor: "pointer" }}>Cancel</button>
                      <button onClick={() => submitPastedText(task.id)} disabled={!pastedText[task.id]} className="font-display" style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", background: "#0052cc", fontWeight: 800, fontSize: 14, color: "#fff", cursor: "pointer", opacity: pastedText[task.id] ? 1 : 0.4 }}>Submit Homework</button>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                {status !== "approved" && status !== "pending_parent" && !showLinkInput[task.id] && !showPasteInput[task.id] && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <button onClick={() => openCamera(task.id)} disabled={status === "verifying"} className="font-display"
                      style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: "none", background: "#0052cc", fontWeight: 800, fontSize: 14, color: "#fff", cursor: "pointer", opacity: status === "verifying" ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>camera_alt</span>
                      {status === "idle" ? "Take Photo to Complete" : status === "verifying" ? "Verifying…" : "Try Again with Photo"}
                    </button>
                    {task.task_type === "homework" && status !== "verifying" && (
                      <>
                        <button onClick={() => setShowPasteInput(p => ({ ...p, [task.id]: true }))}
                          style={{ width: "100%", padding: "12px 0", borderRadius: 14, border: "1px solid #c3c6d6", background: "#fff", fontWeight: 600, fontSize: 14, color: "#434654", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>content_paste</span> Paste Homework Text
                        </button>
                        <label style={{ cursor: "pointer" }}>
                          <div style={{ width: "100%", padding: "12px 0", borderRadius: 14, border: "1px solid #c3c6d6", background: "#fff", fontWeight: 600, fontSize: 14, color: "#434654", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>upload</span> Upload a Screenshot
                          </div>
                          <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleScreenshot(task.id, e)} />
                        </label>
                        <button onClick={() => setShowLinkInput(p => ({ ...p, [task.id]: true }))}
                          style={{ width: "100%", padding: "12px 0", borderRadius: 14, border: "1px solid #c3c6d6", background: "#fff", fontWeight: 600, fontSize: 14, color: "#434654", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>link</span> Submit a Link
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Nav */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid #e1e8ff", height: 80, display: "flex", justifyContent: "space-around", alignItems: "center", paddingBottom: "env(safe-area-inset-bottom, 0px)", zIndex: 50 }}>
        {[
          { icon: "home", label: "Tasks", active: true },
          { icon: "account_balance_wallet", label: "Balance", active: false },
          { icon: "settings", label: "Settings", active: false },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24, color: item.active ? "#0052cc" : "#737685", fontVariationSettings: item.active ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
            <span className="font-mono" style={{ fontSize: 10, color: item.active ? "#0052cc" : "#737685", fontWeight: 500 }}>{item.label}</span>
          </div>
        ))}
      </nav>
    </main>
  );
}

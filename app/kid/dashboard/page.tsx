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
  homework: { icon: "menu_book",         label: "Homework", color: "#003d9b", bg: "#e9edff" },
  exercise: { icon: "fitness_center",    label: "Exercise", color: "#6b54a2", bg: "#f3e8ff" },
};

const KID_ID = "3773eeac-6e2c-4d2f-8521-5ba7f16629cf";

const HGStyle = { fontFamily: "'Hanken Grotesk', sans-serif" };
const MonoStyle = { fontFamily: "'JetBrains Mono', monospace" };

export default function KidDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [balance, setBalance] = useState(20.00);
  const [taskStatuses, setTaskStatuses] = useState<Record<string, TaskStatus>>({});
  const [taskPhotos, setTaskPhotos] = useState<Record<string, string>>({});
  const [taskFeedback, setTaskFeedback] = useState<Record<string, { reason: string; feedback?: string; questionsChecked?: number; correctAnswers?: number }>>({});
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [linkInputs, setLinkInputs] = useState<Record<string, string>>({});
  const [showLinkInput, setShowLinkInput] = useState<Record<string, boolean>>({});
  const [pastedText, setPastedText] = useState<Record<string, string>>({});
  const [showPasteInput, setShowPasteInput] = useState<Record<string, boolean>>({});
  const [screenshotPreviews, setScreenshotPreviews] = useState<Record<string, string>>({});
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
      if (kidRes.ok) { const kidData = await kidRes.json(); setBalance(kidData.balance); }
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
    streamRef.current?.getTracks().forEach((t) => t.stop());
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
    const task = tasks.find((t) => t.id === activeTask);
    setTaskPhotos((prev) => ({ ...prev, [activeTask]: photo }));
    setTaskStatuses((prev) => ({ ...prev, [activeTask]: "verifying" }));
    try {
      const res = await fetch("/api/verify-task", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: photo, taskTitle: task?.title, taskDescription: task?.description, taskType: task?.task_type, requiresParentApproval: task?.requires_parent_approval, taskId: activeTask, kidId: KID_ID }),
      });
      const data = await res.json();
      setTaskFeedback((prev) => ({ ...prev, [activeTask]: data }));
      if (data.pendingParentApproval) { setTaskStatuses((prev) => ({ ...prev, [activeTask]: "pending_parent" })); }
      else if (data.approved) { setTaskStatuses((prev) => ({ ...prev, [activeTask]: "approved" })); const reward = typeof task?.reward === "number" ? task.reward : parseFloat(String(task?.reward ?? "0")); setBalance((prev) => prev + reward); }
      else { setTaskStatuses((prev) => ({ ...prev, [activeTask]: "rejected" })); handleRejection(activeTask, task?.title ?? ""); }
    } catch { setTaskStatuses((prev) => ({ ...prev, [activeTask]: "rejected" })); handleRejection(activeTask, task?.title ?? ""); }
  }

  async function submitLink(taskId: string) {
    const link = linkInputs[taskId]; if (!link) return;
    const task = tasks.find((t) => t.id === taskId);
    setTaskStatuses((prev) => ({ ...prev, [taskId]: "verifying" })); setShowLinkInput((prev) => ({ ...prev, [taskId]: false }));
    try {
      const res = await fetch("/api/verify-task", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ link, taskTitle: task?.title, taskDescription: task?.description, taskType: task?.task_type, requiresParentApproval: task?.requires_parent_approval }) });
      const data = await res.json(); setTaskFeedback((prev) => ({ ...prev, [taskId]: data }));
      if (data.pendingParentApproval) { setTaskStatuses((prev) => ({ ...prev, [taskId]: "pending_parent" })); }
      else if (data.approved) { setTaskStatuses((prev) => ({ ...prev, [taskId]: "approved" })); const reward = typeof task?.reward === "number" ? task.reward : parseFloat(String(task?.reward ?? "0")); setBalance((prev) => prev + reward); }
      else { setTaskStatuses((prev) => ({ ...prev, [taskId]: "rejected" })); handleRejection(taskId, task?.title ?? ""); }
    } catch { setTaskStatuses((prev) => ({ ...prev, [taskId]: "rejected" })); handleRejection(taskId, task?.title ?? ""); }
  }

  function handleRejection(taskId: string, taskTitle: string) {
    setFailCounts((prev) => {
      const newCount = (prev[taskId] ?? 0) + 1;
      if (newCount >= 2) { setParentAlerted((prev) => ({ ...prev, [taskId]: true })); console.log(`PARENT ALERT: ${taskTitle} failed ${newCount} times`); }
      return { ...prev, [taskId]: newCount };
    });
  }

  async function handleScreenshot(taskId: string, event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    const task = tasks.find((t) => t.id === taskId);
    const reader = new FileReader();
    reader.onload = async () => {
      const image = reader.result as string;
      setScreenshotPreviews((prev) => ({ ...prev, [taskId]: image }));
      setTaskPhotos((prev) => ({ ...prev, [taskId]: image }));
      setTaskStatuses((prev) => ({ ...prev, [taskId]: "verifying" }));
      try {
        const res = await fetch("/api/verify-task", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image, taskTitle: task?.title, taskDescription: task?.description, taskType: task?.task_type, requiresParentApproval: task?.requires_parent_approval }) });
        const data = await res.json(); setTaskFeedback((prev) => ({ ...prev, [taskId]: data }));
        if (data.pendingParentApproval) { setTaskStatuses((prev) => ({ ...prev, [taskId]: "pending_parent" })); }
        else if (data.approved) { setTaskStatuses((prev) => ({ ...prev, [taskId]: "approved" })); const reward = typeof task?.reward === "number" ? task.reward : parseFloat(String(task?.reward ?? "0")); setBalance((prev) => prev + reward); }
        else { setTaskStatuses((prev) => ({ ...prev, [taskId]: "rejected" })); }
      } catch { setTaskStatuses((prev) => ({ ...prev, [taskId]: "rejected" })); handleRejection(taskId, task?.title ?? ""); }
    };
    reader.readAsDataURL(file);
  }

  async function submitPastedText(taskId: string) {
    const text = pastedText[taskId]; if (!text) return;
    const task = tasks.find((t) => t.id === taskId);
    setTaskStatuses((prev) => ({ ...prev, [taskId]: "verifying" })); setShowPasteInput((prev) => ({ ...prev, [taskId]: false }));
    try {
      const res = await fetch("/api/verify-task", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pastedText: text, taskTitle: task?.title, taskDescription: task?.description, taskType: task?.task_type, requiresParentApproval: task?.requires_parent_approval, taskId, kidId: KID_ID }) });
      const data = await res.json(); setTaskFeedback((prev) => ({ ...prev, [taskId]: data }));
      if (data.pendingParentApproval) { setTaskStatuses((prev) => ({ ...prev, [taskId]: "pending_parent" })); }
      else if (data.approved) { setTaskStatuses((prev) => ({ ...prev, [taskId]: "approved" })); const reward = typeof task?.reward === "number" ? task.reward : parseFloat(String(task?.reward ?? "0")); setBalance((prev) => prev + reward); }
      else { setTaskStatuses((prev) => ({ ...prev, [taskId]: "rejected" })); handleRejection(taskId, task?.title ?? ""); }
    } catch { setTaskStatuses((prev) => ({ ...prev, [taskId]: "rejected" })); handleRejection(taskId, task?.title ?? ""); }
  }

  const weeklyBudget = 20.00;
  const cappedBalance = Math.min(balance, weeklyBudget);
  const pct = (cappedBalance / weeklyBudget) * 100;

  return (
    <main className="min-h-screen pb-24" style={{ backgroundColor: "#faf9ff" }}>

      {/* Camera Modal */}
      {cameraOpen && activeTask && (
        <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-6 flex flex-col items-center gap-4 w-full max-w-md">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-lg font-black" style={{ ...HGStyle, color: "#051a3e" }}>Take your proof photo</h2>
              <button onClick={closeCamera} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#f1f3ff" }}>
                <span className="material-symbols-outlined text-base" style={{ color: "#434654" }}>close</span>
              </button>
            </div>
            <p className="text-sm text-center w-full" style={{ color: "#434654" }}>{tasks.find((t) => t.id === activeTask)?.description}</p>
            {tasks.find((t) => t.id === activeTask)?.task_type === "homework" && (
              <div className="rounded-xl p-3 w-full flex items-start gap-2" style={{ backgroundColor: "#e9edff" }}>
                <span className="material-symbols-outlined text-base mt-0.5" style={{ color: "#003d9b" }}>auto_awesome</span>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#003d9b" }}>Gemini AI will check your answers</p>
                  <p className="text-xs mt-0.5" style={{ color: "#434654" }}>Make sure all questions and answers are clearly visible</p>
                </div>
              </div>
            )}
            {tasks.find((t) => t.id === activeTask)?.requires_parent_approval && (
              <div className="rounded-xl p-3 w-full flex items-start gap-2" style={{ backgroundColor: "#f1f3ff" }}>
                <span className="material-symbols-outlined text-base mt-0.5" style={{ color: "#6b54a2" }}>supervisor_account</span>
                <p className="text-sm" style={{ color: "#6b54a2" }}>Parent approval also required after AI review</p>
              </div>
            )}
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl" style={{ backgroundColor: "#000" }} />
            <div className="flex gap-3 w-full">
              <button onClick={closeCamera} className="flex-1 font-bold py-3 rounded-xl border text-sm" style={{ borderColor: "#c3c6d6", color: "#434654" }}>Cancel</button>
              <button onClick={captureAndVerify} className="flex-1 font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2" style={{ backgroundColor: "#003d9b", color: "#ffffff", ...HGStyle }}>
                <span className="material-symbols-outlined text-base">camera</span> Submit Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="h-16 flex items-center justify-between px-5 border-b sticky top-0 z-40" style={{ backgroundColor: "#ffffff", borderColor: "#e1e8ff" }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm" style={{ backgroundColor: "#003d9b", color: "#ffffff" }}>R</div>
          <span className="font-black text-base" style={{ ...HGStyle, color: "#003d9b" }}>Redefine</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm" style={{ backgroundColor: "#e9edff", color: "#003d9b" }}>J</div>
          <span className="text-sm font-medium" style={{ color: "#434654" }}>Jake</span>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 py-6">

        {/* Balance hero card */}
        <div className="rounded-2xl p-5 mb-4 relative overflow-hidden" style={{ backgroundColor: "#003d9b" }}>
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10" style={{ backgroundColor: "#ffffff" }} />
          <div className="absolute -right-2 -bottom-6 w-28 h-28 rounded-full opacity-5" style={{ backgroundColor: "#ffffff" }} />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-wider mb-1" style={{ ...MonoStyle, color: "rgba(255,255,255,0.6)" }}>Your balance</p>
            <p className="font-black text-5xl mb-4 tabular-nums" style={{ ...HGStyle, color: cappedBalance < 5 ? "#ff6b6b" : cappedBalance < 10 ? "#ffd166" : "#ffffff" }}>
              ${cappedBalance.toFixed(2)}
            </p>
            <div className="w-full rounded-full h-1.5 mb-2" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
              <div className="h-1.5 rounded-full transition-all" style={{
                width: `${Math.min(pct, 100)}%`,
                backgroundColor: cappedBalance < 5 ? "#ff6b6b" : cappedBalance < 10 ? "#ffd166" : "#69ff87",
              }} />
            </div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)", ...MonoStyle }}>${cappedBalance.toFixed(2)} / ${weeklyBudget.toFixed(2)} weekly budget</p>
          </div>
        </div>

        {/* Live status pill */}
        <div className="rounded-xl p-4 mb-6 flex items-center gap-3" style={{ backgroundColor: "#fff0f0", border: "1px solid #ffcdd2" }}>
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse" style={{ backgroundColor: "#ba1a1a" }} />
          <div>
            <p className="font-bold text-sm" style={{ color: "#ba1a1a" }}>You are on TikTok right now</p>
            <p className="text-xs" style={{ color: "#c62828", ...MonoStyle }}>$0.10/min draining your balance</p>
          </div>
        </div>

        {/* Section header */}
        <div className="mb-4">
          <p className="text-xs uppercase tracking-wider mb-1" style={{ ...MonoStyle, color: "#737685" }}>Earn it back</p>
          <h2 className="font-black text-xl" style={{ ...HGStyle, color: "#051a3e" }}>Complete a task</h2>
          <p className="text-sm mt-0.5" style={{ color: "#434654" }}>Finish a task, take a photo, and AI verifies it instantly.</p>
        </div>

        {/* Task list */}
        <div className="flex flex-col gap-4">
          {tasks.map((task) => {
            const status = taskStatuses[task.id] ?? "idle";
            const photo = taskPhotos[task.id];
            const feedback = taskFeedback[task.id];
            const cfg = taskTypeConfig[task.task_type] ?? taskTypeConfig["chore"];

            const cardBg = status === "approved" ? "#f0fff4" : status === "pending_parent" ? "#f1f3ff" : status === "rejected" ? "#fff0f0" : status === "verifying" ? "#fffbea" : "#ffffff";
            const cardBorder = status === "approved" ? "#69ff87" : status === "pending_parent" ? "#c4d2ff" : status === "rejected" ? "#ffcdd2" : status === "verifying" ? "#ffd166" : "#e1e8ff";

            return (
              <div key={task.id} className="rounded-2xl p-5 border transition-all" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>

                {/* Task header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cfg.bg }}>
                      <span className="material-symbols-outlined text-lg" style={{ color: cfg.color }}>{cfg.icon}</span>
                    </div>
                    <div>
                      <p className="font-black text-base leading-tight" style={{ ...HGStyle, color: "#051a3e" }}>{task.title}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ ...MonoStyle, backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                        {task.requires_parent_approval && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ ...MonoStyle, backgroundColor: "#f3e8ff", color: "#6b54a2" }}>Parent approval</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="font-black text-lg flex-shrink-0" style={{ ...HGStyle, color: "#006e2a" }}>${task.reward.toFixed(2)}</span>
                </div>

                <p className="text-sm mb-3" style={{ color: "#434654" }}>{task.description}</p>

                {/* Photo preview */}
                {photo && (
                  <div className="w-full h-36 relative rounded-xl overflow-hidden mb-3 border" style={{ borderColor: "#e1e8ff" }}>
                    <Image src={photo} alt="Task photo" fill className="object-cover" />
                  </div>
                )}

                {/* Status states */}
                {status === "verifying" && (
                  <div className="rounded-xl p-3 mb-3 flex items-center gap-2 text-sm" style={{ backgroundColor: "#fffbea", border: "1px solid #ffd166" }}>
                    <span className="material-symbols-outlined text-base animate-spin" style={{ color: "#b45309" }}>progress_activity</span>
                    <div>
                      <p className="font-bold" style={{ color: "#b45309" }}>AI is verifying your photo...</p>
                      {task.task_type === "homework" && <p className="text-xs" style={{ color: "#92400e" }}>Gemini is reading and checking your answers</p>}
                    </div>
                  </div>
                )}

                {status === "approved" && (
                  <div className="rounded-xl p-4 mb-3 text-center" style={{ backgroundColor: "#f0fff4", border: "1px solid #69ff87" }}>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined text-xl" style={{ color: "#006e2a", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <p className="font-black text-lg" style={{ ...HGStyle, color: "#006e2a" }}>AI Approved!</p>
                    </div>
                    {feedback?.questionsChecked && <p className="text-sm" style={{ color: "#006e2a" }}>{feedback.correctAnswers}/{feedback.questionsChecked} questions correct</p>}
                    {feedback?.feedback && <p className="text-sm mt-1" style={{ color: "#006e2a" }}>{feedback.feedback}</p>}
                    <p className="text-xs font-bold mt-2" style={{ ...MonoStyle, color: "#006e2a" }}>+${task.reward.toFixed(2)} added to balance</p>
                  </div>
                )}

                {status === "pending_parent" && (
                  <div className="rounded-xl p-4 mb-3 text-center" style={{ backgroundColor: "#f1f3ff", border: "1px solid #c4d2ff" }}>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined text-xl" style={{ color: "#003d9b" }}>hourglass_top</span>
                      <p className="font-black text-base" style={{ ...HGStyle, color: "#003d9b" }}>Waiting for parent</p>
                    </div>
                    <p className="text-sm" style={{ color: "#434654" }}>AI approved — your parent got a notification to confirm.</p>
                  </div>
                )}

                {status === "rejected" && (
                  <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "#fff0f0", border: "1px solid #ffcdd2" }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined text-xl" style={{ color: "#ba1a1a", fontVariationSettings: "'FILL' 1" }}>cancel</span>
                      <p className="font-black" style={{ ...HGStyle, color: "#ba1a1a" }}>Not verified</p>
                    </div>
                    {feedback?.feedback && <p className="text-sm" style={{ color: "#c62828" }}>{feedback.feedback}</p>}
                    {feedback?.questionsChecked && (
                      <p className="text-sm mt-1" style={{ color: "#c62828" }}>{feedback.correctAnswers}/{feedback.questionsChecked} correct — fix the rest and try again</p>
                    )}
                    <div className="mt-3 pt-3 flex items-center justify-between border-t" style={{ borderColor: "#ffcdd2" }}>
                      <p className="text-xs" style={{ ...MonoStyle, color: "#ba1a1a" }}>Attempts: {failCounts[task.id] ?? 0}</p>
                      {parentAlerted[task.id] ? (
                        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: "#fff3e0", color: "#bf360c" }}>Parent notified</span>
                      ) : (
                        <span className="text-xs" style={{ color: "#737685" }}>Parent notified after 2 fails</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Link input */}
                {task.task_type === "homework" && showLinkInput[task.id] && status !== "approved" && status !== "pending_parent" && (
                  <div className="mb-3">
                    <p className="text-xs mb-2" style={{ color: "#434654" }}>Paste your Google Doc or homework link:</p>
                    <input type="url" placeholder="https://docs.google.com/..."
                      value={linkInputs[task.id] ?? ""}
                      onChange={(e) => setLinkInputs((prev) => ({ ...prev, [task.id]: e.target.value }))}
                      className="w-full border rounded-xl px-4 py-3 text-sm mb-2 focus:outline-none"
                      style={{ borderColor: "#c3c6d6", backgroundColor: "#ffffff", color: "#051a3e" }} />
                    <div className="flex gap-2">
                      <button onClick={() => setShowLinkInput((prev) => ({ ...prev, [task.id]: false }))}
                        className="flex-1 font-bold py-2.5 rounded-xl border text-sm" style={{ borderColor: "#c3c6d6", color: "#434654" }}>Cancel</button>
                      <button onClick={() => submitLink(task.id)} disabled={!linkInputs[task.id]}
                        className="flex-1 font-bold py-2.5 rounded-xl text-sm disabled:opacity-40"
                        style={{ backgroundColor: "#003d9b", color: "#ffffff", ...HGStyle }}>Submit Link</button>
                    </div>
                  </div>
                )}

                {/* Paste text input */}
                {task.task_type === "homework" && showPasteInput[task.id] && status !== "approved" && status !== "pending_parent" && (
                  <div className="mb-3">
                    <p className="text-xs mb-2" style={{ color: "#434654" }}>Paste your homework — copy from Google Docs, Word, or anywhere:</p>
                    <textarea rows={7}
                      placeholder={"Paste your homework here...\n\n1. What is 12 × 8?\nAnswer: 96"}
                      value={pastedText[task.id] ?? ""}
                      onChange={(e) => setPastedText((prev) => ({ ...prev, [task.id]: e.target.value }))}
                      className="w-full border rounded-xl px-4 py-3 text-sm mb-2 resize-none focus:outline-none"
                      style={{ borderColor: "#c3c6d6", backgroundColor: "#ffffff", color: "#051a3e" }} />
                    <div className="flex gap-2">
                      <button onClick={() => setShowPasteInput((prev) => ({ ...prev, [task.id]: false }))}
                        className="flex-1 font-bold py-2.5 rounded-xl border text-sm" style={{ borderColor: "#c3c6d6", color: "#434654" }}>Cancel</button>
                      <button onClick={() => submitPastedText(task.id)} disabled={!pastedText[task.id]}
                        className="flex-1 font-bold py-2.5 rounded-xl text-sm disabled:opacity-40"
                        style={{ backgroundColor: "#003d9b", color: "#ffffff", ...HGStyle }}>Submit Homework</button>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                {status !== "approved" && status !== "pending_parent" && !showLinkInput[task.id] && !showPasteInput[task.id] && (
                  <div className="flex flex-col gap-2">
                    <button onClick={() => openCamera(task.id)} disabled={status === "verifying"}
                      className="w-full font-black py-3 rounded-xl text-sm transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
                      style={{ backgroundColor: "#003d9b", color: "#ffffff", ...HGStyle }}>
                      <span className="material-symbols-outlined text-base">camera_alt</span>
                      {status === "idle" ? "Take Photo to Complete" : status === "verifying" ? "Verifying..." : "Try Again with Photo"}
                    </button>
                    {task.task_type === "homework" && status !== "verifying" && (
                      <>
                        <button onClick={() => setShowPasteInput((prev) => ({ ...prev, [task.id]: true }))}
                          className="w-full font-bold py-2.5 rounded-xl border text-sm flex items-center justify-center gap-2"
                          style={{ borderColor: "#c3c6d6", color: "#434654", backgroundColor: "transparent" }}>
                          <span className="material-symbols-outlined text-base">content_paste</span>
                          Paste Homework Text
                        </button>
                        <label className="w-full cursor-pointer">
                          <div className="w-full font-bold py-2.5 rounded-xl border text-sm text-center flex items-center justify-center gap-2"
                            style={{ borderColor: "#c3c6d6", color: "#434654", backgroundColor: "transparent" }}>
                            <span className="material-symbols-outlined text-base">upload</span>
                            Upload a Screenshot
                          </div>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleScreenshot(task.id, e)} />
                        </label>
                        <button onClick={() => setShowLinkInput((prev) => ({ ...prev, [task.id]: true }))}
                          className="w-full font-bold py-2.5 rounded-xl border text-sm flex items-center justify-center gap-2"
                          style={{ borderColor: "#c3c6d6", color: "#434654", backgroundColor: "transparent" }}>
                          <span className="material-symbols-outlined text-base">link</span>
                          Submit a Link
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
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 pb-safe border-t" style={{ backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderColor: "#e1e8ff" }}>
        <div className="flex flex-col items-center justify-center gap-1 cursor-pointer" style={{ color: "#003d9b" }}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: 24 }}>home</span>
          <span className="text-xs font-bold" style={{ ...MonoStyle }}>Tasks</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 cursor-pointer" style={{ color: "#737685" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>account_balance_wallet</span>
          <span className="text-xs" style={{ ...MonoStyle }}>Balance</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 cursor-pointer" style={{ color: "#737685" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>settings</span>
          <span className="text-xs" style={{ ...MonoStyle }}>Settings</span>
        </div>
      </nav>
    </main>
  );
}

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

const taskTypeConfig = {
  chore: { icon: "🧹", label: "Chore" },
  homework: { icon: "📚", label: "Homework" },
  exercise: { icon: "💪", label: "Exercise" },
};

// Demo kid ID from our setup
const KID_ID = "3773eeac-6e2c-4d2f-8521-5ba7f16629cf";

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

  // Load tasks from database
  useEffect(() => {
    async function loadData() {
      const res = await fetch(`/api/tasks?kidId=${KID_ID}`);
      const data = await res.json();
      setTasks(data);

      // Set initial statuses
      const statuses: Record<string, TaskStatus> = {};
      data.forEach((t: Task) => {
        if (t.status === "approved") statuses[t.id] = "approved";
        else if (t.status === "pending_review") statuses[t.id] = "pending_parent";
        else statuses[t.id] = "idle";
      });
      setTaskStatuses(statuses);

      // Load balance
      const kidRes = await fetch(`/api/kid?kidId=${KID_ID}`);
      if (kidRes.ok) {
        const kidData = await kidRes.json();
        setBalance(kidData.balance);
      }
    }
    loadData();
  }, []);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  async function openCamera(taskId: string) {
    setActiveTask(taskId);
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 100);
    } catch {
      alert("Could not access camera.");
      setCameraOpen(false);
    }
  }

  function closeCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: photo,
          taskTitle: task?.title,
          taskDescription: task?.description,
          taskType: task?.task_type,
          requiresParentApproval: task?.requires_parent_approval,
          taskId: activeTask,
          kidId: KID_ID,
        }),
      });
      const data = await res.json();
      setTaskFeedback((prev) => ({ ...prev, [activeTask]: data }));

      if (data.pendingParentApproval) {
        setTaskStatuses((prev) => ({ ...prev, [activeTask]: "pending_parent" }));
      } else if (data.approved) {
        setTaskStatuses((prev) => ({ ...prev, [activeTask]: "approved" }));
        const reward = typeof task?.reward === "number" ? task.reward : parseFloat(String(task?.reward ?? "0"));
        setBalance((prev) => prev + reward);
      } else {
        setTaskStatuses((prev) => ({ ...prev, [activeTask]: "rejected" }));
        handleRejection(activeTask, task?.title ?? "");
      }
    } catch {
      setTaskStatuses((prev) => ({ ...prev, [activeTask]: "rejected" }));
      handleRejection(activeTask, task?.title ?? "");
    }
  }

  async function submitLink(taskId: string) {
    const link = linkInputs[taskId];
    if (!link) return;
    const task = tasks.find((t) => t.id === taskId);
    setTaskStatuses((prev) => ({ ...prev, [taskId]: "verifying" }));
    setShowLinkInput((prev) => ({ ...prev, [taskId]: false }));

    try {
      const res = await fetch("/api/verify-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          link,
          taskTitle: task?.title,
          taskDescription: task?.description,
          taskType: task?.task_type,
          requiresParentApproval: task?.requires_parent_approval,
        }),
      });
      const data = await res.json();
      setTaskFeedback((prev) => ({ ...prev, [taskId]: data }));

      if (data.pendingParentApproval) {
        setTaskStatuses((prev) => ({ ...prev, [taskId]: "pending_parent" }));
      } else if (data.approved) {
        setTaskStatuses((prev) => ({ ...prev, [taskId]: "approved" }));
        const reward = typeof task?.reward === "number" ? task.reward : parseFloat(String(task?.reward ?? "0"));
        setBalance((prev) => prev + reward);
      } else {
        setTaskStatuses((prev) => ({ ...prev, [taskId]: "rejected" }));
        handleRejection(taskId, task?.title ?? "");
      }
    } catch {
      setTaskStatuses((prev) => ({ ...prev, [taskId]: "rejected" }));
      handleRejection(taskId, task?.title ?? "");
    }
  }

  function handleRejection(taskId: string, taskTitle: string) {
    setFailCounts((prev) => {
      const newCount = (prev[taskId] ?? 0) + 1;
      // Alert parent after 2 failed attempts
      if (newCount >= 2) {
        setParentAlerted((prev) => ({ ...prev, [taskId]: true }));
        // In a real app this would send a push notification/email to parent
        console.log(`PARENT ALERT: ${taskTitle} has been failed ${newCount} times`);
      }
      return { ...prev, [taskId]: newCount };
    });
  }

  async function handleScreenshot(taskId: string, event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const task = tasks.find((t) => t.id === taskId);
    const reader = new FileReader();
    reader.onload = async () => {
      const image = reader.result as string;
      setScreenshotPreviews((prev) => ({ ...prev, [taskId]: image }));
      setTaskPhotos((prev) => ({ ...prev, [taskId]: image }));
      setTaskStatuses((prev) => ({ ...prev, [taskId]: "verifying" }));

      try {
        const res = await fetch("/api/verify-task", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image,
            taskTitle: task?.title,
          taskDescription: task?.description,
            taskType: task?.task_type,
            requiresParentApproval: task?.requires_parent_approval,
          }),
        });
        const data = await res.json();
        setTaskFeedback((prev) => ({ ...prev, [taskId]: data }));

        if (data.pendingParentApproval) {
          setTaskStatuses((prev) => ({ ...prev, [taskId]: "pending_parent" }));
        } else if (data.approved) {
          setTaskStatuses((prev) => ({ ...prev, [taskId]: "approved" }));
          const reward = typeof task?.reward === "number" ? task.reward : parseFloat(String(task?.reward ?? "0"));
          setBalance((prev) => prev + reward);
        } else {
          setTaskStatuses((prev) => ({ ...prev, [taskId]: "rejected" }));
        }
      } catch {
        setTaskStatuses((prev) => ({ ...prev, [taskId]: "rejected" }));
        handleRejection(taskId, task?.title ?? "");
      }
    };
    reader.readAsDataURL(file);
  }

  async function submitPastedText(taskId: string) {
    const text = pastedText[taskId];
    if (!text) return;
    const task = tasks.find((t) => t.id === taskId);
    setTaskStatuses((prev) => ({ ...prev, [taskId]: "verifying" }));
    setShowPasteInput((prev) => ({ ...prev, [taskId]: false }));

    try {
      const res = await fetch("/api/verify-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pastedText: text,
          taskTitle: task?.title,
          taskDescription: task?.description,
          taskType: task?.task_type,
          requiresParentApproval: task?.requires_parent_approval,
          taskId,
          kidId: KID_ID,
        }),
      });
      const data = await res.json();
      setTaskFeedback((prev) => ({ ...prev, [taskId]: data }));

      if (data.pendingParentApproval) {
        setTaskStatuses((prev) => ({ ...prev, [taskId]: "pending_parent" }));
      } else if (data.approved) {
        setTaskStatuses((prev) => ({ ...prev, [taskId]: "approved" }));
        const reward = typeof task?.reward === "number" ? task.reward : parseFloat(String(task?.reward ?? "0"));
        setBalance((prev) => prev + reward);
      } else {
        setTaskStatuses((prev) => ({ ...prev, [taskId]: "rejected" }));
        handleRejection(taskId, task?.title ?? "");
      }
    } catch {
      setTaskStatuses((prev) => ({ ...prev, [taskId]: "rejected" }));
      handleRejection(taskId, task?.title ?? "");
    }
  }

  const weeklyBudget = 20.00;
  const percentage = (balance / weeklyBudget) * 100;

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F8F4ED", color: "#1A1A2E" }}>

      {/* Camera Modal */}
      {cameraOpen && activeTask && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="rounded-2xl border p-6 flex flex-col items-center gap-4 w-full max-w-md shadow-2xl" style={{ backgroundColor: "#FFFDF9", borderColor: "#E5E7EB" }}>
            <h2 className="text-xl font-black" style={{ color: "#1B4332" }}>Take your photo</h2>
            <p className="text-sm text-center" style={{ color: "#6B7280" }}>{tasks.find((t) => t.id === activeTask)?.description}</p>

            {tasks.find((t) => t.id === activeTask)?.task_type === "homework" && (
              <div className="rounded-xl p-3 w-full text-center border" style={{ backgroundColor: "#FFFBEB", borderColor: "#FCD34D" }}>
                <p className="text-sm font-bold" style={{ color: "#D97706" }}>Homework mode — AI will check your answers</p>
                <p className="text-xs mt-1" style={{ color: "#D97706" }}>Make sure all questions and answers are clearly visible</p>
              </div>
            )}

            {tasks.find((t) => t.id === activeTask)?.requires_parent_approval && (
              <div className="rounded-xl p-3 w-full text-center border" style={{ backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }}>
                <p className="text-sm font-bold" style={{ color: "#2563EB" }}>Parent approval also required</p>
                <p className="text-xs mt-1" style={{ color: "#3B82F6" }}>Your parent will get a notification to review this.</p>
              </div>
            )}

            <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl" />
            <div className="flex gap-3 w-full">
              <button onClick={closeCamera} className="flex-1 font-bold py-3 rounded-xl border text-sm"
                style={{ borderColor: "#C8B89A", color: "#1B4332" }}>Cancel</button>
              <button onClick={captureAndVerify} className="flex-1 font-black py-3 rounded-xl text-sm transition hover:opacity-90"
                style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>Submit Photo</button>
            </div>
          </div>
        </div>
      )}

      <nav className="border-b px-8 py-4 flex items-center justify-between sticky top-0 z-40" style={{ backgroundColor: "#1B4332", borderColor: "#2D6A4F" }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs" style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>R</div>
          <span className="font-bold text-sm" style={{ color: "#FFFDF9" }}>Redefine</span>
        </Link>
        <span className="text-sm font-medium" style={{ color: "#A7C4B5" }}>Hey Jake</span>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-8">

        {/* Balance card */}
        <div className="rounded-2xl p-6 mb-4 border" style={{ backgroundColor: "#1B4332", borderColor: "#2D6A4F" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#52B788" }}>Your Balance</p>
          <p className="text-6xl font-black mb-4 tabular-nums" style={{
            color: balance < 5 ? "#EF5350" : balance < 10 ? "#FF9900" : "#FFFDF9"
          }}>
            ${Math.min(balance, weeklyBudget).toFixed(2)}
          </p>
          <div className="w-full rounded-full h-1.5 mb-2" style={{ backgroundColor: "#2D6A4F" }}>
            <div className="h-1.5 rounded-full transition-all" style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: balance < 5 ? "#EF5350" : balance < 10 ? "#FF9900" : "#52B788"
            }} />
          </div>
          <p className="text-xs" style={{ color: "#A7C4B5" }}>${balance.toFixed(2)} of ${weeklyBudget.toFixed(2)} weekly budget remaining</p>
        </div>

        {/* Live status */}
        <div className="rounded-2xl p-4 mb-6 border flex items-center gap-3" style={{ backgroundColor: "#FEF2F2", borderColor: "#FECACA" }}>
          <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: "#EF5350" }} />
          <div>
            <p className="font-bold text-sm" style={{ color: "#DC2626" }}>You are on TikTok right now</p>
            <p className="text-xs" style={{ color: "#EF5350" }}>$0.10/min is being deducted from your balance</p>
          </div>
        </div>

        <h2 className="text-xl font-black mb-1" style={{ color: "#1B4332" }}>Earn your balance back</h2>
        <p className="text-sm mb-6" style={{ color: "#6B7280" }}>Complete a task, take a photo, and AI verifies it instantly.</p>

        <div className="flex flex-col gap-4">
          {tasks.map((task) => {
            const status = taskStatuses[task.id] ?? "idle";
            const photo = taskPhotos[task.id];
            const feedback = taskFeedback[task.id];
            const config = taskTypeConfig[task.task_type] ?? taskTypeConfig["chore"];

            return (
              <div key={task.id} className="border rounded-2xl p-5 transition" style={{
                backgroundColor: status === "approved" ? "#F0FDF4" : status === "pending_parent" ? "#EFF6FF" : status === "rejected" ? "#FEF2F2" : status === "verifying" ? "#FFFBEB" : "#FFFDF9",
                borderColor: status === "approved" ? "#86EFAC" : status === "pending_parent" ? "#BFDBFE" : status === "rejected" ? "#FECACA" : status === "verifying" ? "#FCD34D" : "#E5E7EB",
              }}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-black text-lg" style={{ color: "#1B4332" }}>{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#EBF5EE", color: "#2D6A4F" }}>{config.label}</span>
                      {task.requires_parent_approval && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#EFF6FF", color: "#2563EB" }}>Parent approval</span>
                      )}
                    </div>
                  </div>
                  <span className="font-black text-lg" style={{ color: "#2D6A4F" }}>${task.reward.toFixed(2)}</span>
                </div>

                <p className="text-sm mb-3" style={{ color: "#6B7280" }}>{task.description}</p>

                {photo && (
                  <div className="w-full h-32 relative rounded-xl overflow-hidden mb-3 border" style={{ borderColor: "#E5E7EB" }}>
                    <Image src={photo} alt="Task photo" fill className="object-cover" />
                  </div>
                )}

                {status === "verifying" && (
                  <div className="flex items-center gap-2 text-sm mb-3 rounded-xl p-3 border" style={{ backgroundColor: "#FFFBEB", borderColor: "#FCD34D", color: "#D97706" }}>
                    <span className="animate-spin">⟳</span>
                    <div>
                      <p className="font-bold">AI is verifying your photo...</p>
                      {task.task_type === "homework" && <p className="text-xs">Reading and checking your answers...</p>}
                    </div>
                  </div>
                )}

                {status === "approved" && (
                  <div className="rounded-xl p-4 mb-3 text-center border" style={{ backgroundColor: "#F0FDF4", borderColor: "#86EFAC" }}>
                    <p className="font-black text-lg" style={{ color: "#059669" }}>AI Approved</p>
                    {feedback?.questionsChecked && <p className="text-sm mt-1" style={{ color: "#16A34A" }}>{feedback.correctAnswers}/{feedback.questionsChecked} questions correct</p>}
                    {feedback?.feedback && <p className="text-sm mt-1" style={{ color: "#16A34A" }}>{feedback.feedback}</p>}
                    <p className="font-bold mt-2 text-sm" style={{ color: "#059669" }}>${task.reward.toFixed(2)} added to your balance</p>
                  </div>
                )}

                {status === "pending_parent" && (
                  <div className="rounded-xl p-4 mb-3 text-center border" style={{ backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }}>
                    <p className="font-black" style={{ color: "#2563EB" }}>AI Approved — waiting for parent</p>
                    <p className="text-sm mt-1" style={{ color: "#3B82F6" }}>Your parent received a notification to confirm.</p>
                  </div>
                )}

                {status === "rejected" && (
                  <div className="rounded-xl p-4 mb-3 border" style={{ backgroundColor: "#FEF2F2", borderColor: "#FECACA" }}>
                    <p className="font-black text-center" style={{ color: "#DC2626" }}>Not verified</p>
                    {feedback?.feedback && <p className="text-sm text-center mt-1" style={{ color: "#EF5350" }}>{feedback.feedback}</p>}
                    {feedback?.questionsChecked && (
                      <p className="text-sm text-center mt-1" style={{ color: "#EF5350" }}>
                        {feedback.correctAnswers}/{feedback.questionsChecked} correct — fix the rest and try again
                      </p>
                    )}
                    <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: "#FECACA" }}>
                      <p className="text-xs" style={{ color: "#EF5350" }}>Failed attempts: {failCounts[task.id] ?? 0}</p>
                      {parentAlerted[task.id] ? (
                        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: "#FFF7ED", color: "#C2410C" }}>Parent notified</span>
                      ) : (
                        <span className="text-xs" style={{ color: "#9CA3AF" }}>Parent notified after 2 fails</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Link input for homework */}
                {task.task_type === "homework" && showLinkInput[task.id] && status !== "approved" && status !== "pending_parent" && (
                  <div className="mb-3">
                    <p className="text-xs mb-2" style={{ color: "#6B7280" }}>Paste your Google Doc or homework link:</p>
                    <input type="url" placeholder="https://docs.google.com/..."
                      value={linkInputs[task.id] ?? ""}
                      onChange={(e) => setLinkInputs((prev) => ({ ...prev, [task.id]: e.target.value }))}
                      className="w-full border rounded-xl px-4 py-3 text-sm mb-2 focus:outline-none"
                      style={{ borderColor: "#D1D5DB", backgroundColor: "#FFFFFF", color: "#1A1A2E" }} />
                    <div className="flex gap-2">
                      <button onClick={() => setShowLinkInput((prev) => ({ ...prev, [task.id]: false }))}
                        className="flex-1 font-bold py-2 rounded-xl border text-sm"
                        style={{ borderColor: "#C8B89A", color: "#1B4332" }}>Cancel</button>
                      <button onClick={() => submitLink(task.id)} disabled={!linkInputs[task.id]}
                        className="flex-1 font-bold py-2 rounded-xl text-sm disabled:opacity-40"
                        style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>Submit Link</button>
                    </div>
                  </div>
                )}

                {/* Paste text input for homework */}
                {task.task_type === "homework" && showPasteInput[task.id] && status !== "approved" && status !== "pending_parent" && (
                  <div className="mb-3">
                    <p className="text-xs mb-2" style={{ color: "#6B7280" }}>Paste your homework text — copy from Google Docs, Word, or anywhere:</p>
                    <textarea rows={8}
                      placeholder={"Paste your homework here...\n\n1. What is 12 × 8?\nAnswer: 96"}
                      value={pastedText[task.id] ?? ""}
                      onChange={(e) => setPastedText((prev) => ({ ...prev, [task.id]: e.target.value }))}
                      className="w-full border rounded-xl px-4 py-3 text-sm mb-2 resize-none focus:outline-none"
                      style={{ borderColor: "#D1D5DB", backgroundColor: "#FFFFFF", color: "#1A1A2E" }} />
                    <div className="flex gap-2">
                      <button onClick={() => setShowPasteInput((prev) => ({ ...prev, [task.id]: false }))}
                        className="flex-1 font-bold py-2 rounded-xl border text-sm"
                        style={{ borderColor: "#C8B89A", color: "#1B4332" }}>Cancel</button>
                      <button onClick={() => submitPastedText(task.id)} disabled={!pastedText[task.id]}
                        className="flex-1 font-bold py-2 rounded-xl text-sm disabled:opacity-40"
                        style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>Submit Homework</button>
                    </div>
                  </div>
                )}

                {status !== "approved" && status !== "pending_parent" && !showLinkInput[task.id] && !showPasteInput[task.id] && (
                  <div className="flex flex-col gap-2">
                    <button onClick={() => openCamera(task.id)} disabled={status === "verifying"}
                      className="w-full font-bold py-3 rounded-xl text-sm transition hover:opacity-90 disabled:opacity-40"
                      style={{ backgroundColor: "#FF9900", color: "#1B4332" }}>
                      {status === "idle" ? "Take Photo to Complete" : status === "verifying" ? "Verifying..." : "Try Again with Photo"}
                    </button>
                    {task.task_type === "homework" && status !== "verifying" && (
                      <>
                        <button onClick={() => setShowPasteInput((prev) => ({ ...prev, [task.id]: true }))}
                          className="w-full font-bold py-3 rounded-xl border text-sm transition"
                          style={{ borderColor: "#C8B89A", color: "#1B4332", backgroundColor: "transparent" }}>
                          Paste Homework Text
                        </button>
                        <label className="w-full cursor-pointer">
                          <div className="w-full font-bold py-3 rounded-xl border text-sm text-center transition"
                            style={{ borderColor: "#C8B89A", color: "#1B4332", backgroundColor: "transparent" }}>
                            Upload a Screenshot
                          </div>
                          <input type="file" accept="image/*" className="hidden"
                            onChange={(e) => handleScreenshot(task.id, e)} />
                        </label>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

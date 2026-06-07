"use client";

import { useState, useRef } from "react";
import Image from "next/image";

type TaskType = "chore" | "homework" | "exercise";
type TaskStatus = "idle" | "verifying" | "approved" | "rejected" | "pending_parent";

const tasks = [
  { id: 1, title: "Make your bed", reward: "$1.00", description: "Take a clear photo of your made bed", type: "chore" as TaskType, requiresParentApproval: false },
  { id: 2, title: "Do homework", reward: "$2.00", description: "Take a photo of your completed homework — AI will check your answers", type: "homework" as TaskType, requiresParentApproval: true },
  { id: 3, title: "Take out trash", reward: "$1.50", description: "Take a photo of the empty trash can", type: "chore" as TaskType, requiresParentApproval: false },
  { id: 4, title: "Exercise for 20 mins", reward: "$1.00", description: "Take a photo outside or at the gym showing you exercised", type: "exercise" as TaskType, requiresParentApproval: false },
];

const taskTypeConfig = {
  chore: { icon: "🧹", label: "Chore" },
  homework: { icon: "📚", label: "Homework" },
  exercise: { icon: "💪", label: "Exercise" },
};

export default function KidDashboard() {
  const [balance, setBalance] = useState(12.50);
  const [taskStatuses, setTaskStatuses] = useState<Record<number, TaskStatus>>({});
  const [taskPhotos, setTaskPhotos] = useState<Record<number, string>>({});
  const [taskFeedback, setTaskFeedback] = useState<Record<number, { reason: string; feedback?: string; questionsChecked?: number; correctAnswers?: number }>>({});
  const [activeTask, setActiveTask] = useState<number | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [linkInputs, setLinkInputs] = useState<Record<number, string>>({});
  const [showLinkInput, setShowLinkInput] = useState<Record<number, boolean>>({});
  const [pastedText, setPastedText] = useState<Record<number, string>>({});
  const [showPasteInput, setShowPasteInput] = useState<Record<number, boolean>>({});
  const [screenshotPreviews, setScreenshotPreviews] = useState<Record<number, string>>({});
  const [failCounts, setFailCounts] = useState<Record<number, number>>({});
  const [parentAlerted, setParentAlerted] = useState<Record<number, boolean>>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  async function openCamera(taskId: number) {
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
          taskType: task?.type,
          requiresParentApproval: task?.requiresParentApproval,
        }),
      });
      const data = await res.json();
      setTaskFeedback((prev) => ({ ...prev, [activeTask]: data }));

      if (data.pendingParentApproval) {
        setTaskStatuses((prev) => ({ ...prev, [activeTask]: "pending_parent" }));
      } else if (data.approved) {
        setTaskStatuses((prev) => ({ ...prev, [activeTask]: "approved" }));
        const reward = parseFloat(task?.reward.replace("$", "") ?? "0");
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

  async function submitLink(taskId: number) {
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
          taskType: task?.type,
          requiresParentApproval: task?.requiresParentApproval,
        }),
      });
      const data = await res.json();
      setTaskFeedback((prev) => ({ ...prev, [taskId]: data }));

      if (data.pendingParentApproval) {
        setTaskStatuses((prev) => ({ ...prev, [taskId]: "pending_parent" }));
      } else if (data.approved) {
        setTaskStatuses((prev) => ({ ...prev, [taskId]: "approved" }));
        const reward = parseFloat(task?.reward.replace("$", "") ?? "0");
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

  function handleRejection(taskId: number, taskTitle: string) {
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

  async function handleScreenshot(taskId: number, event: React.ChangeEvent<HTMLInputElement>) {
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
            taskType: task?.type,
            requiresParentApproval: task?.requiresParentApproval,
          }),
        });
        const data = await res.json();
        setTaskFeedback((prev) => ({ ...prev, [taskId]: data }));

        if (data.pendingParentApproval) {
          setTaskStatuses((prev) => ({ ...prev, [taskId]: "pending_parent" }));
        } else if (data.approved) {
          setTaskStatuses((prev) => ({ ...prev, [taskId]: "approved" }));
          const reward = parseFloat(task?.reward.replace("$", "") ?? "0");
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

  async function submitPastedText(taskId: number) {
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
          taskType: task?.type,
          requiresParentApproval: task?.requiresParentApproval,
        }),
      });
      const data = await res.json();
      setTaskFeedback((prev) => ({ ...prev, [taskId]: data }));

      if (data.pendingParentApproval) {
        setTaskStatuses((prev) => ({ ...prev, [taskId]: "pending_parent" }));
      } else if (data.approved) {
        setTaskStatuses((prev) => ({ ...prev, [taskId]: "approved" }));
        const reward = parseFloat(task?.reward.replace("$", "") ?? "0");
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
    <main className="min-h-screen bg-[#020817] text-white">

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-700 opacity-10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-cyan-700 opacity-10 rounded-full blur-[120px]" />
      </div>

      {/* Camera Modal */}
      {cameraOpen && activeTask && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6">
          <div className="bg-[#0a1628] border border-white/10 rounded-3xl p-6 flex flex-col items-center gap-4 w-full max-w-md">
            <h2 className="text-xl font-black">📸 Take your photo</h2>
            <p className="text-gray-400 text-sm text-center">{tasks.find((t) => t.id === activeTask)?.description}</p>

            {tasks.find((t) => t.id === activeTask)?.type === "homework" && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-3 w-full text-center">
                <p className="text-yellow-400 text-sm font-bold">📚 Homework mode — AI will check your answers</p>
                <p className="text-yellow-300 text-xs mt-1">Make sure all questions AND answers are clearly visible!</p>
              </div>
            )}

            {tasks.find((t) => t.id === activeTask)?.requiresParentApproval && (
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3 w-full text-center">
                <p className="text-blue-400 text-sm font-bold">👀 Parent approval also required</p>
                <p className="text-blue-300 text-xs mt-1">Your parent will get a notification to review this.</p>
              </div>
            )}

            <video ref={videoRef} autoPlay playsInline className="w-full rounded-2xl" />
            <div className="flex gap-3 w-full">
              <button onClick={closeCamera} className="flex-1 bg-white/10 hover:bg-white/20 transition text-white font-bold py-3 rounded-xl">Cancel</button>
              <button onClick={captureAndVerify} className="flex-1 bg-blue-600 hover:bg-blue-500 transition text-white font-black py-3 rounded-xl">📸 Submit</button>
            </div>
          </div>
        </div>
      )}

      <nav className="relative z-10 flex justify-between items-center px-8 py-5 border-b border-white/10">
        <h1 className="text-xl font-black">Re<span className="text-cyan-400">define</span></h1>
        <span className="text-gray-400 text-sm">Hey Jake 👋</span>
      </nav>

      <div className="relative z-10 max-w-lg mx-auto px-6 py-10">

        {/* Balance */}
        <div className="bg-gradient-to-br from-blue-600/30 to-cyan-600/20 border border-blue-500/30 rounded-3xl p-8 mb-6 text-center">
          <p className="text-gray-300 text-sm mb-2">Your Balance</p>
          <p className={`text-7xl font-black mb-4 ${balance < 5 ? "text-red-400" : balance < 10 ? "text-yellow-400" : "text-white"}`}>
            ${balance.toFixed(2)}
          </p>
          <div className="w-full bg-white/10 rounded-full h-2 mb-2">
            <div className={`h-2 rounded-full transition-all ${balance < 5 ? "bg-red-500" : balance < 10 ? "bg-yellow-500" : "bg-cyan-400"}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
          </div>
          <p className="text-gray-400 text-xs">${balance.toFixed(2)} of ${weeklyBudget.toFixed(2)} weekly budget remaining</p>
        </div>

        {/* Live status */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-8 flex items-center gap-3">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <div>
            <p className="font-bold text-sm">You&apos;re on TikTok right now</p>
            <p className="text-gray-400 text-xs">$0.10/min is being deducted</p>
          </div>
        </div>

        <h2 className="text-xl font-black mb-2">💪 Earn your balance back</h2>
        <p className="text-gray-400 text-sm mb-6">Complete a task and take a photo. AI verifies it instantly.</p>

        <div className="flex flex-col gap-4">
          {tasks.map((task) => {
            const status = taskStatuses[task.id] ?? "idle";
            const photo = taskPhotos[task.id];
            const feedback = taskFeedback[task.id];
            const config = taskTypeConfig[task.type];

            return (
              <div key={task.id} className={`border rounded-2xl p-5 transition ${
                status === "approved" ? "bg-green-500/10 border-green-500/30" :
                status === "pending_parent" ? "bg-blue-500/10 border-blue-500/30" :
                status === "rejected" ? "bg-red-500/10 border-red-500/30" :
                status === "verifying" ? "bg-yellow-500/10 border-yellow-500/30" :
                "bg-white/5 border-white/10"
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <p className="font-black text-lg">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-gray-400">{config.label}</span>
                        {task.requiresParentApproval && (
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">👀 Parent approval</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-green-400 font-black text-lg">{task.reward}</span>
                </div>

                <p className="text-gray-400 text-sm mb-3">{task.description}</p>

                {photo && (
                  <div className="w-full h-32 relative rounded-xl overflow-hidden mb-3">
                    <Image src={photo} alt="Task photo" fill className="object-cover" />
                  </div>
                )}

                {status === "verifying" && (
                  <div className="flex items-center gap-2 text-yellow-400 text-sm mb-3 bg-yellow-500/10 rounded-xl p-3">
                    <span className="animate-spin text-lg">⟳</span>
                    <div>
                      <p className="font-bold">AI is verifying...</p>
                      {task.type === "homework" && <p className="text-xs text-yellow-300">Reading and checking your answers...</p>}
                    </div>
                  </div>
                )}

                {status === "approved" && (
                  <div className="bg-green-500/20 rounded-xl p-4 mb-3 text-center">
                    <p className="text-green-400 font-black text-lg">✅ AI Approved!</p>
                    {feedback?.questionsChecked && <p className="text-green-300 text-sm mt-1">{feedback.correctAnswers}/{feedback.questionsChecked} questions correct</p>}
                    {feedback?.feedback && <p className="text-green-300 text-sm mt-1">{feedback.feedback}</p>}
                    <p className="text-green-400 font-bold mt-2">{task.reward} added to your balance! 🎉</p>
                  </div>
                )}

                {status === "pending_parent" && (
                  <div className="bg-blue-500/20 rounded-xl p-4 mb-3 text-center">
                    <p className="text-blue-400 font-black text-lg">✅ AI Approved!</p>
                    <p className="text-blue-300 text-sm mt-1">Waiting for your parent to confirm...</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <p className="text-blue-400 text-xs">Notification sent to parent</p>
                    </div>
                  </div>
                )}

                {status === "rejected" && (
                  <div className="bg-red-500/20 rounded-xl p-4 mb-3">
                    <p className="text-red-400 font-black text-center">❌ Not verified</p>
                    {feedback?.feedback && <p className="text-red-300 text-sm text-center mt-1">{feedback.feedback}</p>}
                    {feedback?.questionsChecked && (
                      <p className="text-red-300 text-sm text-center mt-1">
                        {feedback.correctAnswers}/{feedback.questionsChecked} correct — fix the rest and try again!
                      </p>
                    )}

                    {/* Fail counter */}
                    <div className="mt-3 pt-3 border-t border-red-500/20">
                      <div className="flex items-center justify-between">
                        <p className="text-red-400 text-xs">
                          Failed attempts: {failCounts[task.id] ?? 0}
                        </p>
                        {parentAlerted[task.id] ? (
                          <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full font-bold">
                            🔔 Parent notified
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">
                            Parent notified after 2 fails
                          </span>
                        )}
                      </div>

                      {parentAlerted[task.id] && (
                        <p className="text-orange-300 text-xs mt-2 text-center">
                          Your parent has been alerted that you are struggling with this task. They may reach out to help you.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Link input for homework */}
                {task.type === "homework" && showLinkInput[task.id] && status !== "approved" && status !== "pending_parent" && (
                  <div className="mb-3">
                    <p className="text-gray-400 text-xs mb-2">Paste your Google Doc, Google Classroom, or any homework link:</p>
                    <input
                      type="url"
                      placeholder="https://docs.google.com/..."
                      value={linkInputs[task.id] ?? ""}
                      onChange={(e) => setLinkInputs((prev) => ({ ...prev, [task.id]: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowLinkInput((prev) => ({ ...prev, [task.id]: false }))}
                        className="flex-1 bg-white/10 hover:bg-white/20 transition text-white font-bold py-2 rounded-xl text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => submitLink(task.id)}
                        disabled={!linkInputs[task.id]}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 transition text-white font-bold py-2 rounded-xl text-sm disabled:opacity-40"
                      >
                        🔗 Submit Link
                      </button>
                    </div>
                  </div>
                )}

                {/* Paste text input for homework */}
                {task.type === "homework" && showPasteInput[task.id] && status !== "approved" && status !== "pending_parent" && (
                  <div className="mb-3">
                    <p className="text-gray-400 text-xs mb-2">Paste your homework text below — copy it from Google Docs, Word, or anywhere:</p>
                    <textarea
                      rows={8}
                      placeholder="Paste your homework here...&#10;&#10;Example:&#10;1. What is 12 × 8?&#10;Answer: 96&#10;&#10;2. Solve for x: 2x + 4 = 12&#10;Answer: x = 4"
                      value={pastedText[task.id] ?? ""}
                      onChange={(e) => setPastedText((prev) => ({ ...prev, [task.id]: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm mb-2 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowPasteInput((prev) => ({ ...prev, [task.id]: false }))}
                        className="flex-1 bg-white/10 hover:bg-white/20 transition text-white font-bold py-2 rounded-xl text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => submitPastedText(task.id)}
                        disabled={!pastedText[task.id]}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 transition text-white font-bold py-2 rounded-xl text-sm disabled:opacity-40"
                      >
                        📝 Submit Homework
                      </button>
                    </div>
                  </div>
                )}

                {status !== "approved" && status !== "pending_parent" && !showLinkInput[task.id] && !showPasteInput[task.id] && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => openCamera(task.id)}
                      disabled={status === "verifying"}
                      className="w-full font-bold py-3 rounded-xl transition bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40"
                    >
                      {status === "idle" ? "📸 Take Photo to Complete" : status === "verifying" ? "⟳ Verifying..." : "📸 Try Again with Photo"}
                    </button>
                    {task.type === "homework" && status !== "verifying" && (
                      <>
                        <button
                          onClick={() => setShowPasteInput((prev) => ({ ...prev, [task.id]: true }))}
                          className="w-full font-bold py-3 rounded-xl transition bg-white/10 hover:bg-white/20 text-white text-sm"
                        >
                          📝 Paste Homework Text Instead
                        </button>
                        <label className="w-full cursor-pointer">
                          <div className="w-full font-bold py-3 rounded-xl transition bg-white/10 hover:bg-white/20 text-white text-sm text-center">
                            🖼️ Upload a Screenshot
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleScreenshot(task.id, e)}
                          />
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

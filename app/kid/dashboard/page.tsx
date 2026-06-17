"use client";

import { useState, useRef, useEffect } from "react";
import Logo from "@/components/Logo";
import BalanceCard from "@/components/BalanceCard";
import BottomNav, { NavItem } from "@/components/BottomNav";
import TaskCard, { Task, TaskStatus } from "@/components/TaskCard";
import CameraModal from "@/components/CameraModal";

const KID_ID = "3773eeac-6e2c-4d2f-8521-5ba7f16629cf";

const NAV_ITEMS: NavItem[] = [
  { icon: "home",                   label: "Tasks",   value: "tasks"   },
  { icon: "account_balance_wallet", label: "Balance", value: "balance" },
  { icon: "settings",               label: "Settings", value: "settings" },
];

export default function KidDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [balance, setBalance] = useState(20.0);
  const [weeklyBudget] = useState(20.0);
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
  const [activeTab, setActiveTab] = useState("tasks");

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
      if (kidRes.ok) {
        const d = await kidRes.json();
        setBalance(d.balance);
      }
    }
    loadData();
  }, []);

  async function openCamera(taskId: string) {
    setActiveTask(taskId);
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
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

  function handleRejection(taskId: string, taskTitle: string) {
    setFailCounts((p) => {
      const n = (p[taskId] ?? 0) + 1;
      if (n >= 2) {
        setParentAlerted((p) => ({ ...p, [taskId]: true }));
        console.log(`PARENT ALERT: ${taskTitle} failed ${n} times`);
      }
      return { ...p, [taskId]: n };
    });
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
    const taskId = activeTask;
    setTaskPhotos((p) => ({ ...p, [taskId]: photo }));
    setTaskStatuses((p) => ({ ...p, [taskId]: "verifying" }));
    try {
      const res = await fetch("/api/verify-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: photo, taskTitle: task?.title, taskDescription: task?.description, taskType: task?.task_type, requiresParentApproval: task?.requires_parent_approval, taskId, kidId: KID_ID }),
      });
      const data = await res.json();
      setTaskFeedback((p) => ({ ...p, [taskId]: data }));
      if (data.pendingParentApproval) setTaskStatuses((p) => ({ ...p, [taskId]: "pending_parent" }));
      else if (data.approved) {
        setTaskStatuses((p) => ({ ...p, [taskId]: "approved" }));
        setBalance((p) => p + (typeof task?.reward === "number" ? task.reward : parseFloat(String(task?.reward ?? "0"))));
      } else {
        setTaskStatuses((p) => ({ ...p, [taskId]: "rejected" }));
        handleRejection(taskId, task?.title ?? "");
      }
    } catch {
      setTaskStatuses((p) => ({ ...p, [activeTask]: "rejected" }));
      handleRejection(activeTask, task?.title ?? "");
    }
  }

  async function submitLink(taskId: string) {
    const link = linkInputs[taskId];
    if (!link) return;
    const task = tasks.find((t) => t.id === taskId);
    setTaskStatuses((p) => ({ ...p, [taskId]: "verifying" }));
    setShowLinkInput((p) => ({ ...p, [taskId]: false }));
    try {
      const res = await fetch("/api/verify-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link, taskTitle: task?.title, taskDescription: task?.description, taskType: task?.task_type, requiresParentApproval: task?.requires_parent_approval }),
      });
      const data = await res.json();
      setTaskFeedback((p) => ({ ...p, [taskId]: data }));
      if (data.pendingParentApproval) setTaskStatuses((p) => ({ ...p, [taskId]: "pending_parent" }));
      else if (data.approved) {
        setTaskStatuses((p) => ({ ...p, [taskId]: "approved" }));
        setBalance((p) => p + (typeof task?.reward === "number" ? task.reward : parseFloat(String(task?.reward ?? "0"))));
      } else {
        setTaskStatuses((p) => ({ ...p, [taskId]: "rejected" }));
        handleRejection(taskId, task?.title ?? "");
      }
    } catch {
      setTaskStatuses((p) => ({ ...p, [taskId]: "rejected" }));
      handleRejection(taskId, task?.title ?? "");
    }
  }

  async function submitPastedText(taskId: string) {
    const text = pastedText[taskId];
    if (!text) return;
    const task = tasks.find((t) => t.id === taskId);
    setTaskStatuses((p) => ({ ...p, [taskId]: "verifying" }));
    setShowPasteInput((p) => ({ ...p, [taskId]: false }));
    try {
      const res = await fetch("/api/verify-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pastedText: text, taskTitle: task?.title, taskDescription: task?.description, taskType: task?.task_type, requiresParentApproval: task?.requires_parent_approval, taskId, kidId: KID_ID }),
      });
      const data = await res.json();
      setTaskFeedback((p) => ({ ...p, [taskId]: data }));
      if (data.pendingParentApproval) setTaskStatuses((p) => ({ ...p, [taskId]: "pending_parent" }));
      else if (data.approved) {
        setTaskStatuses((p) => ({ ...p, [taskId]: "approved" }));
        setBalance((p) => p + (typeof task?.reward === "number" ? task.reward : parseFloat(String(task?.reward ?? "0"))));
      } else {
        setTaskStatuses((p) => ({ ...p, [taskId]: "rejected" }));
        handleRejection(taskId, task?.title ?? "");
      }
    } catch {
      setTaskStatuses((p) => ({ ...p, [taskId]: "rejected" }));
      handleRejection(taskId, task?.title ?? "");
    }
  }

  async function handleScreenshot(taskId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const task = tasks.find((t) => t.id === taskId);
    const reader = new FileReader();
    reader.onload = async () => {
      const image = reader.result as string;
      setTaskPhotos((p) => ({ ...p, [taskId]: image }));
      setTaskStatuses((p) => ({ ...p, [taskId]: "verifying" }));
      try {
        const res = await fetch("/api/verify-task", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image, taskTitle: task?.title, taskDescription: task?.description, taskType: task?.task_type, requiresParentApproval: task?.requires_parent_approval }),
        });
        const data = await res.json();
        setTaskFeedback((p) => ({ ...p, [taskId]: data }));
        if (data.pendingParentApproval) setTaskStatuses((p) => ({ ...p, [taskId]: "pending_parent" }));
        else if (data.approved) {
          setTaskStatuses((p) => ({ ...p, [taskId]: "approved" }));
          setBalance((p) => p + (typeof task?.reward === "number" ? task.reward : parseFloat(String(task?.reward ?? "0"))));
        } else {
          setTaskStatuses((p) => ({ ...p, [taskId]: "rejected" }));
          handleRejection(taskId, task?.title ?? "");
        }
      } catch {
        setTaskStatuses((p) => ({ ...p, [taskId]: "rejected" }));
        handleRejection(taskId, task?.title ?? "");
      }
    };
    reader.readAsDataURL(file);
  }

  const activeTaskObj = tasks.find((t) => t.id === activeTask);

  return (
    <main className="bg-background min-h-dvh pb-24">

      {/* Camera modal */}
      {cameraOpen && activeTaskObj && (
        <CameraModal
          videoRef={videoRef}
          taskTitle={activeTaskObj.title}
          taskDescription={activeTaskObj.description}
          taskType={activeTaskObj.task_type}
          onClose={closeCamera}
          onCapture={captureAndVerify}
        />
      )}

      {/* Top nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-outline h-16 flex items-center justify-between px-5">
        <Logo />
        <div className="flex items-center gap-2">
          <div className="font-display w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center font-black text-[13px]">
            J
          </div>
          <span className="text-sm font-medium text-on-variant">Jake</span>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto px-5 pt-5">

        {/* Balance card */}
        <BalanceCard balance={balance} weeklyBudget={weeklyBudget} isDraining={true} />

        {/* Live drain pill */}
        <div className="bg-red-50 border border-red-200 rounded-[14px] px-4 py-3 mb-6 flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-error flex-shrink-0" />
          <div>
            <p className="font-display text-sm font-bold text-error m-0">You are on TikTok right now</p>
            <p className="font-mono text-xs text-red-700 m-0 mt-0.5">$0.10/min draining your balance</p>
          </div>
        </div>

        {/* Section header */}
        <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">Earn it back</p>
        <h2 className="font-display text-2xl font-black text-on-surface mb-1">Complete a task</h2>
        <p className="text-sm text-on-variant mb-5">Finish a task, take a photo, and AI verifies it instantly.</p>

        {/* Task cards */}
        <div className="flex flex-col gap-3.5">
          {tasks.map((task) => {
            const status = taskStatuses[task.id] ?? "idle";
            return (
              <TaskCard
                key={task.id}
                task={task}
                status={status}
                photo={taskPhotos[task.id]}
                feedback={taskFeedback[task.id]}
                failCount={failCounts[task.id] ?? 0}
                parentAlerted={parentAlerted[task.id] ?? false}
                showLinkInput={showLinkInput[task.id] ?? false}
                showPasteInput={showPasteInput[task.id] ?? false}
                linkInput={linkInputs[task.id] ?? ""}
                pastedText={pastedText[task.id] ?? ""}
                onOpenCamera={() => openCamera(task.id)}
                onSubmitLink={() => submitLink(task.id)}
                onSubmitPaste={() => submitPastedText(task.id)}
                onScreenshot={(e) => handleScreenshot(task.id, e)}
                onSetShowLink={(show) => setShowLinkInput((p) => ({ ...p, [task.id]: show }))}
                onSetShowPaste={(show) => setShowPasteInput((p) => ({ ...p, [task.id]: show }))}
                onSetLinkInput={(val) => setLinkInputs((p) => ({ ...p, [task.id]: val }))}
                onSetPastedText={(val) => setPastedText((p) => ({ ...p, [task.id]: val }))}
              />
            );
          })}
        </div>
      </div>

      <BottomNav items={NAV_ITEMS} active={activeTab} onChange={setActiveTab} />
    </main>
  );
}

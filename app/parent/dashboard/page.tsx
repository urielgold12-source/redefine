"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const kidData = {
  name: "Jake",
  balance: 12.50,
  weeklyBudget: 20.00,
  todaySpent: 7.50,
  currentApp: "TikTok",
  isOnline: true,
};

const recentActivity = [
  { app: "TikTok", duration: "23 mins", cost: "$2.30", time: "2 mins ago", icon: "🎵" },
  { app: "Instagram", duration: "15 mins", cost: "$1.20", time: "1 hour ago", icon: "📸" },
  { app: "YouTube", duration: "45 mins", cost: "$2.25", time: "3 hours ago", icon: "▶️" },
  { app: "Snapchat", duration: "10 mins", cost: "$0.80", time: "5 hours ago", icon: "👻" },
];

const initialTasks = [
  {
    id: 1,
    title: "Make your bed",
    reward: "$1.00",
    status: "pending_review",
    hasPhoto: true,
    type: "chore",
    aiVerdict: "AI approved — bed appears neatly made with pillows arranged.",
    failCount: 0,
    photo: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
  },
  {
    id: 2,
    title: "Do homework",
    reward: "$2.00",
    status: "pending_review",
    hasPhoto: true,
    type: "homework",
    aiVerdict: "AI approved — 7/8 questions correct. Question 3 had a minor error but overall work is complete.",
    failCount: 2,
    photo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80",
  },
  {
    id: 3,
    title: "Take out trash",
    reward: "$1.50",
    status: "active",
    hasPhoto: false,
    type: "chore",
    aiVerdict: "",
    failCount: 0,
    photo: "",
  },
];

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "settings">("overview");
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);

  function approveTask(taskId: number) {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: "completed" } : t));
    setSelectedTask(null);
  }

  function rejectTask(taskId: number) {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: "active", hasPhoto: false } : t));
    setSelectedTask(null);
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white">

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-700 opacity-10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-cyan-700 opacity-10 rounded-full blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-5 border-b border-white/10">
        <Link href="/" className="text-xl font-black">
          Re<span className="text-cyan-400">define</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Parent Dashboard</span>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">P</div>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black">Good morning! 👋</h1>
            <p className="text-gray-400 mt-1">Here's what Jake has been up to.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 transition text-white font-bold px-4 py-2 rounded-xl text-sm">
            + Add Task
          </button>
        </div>

        {/* Live status card */}
        <div className={`rounded-2xl p-6 mb-6 border ${kidData.isOnline ? "bg-red-500/10 border-red-500/30" : "bg-white/5 border-white/10"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${kidData.isOnline ? "bg-red-500 animate-pulse" : "bg-gray-500"}`} />
              <div>
                <p className="font-bold text-lg">{kidData.isOnline ? `Jake is on ${kidData.currentApp} right now` : "Jake is offline"}</p>
                <p className="text-gray-400 text-sm">{kidData.isOnline ? "Balance draining at $0.10/min" : "No social media activity"}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-white">${kidData.balance.toFixed(2)}</p>
              <p className="text-gray-400 text-sm">current balance</p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Weekly Budget", value: `$${kidData.weeklyBudget.toFixed(2)}`, color: "text-white" },
            { label: "Spent Today", value: `$${kidData.todaySpent.toFixed(2)}`, color: "text-red-400" },
            { label: "Remaining", value: `$${kidData.balance.toFixed(2)}`, color: "text-cyan-400" },
            { label: "Tasks Done", value: "2/3", color: "text-green-400" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["overview", "tasks", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition ${activeTab === tab ? "bg-blue-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
            <div className="flex flex-col gap-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-bold">{item.app}</p>
                      <p className="text-gray-400 text-sm">{item.duration} • {item.time}</p>
                    </div>
                  </div>
                  <p className="text-red-400 font-bold">{item.cost}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Task Review Modal */}
        {selectedTask !== null && (() => {
          const task = tasks.find((t) => t.id === selectedTask);
          if (!task) return null;
          return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
              <div className="bg-[#0a1628] border border-white/10 rounded-3xl p-6 w-full max-w-md">
                <h2 className="text-xl font-black mb-1">{task.title}</h2>
                <p className="text-gray-400 text-sm mb-4">Review Jake&apos;s submission</p>

                {/* Photo */}
                {task.photo && (
                  <div className="w-full h-48 relative rounded-2xl overflow-hidden mb-4">
                    <Image src={task.photo} alt="Task submission" fill className="object-cover" />
                  </div>
                )}

                {/* AI Verdict */}
                {task.aiVerdict && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-4">
                    <p className="text-blue-400 text-xs font-bold mb-1">🤖 AI Verdict</p>
                    <p className="text-blue-300 text-sm">{task.aiVerdict}</p>
                  </div>
                )}

                {/* Fail count warning */}
                {task.failCount >= 2 && (
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-4">
                    <p className="text-orange-400 text-sm font-bold">⚠️ Jake failed this task {task.failCount} times before getting it right.</p>
                    <p className="text-orange-300 text-xs mt-1">You may want to check in with them about this task.</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => rejectTask(task.id)}
                    className="flex-1 bg-red-600 hover:bg-red-500 transition text-white font-bold py-3 rounded-xl"
                  >
                    ❌ Reject
                  </button>
                  <button
                    onClick={() => approveTask(task.id)}
                    className="flex-1 bg-green-600 hover:bg-green-500 transition text-white font-bold py-3 rounded-xl"
                  >
                    ✅ Approve
                  </button>
                </div>

                <button
                  onClick={() => setSelectedTask(null)}
                  className="w-full mt-3 bg-white/5 hover:bg-white/10 transition text-gray-400 font-bold py-2 rounded-xl text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          );
        })()}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Tasks</h2>
              <p className="text-gray-400 text-xs">✅ Completed tasks restore balance to your kid</p>
            </div>
            <div className="flex flex-col gap-3">
              {tasks.map((task) => (
                <div key={task.id} className={`border rounded-2xl p-4 transition ${task.status === "pending_review" ? "bg-yellow-500/10 border-yellow-500/30" : task.status === "completed" ? "bg-green-500/10 border-green-500/30" : "bg-white/5 border-white/10"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${task.status === "completed" ? "bg-green-500/20" : task.status === "pending_review" ? "bg-yellow-500/20" : "bg-white/10"}`}>
                        {task.status === "completed" ? "✅" : task.status === "pending_review" ? "📸" : "⏳"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold">{task.title}</p>
                          {task.failCount >= 2 && (
                            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">⚠️ {task.failCount} fails</span>
                          )}
                        </div>
                        <p className={`text-sm ${task.status === "pending_review" ? "text-yellow-400" : task.status === "completed" ? "text-green-400" : "text-gray-400"}`}>
                          {task.status === "pending_review" ? "📸 Needs your review" : task.status === "completed" ? "✅ Approved" : "⏳ Waiting for kid"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-green-400 font-bold">{task.reward}</p>
                        <p className="text-gray-500 text-xs">to balance</p>
                      </div>
                      {task.status === "pending_review" && (
                        <button
                          onClick={() => setSelectedTask(task.id)}
                          className="bg-yellow-600 hover:bg-yellow-500 transition text-white text-xs font-bold px-3 py-2 rounded-lg"
                        >
                          Review →
                        </button>
                      )}
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
            <h2 className="text-lg font-bold mb-4">App Rates</h2>
            <div className="flex flex-col gap-3">
              {[
                { app: "TikTok", emoji: "🎵", rate: "0.10" },
                { app: "Instagram", emoji: "📸", rate: "0.08" },
                { app: "Snapchat", emoji: "👻", rate: "0.08" },
                { app: "YouTube", emoji: "▶️", rate: "0.05" },
                { app: "Twitter/X", emoji: "🐦", rate: "0.05" },
              ].map((item) => (
                <div key={item.app} className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between">
                  <span className="font-medium">{item.emoji} {item.app}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      defaultValue={item.rate}
                      step="0.01"
                      className="w-16 bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-white text-sm text-center focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-gray-400 text-sm">/min</span>
                  </div>
                </div>
              ))}
              <button className="mt-2 bg-blue-600 hover:bg-blue-500 transition text-white font-bold py-3 rounded-xl">
                Save Changes
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { ArrowRight, Plus, X } from "lucide-react";
import { taskApi, authApi, Task } from "../lib/apiClient";
import {
  accentCards,
  statCards,
  statusStyles,
  type TaskFlag,
} from "../lib/theme";
import Nav from "../ui/Nav";
import ThemeToggle from "../ui/ThemeToggle";

type Filter = "all" | "ongoing" | "due" | "complete";

const FLAG_LABELS: Record<TaskFlag, string> = {
  Ongoing: "ongoing",
  Due: "due",
  Complete: "complete",
};

export default function HomePage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token) {
      router.push("/");
      return;
    }

    if (user) {
      setUserName(JSON.parse(user).name);
    }

    setLoggedIn(true);
    loadTasks();
  }, [router]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await taskApi.getTasks();
      setTasks(response.tasks);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(
    () => ({
      total: tasks.length,
      ongoing: tasks.filter((t) => t.flag === "Ongoing").length,
      due: tasks.filter((t) => t.flag === "Due").length,
      complete: tasks.filter((t) => t.flag === "Complete").length,
    }),
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    if (filter === "all") return tasks;
    const map: Record<Filter, TaskFlag> = {
      all: "Ongoing",
      ongoing: "Ongoing",
      due: "Due",
      complete: "Complete",
    };
    return tasks.filter((t) => t.flag === map[filter]);
  }, [tasks, filter]);

  const addTask = async () => {
    if (!taskInput.trim() || adding) return;

    try {
      setAdding(true);
      const response = await taskApi.createTask(taskInput.trim(), "Ongoing");
      setTasks([response.task, ...tasks]);
      setTaskInput("");
      setShowAddForm(false);
      setError("");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || "Failed to create task");
    } finally {
      setAdding(false);
    }
  };

  const updateFlag = async (id: number, newFlag: TaskFlag) => {
    try {
      await taskApi.updateTask(id, { flag: newFlag });
      setTasks(tasks.map((t) => (t.id === id ? { ...t, flag: newFlag } : t)));
      setError("");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || "Failed to update task");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await taskApi.deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
      setError("");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || "Failed to delete task");
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // proceed with local logout
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/");
    }
  };

  const filterLinks: { label: string; value: Filter }[] = [
    { label: "all", value: "all" },
    { label: "ongoing", value: "ongoing" },
    { label: "due", value: "due" },
    { label: "complete", value: "complete" },
  ];

  if (!loggedIn || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-black">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
      </div>
    );
  }

  const firstName = userName.split(" ")[0];

  return (
    <div className="min-h-screen">
      {/* Dark hero */}
      <section className="bg-brand-black text-white">
        <Nav
          variant="dark"
          links={filterLinks.map((f) => ({
            label: f.label,
            onClick: () => setFilter(f.value),
            active: filter === f.value,
          }))}
          right={
            <div className="flex items-center gap-6">
              <ThemeToggle variant="dark" />
              <button
                type="button"
                onClick={logout}
                className="btn-ghost btn-ghost-dark"
              >
                logout
              </button>
            </div>
          }
        />

        <div className="site-container pb-16 pt-4 md:pb-20 md:pt-8">
          <h1 className="display-serif text-white">
            {firstName}&apos;s{" "}
            <span className="italic text-brand-accent">tasks</span>
          </h1>
          <p className="mt-8 max-w-2xl font-sans text-base leading-relaxed text-white/60 md:text-lg">
            You have{" "}
            <span className="text-brand-gold">{stats.ongoing} ongoing</span>,{" "}
            <span className="text-brand-accent">{stats.due} due</span>, and{" "}
            <span className="text-brand-teal">{stats.complete} complete</span> —
            stay focused and move with intention.
          </p>
        </div>
      </section>

      {/* Cream content */}
      <section className="bg-brand-cream">
        <div className="site-container py-12 md:py-20">
          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {statCards.map((card) => (
              <div
                key={card.key}
                className={`rounded-3xl p-6 md:p-8 ${card.bg} ${card.text}`}
              >
                <p className="font-sans text-xs uppercase tracking-[0.15em] opacity-70">
                  {card.label}
                </p>
                <p className="mt-2 font-serif text-4xl italic md:text-5xl">
                  {stats[card.key as keyof typeof stats]}
                </p>
              </div>
            ))}
          </div>

          {/* Add task */}
          <div className="mt-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label">your tasks</p>
              <h2 className="mt-2 font-serif text-3xl text-brand-black md:text-4xl">
                What&apos;s on your{" "}
                <span className="italic text-brand-accent">list</span>?
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-secondary flex items-center gap-2 self-start"
            >
              <Plus className="h-4 w-4" />
              new task
            </button>
          </div>

          {showAddForm && (
            <div className="mt-8 flex flex-col gap-4 rounded-3xl bg-white p-6 sm:flex-row sm:items-end md:p-8">
              <div className="flex-1">
                <label className="section-label mb-2 block !normal-case">
                  Task title
                </label>
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={taskInput}
                  autoFocus
                  onChange={(e) => setTaskInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  className="input-minimal"
                />
              </div>
              <button
                type="button"
                onClick={addTask}
                disabled={adding || !taskInput.trim()}
                className="btn-primary shrink-0"
              >
                {adding ? "adding..." : "add task"}
              </button>
            </div>
          )}

          {error && (
            <p className="mt-6 rounded-2xl bg-brand-burgundy/10 px-4 py-3 font-sans text-sm text-brand-burgundy">
              {error}
            </p>
          )}

          {/* Task grid */}
          {filteredTasks.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-serif text-3xl italic text-brand-black/30 md:text-4xl">
                {filter === "all" ? "Nothing here yet" : `No ${filter} tasks`}
              </p>
              <p className="mt-4 font-sans text-sm text-brand-black/40">
                {filter === "all"
                  ? "Add your first task to get started."
                  : "Try a different filter or create something new."}
              </p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {filteredTasks.map((task, index) => {
                const style = statusStyles[task.flag as TaskFlag];
                return (
                  <article
                    key={task.id}
                    className={`group flex min-h-[200px] flex-col justify-between rounded-3xl p-6 transition duration-300 hover:scale-[1.02] md:min-h-[240px] lg:p-8 ${style.bg} ${style.text}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-sans text-xs uppercase tracking-[0.15em] opacity-60">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        className="opacity-40 transition hover:opacity-100"
                        title="Delete task"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <h3
                      className={`mt-6 font-serif text-2xl leading-snug md:text-3xl ${
                        task.flag === "Complete" ? "line-through opacity-70" : ""
                      }`}
                    >
                      {task.title}
                    </h3>

                    <div className="mt-8 flex flex-wrap gap-2">
                      {(["Ongoing", "Due", "Complete"] as TaskFlag[]).map(
                        (flag) => {
                          const isActive = task.flag === flag;
                          return (
                            <button
                              key={flag}
                              type="button"
                              onClick={() => updateFlag(task.id, flag)}
                              className={`rounded-full px-3 py-1 font-sans text-xs lowercase tracking-wide transition ${
                                isActive
                                  ? "bg-white/25 font-medium"
                                  : "bg-black/10 opacity-70 hover:opacity-100"
                              }`}
                            >
                              {FLAG_LABELS[flag]}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Dark footer strip */}
      {tasks.length > 0 && (
        <section className="bg-brand-black py-12 md:py-16">
          <div className="site-container">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="section-label-light">
                {stats.total} tasks in your workspace
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="btn-primary flex items-center gap-2 self-start"
              >
                add another
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Accent quote cards */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
              {accentCards.map((card) => (
                <div
                  key={card.title}
                  className={`rounded-2xl p-4 md:p-5 ${card.bg} ${card.text}`}
                >
                  <p className="font-serif text-sm italic leading-snug md:text-base">
                    {card.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

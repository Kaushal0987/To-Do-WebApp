"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { ArrowRight, Plus, X } from "lucide-react";
import { taskApi, authApi, Task } from "../lib/apiClient";
import Nav from "../ui/Nav";
import ThemeToggle from "../ui/ThemeToggle";

type TaskFlag = "Ongoing" | "Due" | "Complete";
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border border-neutral-400 border-t-transparent" />
      </div>
    );
  }

  const firstName = userName.split(" ")[0];

  return (
    <div className="min-h-screen">
      <Nav
        links={filterLinks.map((f) => ({
          label: f.label,
          onClick: () => setFilter(f.value),
          active: filter === f.value,
        }))}
        right={
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <button type="button" onClick={logout} className="btn-ghost">
              logout
            </button>
          </div>
        }
      />

      <main className="site-container pb-24">
        {/* Hero */}
        <section className="pt-4 md:pt-8 lg:pt-12">
          <h1 className="display-serif italic text-neutral-900 dark:text-neutral-50">
            {firstName}&apos;s tasks
          </h1>
          <p className="mt-8 max-w-2xl font-sans text-base leading-relaxed text-neutral-600 md:text-lg dark:text-neutral-400">
            You have{" "}
            <span className="text-neutral-900 dark:text-neutral-100">
              {stats.ongoing} ongoing
            </span>
            ,{" "}
            <span className="text-neutral-900 dark:text-neutral-100">
              {stats.due} due
            </span>
            , and{" "}
            <span className="text-neutral-900 dark:text-neutral-100">
              {stats.complete} complete
            </span>{" "}
            — stay focused and move through your list with intention.
          </p>
        </section>

        {/* Tasks section */}
        <section className="mt-20 md:mt-28 lg:mt-36">
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="section-label">your tasks</p>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-ghost flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              new task
            </button>
          </div>

          {showAddForm && (
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="section-label mb-2 block">task title</label>
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
            <p className="mb-8 font-sans text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {filteredTasks.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-serif text-3xl italic text-neutral-400 md:text-4xl">
                {filter === "all" ? "Nothing here yet" : `No ${filter} tasks`}
              </p>
              <p className="mt-4 font-sans text-sm text-neutral-500">
                {filter === "all"
                  ? "Add your first task to get started."
                  : "Try a different filter or create something new."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {filteredTasks.map((task, index) => (
                <article
                  key={task.id}
                  className="group flex min-h-[180px] flex-col justify-between bg-neutral-200/60 p-6 transition duration-300 hover:bg-neutral-200 dark:bg-neutral-900/60 dark:hover:bg-neutral-900 sm:min-h-[220px] md:min-h-[260px] lg:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-sans text-xs text-neutral-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="text-neutral-400 opacity-0 transition hover:text-neutral-900 group-hover:opacity-100 dark:hover:text-neutral-100"
                      title="Delete task"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <h2
                    className={`mt-6 font-serif text-2xl leading-snug md:text-3xl ${
                      task.flag === "Complete"
                        ? "text-neutral-400 line-through"
                        : "text-neutral-900 dark:text-neutral-100"
                    }`}
                  >
                    {task.title}
                  </h2>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    {(["Ongoing", "Due", "Complete"] as TaskFlag[]).map(
                      (flag) => (
                        <button
                          key={flag}
                          type="button"
                          onClick={() => updateFlag(task.id, flag)}
                          className={`font-sans text-xs lowercase tracking-wide transition ${
                            task.flag === flag
                              ? "text-neutral-900 underline decoration-1 underline-offset-4 dark:text-neutral-100"
                              : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                          }`}
                        >
                          {FLAG_LABELS[flag]}
                        </button>
                      ),
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Footer CTA */}
        {tasks.length > 0 && (
          <section className="mt-24 flex items-center justify-between border-t border-neutral-300 pt-10 dark:border-neutral-800">
            <p className="section-label">{stats.total} tasks total</p>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="btn-ghost flex items-center gap-2"
            >
              add another
              <ArrowRight className="h-4 w-4" />
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

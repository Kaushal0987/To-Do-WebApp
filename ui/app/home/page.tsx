"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { taskApi, authApi, Task } from "../lib/apiClient";
import { AxiosError } from "axios";

type TaskFlag = "Ongoing" | "Due" | "Complete";

export default function HomePage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");

  // Load tasks and check login on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.name);
    }

    setLoggedIn(true);
    loadTasks();
  }, [router]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await taskApi.getTasks();
      setTasks(response.tasks);
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!taskInput.trim()) return;

    try {
      const response = await taskApi.createTask(taskInput.trim(), "Ongoing");
      setTasks([response.task, ...tasks]);
      setTaskInput("");
      setError("");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Failed to create task");
    }
  };

  const updateFlag = async (id: number, newFlag: TaskFlag) => {
    try {
      await taskApi.updateTask(id, { flag: newFlag });
      setTasks(tasks.map((t) => (t.id === id ? { ...t, flag: newFlag } : t)));
      setError("");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Failed to update task");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await taskApi.deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
      setError("");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Failed to delete task");
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  if (!loggedIn || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My To-Do List</h1>
            {userName && (
              <p className="text-gray-600 text-sm mt-1">Welcome, {userName}!</p>
            )}
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Add task */}
        <div className="flex gap-4 mb-6 flex-col sm:flex-row">
          <input
            type="text"
            placeholder="Enter a new task..."
            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
          />
          <button
            onClick={addTask}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Add
          </button>
        </div>

        {/* Task list */}
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No tasks yet!</p>
            <p className="text-sm mt-2">Add your first task to get started.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 px-4 py-3 rounded-lg shadow-sm"
              >
                <span className="text-lg font-medium">{task.title}</span>
                <div className="flex gap-2 mt-2 sm:mt-0 items-center">
                  {(["Ongoing", "Due", "Complete"] as TaskFlag[]).map(
                    (flag) => (
                      <button
                        key={flag}
                        onClick={() => updateFlag(task.id, flag)}
                        className={`px-3 py-1 rounded-full text-sm font-semibold transition 
                        ${
                          task.flag === flag
                            ? flag === "Ongoing"
                              ? "bg-yellow-400 text-white"
                              : flag === "Due"
                                ? "bg-red-400 text-white"
                                : "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {flag}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="ml-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold hover:bg-red-200 transition"
                    title="Delete task"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type TaskFlag = "Ongoing" | "Due" | "Complete";

interface Task {
  id: number;
  title: string;
  flag: TaskFlag;
}

export default function HomePage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks and check login on mount
  useEffect(() => {
    const isLogged = localStorage.getItem("loggedIn") === "true";
    if (!isLogged) {
      router.push("/login");
    } else {
      setLoggedIn(true);
      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) setTasks(JSON.parse(savedTasks));
    }
  }, [router]);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!taskInput.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      title: taskInput.trim(),
      flag: "Ongoing",
    };
    setTasks([...tasks, newTask]);
    setTaskInput("");
  };

  const updateFlag = (id: number, newFlag: TaskFlag) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, flag: newFlag } : t)));
  };

  const logout = () => {
    localStorage.removeItem("loggedIn");
    router.push("/login");
  };

  if (!loggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My To-Do List</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Add task */}
        <div className="flex gap-4 mb-6 flex-col sm:flex-row">
          <input
            type="text"
            placeholder="Enter a new task..."
            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />
          <button
            onClick={addTask}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Add
          </button>
        </div>

        {/* Task list */}
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 px-4 py-3 rounded-lg shadow-sm"
            >
              <span className="text-lg font-medium">{task.title}</span>
              <div className="flex gap-2 mt-2 sm:mt-0">
                {(["Ongoing", "Due", "Complete"] as TaskFlag[]).map((flag) => (
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
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

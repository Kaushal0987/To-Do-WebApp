"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../lib/apiClient";
import { AxiosError } from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.register(
        form.name,
        form.email,
        form.password,
      );

      // Store token and user info
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Redirect to home
      router.push("/home");
    } catch (err) {
      const error = err as AxiosError<{
        message: string;
        errors?: Record<string, string[]>;
      }>;

      if (error.response?.data?.errors) {
        // Show first validation error
        const firstError = Object.values(error.response.data.errors)[0];
        setError(firstError[0]);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            required
            value={form.name}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password (min. 8 characters)"
            required
            minLength={8}
            value={form.password}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition disabled:bg-green-300 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-gray-500">
            Already have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

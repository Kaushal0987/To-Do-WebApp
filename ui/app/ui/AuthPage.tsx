"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { authApi } from "../lib/apiClient";
import Nav from "./Nav";
import ThemeToggle from "./ThemeToggle";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode: AuthMode =
    searchParams.get("signup") === "1" ? "signup" : "login";

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.replace("/home");
      return;
    }
    setCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    setMode(searchParams.get("signup") === "1" ? "signup" : "login");
  }, [searchParams]);

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError("");
    setForm({ name: "", email: "", password: "" });
    router.replace(next === "signup" ? "/?signup=1" : "/", { scroll: false });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response =
        mode === "login"
          ? await authApi.login(form.email, form.password)
          : await authApi.register(form.name, form.email, form.password);

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      router.push("/home");
    } catch (err) {
      const axiosError = err as AxiosError<{
        message: string;
        errors?: Record<string, string[]>;
      }>;

      if (axiosError.response?.data?.errors) {
        const firstError = Object.values(axiosError.response.data.errors)[0];
        setError(firstError[0]);
      } else if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        setError(
          mode === "login"
            ? "Login failed. Please try again."
            : "Registration failed. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border border-neutral-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Nav
        links={[
          {
            label: "sign in",
            onClick: () => switchMode("login"),
            active: mode === "login",
          },
          {
            label: "sign up",
            onClick: () => switchMode("signup"),
            active: mode === "signup",
          },
        ]}
        right={<ThemeToggle />}
      />

      <main className="site-container pb-20 pt-8 md:pt-16 lg:pt-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 xl:gap-32">
          {/* Hero */}
          <div className="flex flex-col justify-center">
            <h1 className="display-serif italic text-neutral-900 dark:text-neutral-50">
              {mode === "login" ? "TaskFlow" : "Join us"}
            </h1>
            <p className="mt-8 max-w-md font-sans text-base leading-relaxed text-neutral-600 md:text-lg dark:text-neutral-400">
              {mode === "login"
                ? "A thoughtful task manager for people who value clarity. Sign in to pick up where you left off."
                : "Create your account and start organizing your day with a calm, focused workspace."}
            </p>

            {mode === "login" && (
              <p className="mt-10 font-sans text-sm text-neutral-400">
                demo — demo@example.com / password
              </p>
            )}
          </div>

          {/* Form */}
          <div className="flex flex-col justify-center lg:py-12">
            <p className="section-label mb-8">
              {mode === "login" ? "sign in" : "create account"}
            </p>

            {error && (
              <p className="mb-6 font-sans text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <form className="space-y-8" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div>
                  <label className="section-label mb-2 block">name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={form.name}
                    disabled={loading}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="input-minimal"
                  />
                </div>
              )}

              <div>
                <label className="section-label mb-2 block">email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={form.email}
                  disabled={loading}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="input-minimal"
                />
              </div>

              <div>
                <label className="section-label mb-2 block">password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      mode === "signup" ? "Min. 8 characters" : "Your password"
                    }
                    required
                    minLength={mode === "signup" ? 8 : undefined}
                    value={form.password}
                    disabled={loading}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="input-minimal pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading
                    ? mode === "login"
                      ? "signing in..."
                      : "creating..."
                    : mode === "login"
                      ? "sign in"
                      : "create account"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    switchMode(mode === "login" ? "signup" : "login")
                  }
                  className="btn-ghost"
                >
                  {mode === "login" ? "need an account?" : "have an account?"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

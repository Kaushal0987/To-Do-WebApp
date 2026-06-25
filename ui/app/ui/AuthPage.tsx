"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { authApi } from "../lib/apiClient";
import { accentCards } from "../lib/theme";
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
      <div className="flex min-h-screen items-center justify-center bg-brand-black">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Dark hero */}
      <section className="bg-brand-black text-white">
        <Nav
          variant="dark"
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
          right={<ThemeToggle variant="dark" />}
        />

        <div className="site-container pb-16 pt-4 md:pb-24 md:pt-8">
          <h1 className="display-serif max-w-4xl text-white">
            {mode === "login" ? (
              <>
                Organize your{" "}
                <span className="italic text-brand-accent">life</span>, one
                task at a time
              </>
            ) : (
              <>
                Start your{" "}
                <span className="italic text-brand-accent">journey</span> today
              </>
            )}
          </h1>
          <p className="mt-8 max-w-xl font-sans text-base leading-relaxed text-white/60 md:text-lg">
            {mode === "login"
              ? "A bold, focused task manager for people who value clarity and momentum."
              : "Create your account and build a workspace that keeps you moving forward."}
          </p>

          {/* Feature cards */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:gap-6">
            {accentCards.slice(0, 2).map((card) => (
              <div
                key={card.title}
                className={`rounded-3xl p-8 md:p-10 ${card.bg} ${card.text}`}
              >
                <p className="section-label !text-current/50 !normal-case">
                  taskflow
                </p>
                <p className="mt-4 font-serif text-2xl italic md:text-3xl">
                  {card.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cream form section */}
      <section className="bg-brand-cream">
        <div className="site-container py-16 md:py-24">
          <div className="mx-auto max-w-lg">
            <p className="section-label mb-2">
              {mode === "login" ? "welcome back" : "get started"}
            </p>
            <h2 className="font-serif text-4xl text-brand-black md:text-5xl">
              {mode === "login" ? (
                <>
                  Sign <span className="italic text-brand-accent">in</span>
                </>
              ) : (
                <>
                  Create{" "}
                  <span className="italic text-brand-accent">account</span>
                </>
              )}
            </h2>

            {error && (
              <p className="mt-6 rounded-2xl bg-brand-burgundy/10 px-4 py-3 font-sans text-sm text-brand-burgundy">
                {error}
              </p>
            )}

            <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div>
                  <label className="section-label mb-2 block !normal-case">
                    Name
                  </label>
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
                <label className="section-label mb-2 block !normal-case">
                  Email
                </label>
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
                <label className="section-label mb-2 block !normal-case">
                  Password
                </label>
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
                    className="input-minimal pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-black/40 hover:text-brand-black"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
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
                  className="btn-ghost btn-ghost-light"
                >
                  {mode === "login" ? "need an account?" : "have an account?"}
                </button>
              </div>
            </form>

            {mode === "login" && (
              <p className="mt-8 font-sans text-sm text-brand-black/40">
                Demo — demo@example.com / password
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

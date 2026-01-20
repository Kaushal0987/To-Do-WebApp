"use client";

import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ListTodo,
  Zap,
  Shield,
  Clock,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-40"></div>

      <div className="relative z-10">
        <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ListTodo className="w-8 h-8 text-emerald-400" />
            <span className="text-2xl font-bold text-white">TaskFlow</span>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 text-white hover:text-emerald-400 transition-colors duration-200 font-medium"
          >
            Sign In
          </button>
        </nav>

        <section className="container mx-auto px-6 pt-20 pb-32 md:pt-32 md:pb-48">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">
                Boost Your Productivity
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight">
              Organize Your Life,{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                One Task at a Time
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
              The smart task management solution that helps you stay focused,
              organized, and in control of your daily goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={() => router.push("/register")}
                className="group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-lg transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 w-full sm:w-auto"
              >
                Get Started Free
                <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              </button>

              <button
                onClick={() => router.push("/login")}
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-lg transition-all duration-200 border border-slate-700 hover:border-slate-600 w-full sm:w-auto"
              >
                Sign In
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors duration-300">
                <Clock className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Smart Scheduling
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Prioritize what matters most with intelligent task scheduling
                and deadline tracking.
              </p>
            </div>

            <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors duration-300">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Progress Tracking
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Visualize your productivity with detailed analytics and
                achievement insights.
              </p>
            </div>

            <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors duration-300">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Secure & Private
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Your data is encrypted and protected with enterprise-grade
                security measures.
              </p>
            </div>
          </div>
        </section>

        <footer className="container mx-auto px-6 py-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <ListTodo className="w-6 h-6 text-emerald-400" />
              <span className="text-lg font-semibold text-white">TaskFlow</span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2025 TaskFlow. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

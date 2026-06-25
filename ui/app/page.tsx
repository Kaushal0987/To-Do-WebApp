import { Suspense } from "react";
import AuthPage from "./ui/AuthPage";

function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <AuthPage />
    </Suspense>
  );
}

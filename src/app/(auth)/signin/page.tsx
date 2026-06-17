"use client";

import templateService from "@/service/template.service";
import { CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);


  const handleGoogleSignIn = async () => {
    setLoading(true);
    window.location.href = templateService.triggerGoogle();
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#1D9E75 1px, transparent 1px), linear-gradient(90deg, #1D9E75 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
          {/* Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-brand-400 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-brand-900" />
            </div>
            <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
              EOD Reporter
            </h1>
            <p className="text-sm text-zinc-400 mt-1 text-center leading-relaxed">
              Log daily work, sync to Zoho,
              <br />
              and send automated EOD summaries.
            </p>
          </div>

          {/* Features list */}
          <ul className="space-y-2 mb-8">
            {[
              "Pull tasks & hours from Google Sheets",
              "Sync logs to Zoho Projects automatically",
              "Send EOD summary via Gmail",
            ].map((f) => (
              <li
                key={f}
                className="flex items-start gap-2.5 text-sm text-zinc-400"
              >
                <CheckCircle className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading }
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-xl text-sm font-medium text-zinc-100 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <GoogleIcon />
            )}
            {loading ? "Signing in…" : "Continue with Google"}
          </button>

          <p className="text-xs text-zinc-600 text-center mt-4">
            By continuing, you agree to our terms of service.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-700 mt-6">
          EOD Reporter · Built with Next.js & NextAuth
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

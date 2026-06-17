"use client";

import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const logs = [
  "INITIALIZING_HANDSHAKE...",
  "CERTIFICATE_VALIDATED",
  "ENCRYPTING_SESSION_KEYS...",
];

export function SecureGateway() {
  const [visibleLogs, setVisibleLogs] = useState<number[]>([]);

  useEffect(() => {
    logs.forEach((_, index) => {
      setTimeout(
        () => {
          setVisibleLogs((prev) => [...prev, index]);
        },
        800 * (index + 1),
      );
    });
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-zinc-950 text-gray-200">
      {/* Main */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5">
        <div className="max-w-sm space-y-4 text-center">
          <h1 className="text-xl font-semibold uppercase tracking-wider text-[#ebffe2] md:text-2xl">
            Establishing Secure Connection
          </h1>

          <p className="mx-auto max-w-[280px] text-sm leading-relaxed text-gray-400">
            Verifying your credentials and securing your session through
            end-to-end encrypted tunnels...
          </p>
        </div>

        {/* Logs */}
        <div className="mt-10 flex w-full max-w-[240px] flex-col items-start gap-2 font-mono text-xs text-brand-400">
          {logs.map((log, index) => (
            <div
              key={log}
              className={`flex items-center gap-2 transition-all duration-500 ${
                visibleLogs.includes(index)
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0"
              }`}
            >
              <span className="h-1 w-1 rounded-full bg-[#ebffe2]" />
              <span>{log}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
export default function Connect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      Cookies.set("access_token", token, {
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      router.replace("/dashboard");
    } else {
      window.location.reload();
    }
  }, [searchParams, router]);

  return (
    <div>
      <SecureGateway />
    </div>
  );
}

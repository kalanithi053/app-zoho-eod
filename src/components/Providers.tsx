"use client";

import templateService from "@/service/template.service";
import { useUserStore } from "@/store/useAuthStore";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const setUser = useUserStore((state) => state.setUser);
  const pathName = usePathname();
  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const response = await templateService.getProfileDetials();

        if (mounted && response?.success) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    if (pathName?.includes("dashboard") || pathName?.includes("settings"))
      loadProfile();

    return () => {
      mounted = false;
    };
  }, [setUser]);

  return <>{children}</>;
}

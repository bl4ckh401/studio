"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, meAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function check() {
      try {
        // If user already present, no need to check
        if (user) {
          if (mounted) setChecking(false);
          return;
        }

        const u = await meAuth();
        if (!u) {
          // redirect to login and include next param
          const next = pathname || "/dashboard";
          router.push(`/login?next=${encodeURIComponent(next)}`);
        }
      } catch (err) {
        router.push("/login");
      } finally {
        if (mounted) setChecking(false);
      }
    }
    check();
    return () => {
      mounted = false;
    };
  }, [user, meAuth, router, pathname]);

  if (checking) {
    // while verifying, render nothing to avoid flashing protected UI
    return null;
  }

  return <>{children}</>;
}

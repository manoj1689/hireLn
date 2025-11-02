"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/landing");
      return;
    }

    if (user?.role === "RECRUITER") {
      if (user.registered) {
        router.push("/dashboard");
      } else {
        router.push("/register");
      }
    } else if (user?.role === "GUEST") {
      router.push("/landing/try-now");
    }
  }, [isAuthenticated, user, router]);

  return null;
}

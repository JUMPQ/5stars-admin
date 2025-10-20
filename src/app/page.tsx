"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // wait until auth check is done
    if (user) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/login");
    }
  }, [user, loading, router]);

  return null; // or a loader/spinner if you want
}

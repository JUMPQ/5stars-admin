"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    if (user.role === "admin") {
      router.replace("/admin");
    } else {
      router.replace("/team");
    }
  }, [user, router]);

  return null;
};

export default Page;

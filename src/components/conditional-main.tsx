"use client";

import { useNotFound } from "@/contexts/not-found-context";
import { usePathname } from "next/navigation";
import { createElement, type ReactNode } from "react";

export default function ConditionalMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isNotFound } = useNotFound();

  const authPages = [
    "/login",
    "/otp",
    "/forgot-password",
    "/reset-password",
  ];
  const isAuthPage = authPages.some((page) => pathname.startsWith(page));

  return createElement(
    "main",
    {
      className:
        isNotFound || isAuthPage ? "flex-1 w-full min-h-svh" : "flex-1 w-full max-w-360 mx-auto",
    },
    children,
  );
}

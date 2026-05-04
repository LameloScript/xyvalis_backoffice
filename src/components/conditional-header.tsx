"use client";

import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import { useNotFound } from "@/contexts/not-found-context";
import Header from "@/components/header";

export default function ConditionalHeader() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isNotFound } = useNotFound();
  const pathname = usePathname();

  // Pages d'authentification où le header ne doit jamais s'afficher
  const authPages = ['/login', '/otp', '/forgot-password'];
  const isAuthPage = authPages.some(page => pathname.startsWith(page));

  // Ne pas afficher le header pendant le chargement, sur les pages d'auth, sur la page 404, ou si non authentifié
  if (isLoading || isAuthPage || isNotFound || !isAuthenticated) {
    return null;
  }

  return <Header />;
}

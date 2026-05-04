"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, LogIn } from "lucide-react";
import { useNotFound } from "@/contexts/not-found-context";
import { useAuth } from "@/contexts/auth-context";

export default function NotFound() {
  const { setIsNotFound } = useNotFound();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setIsNotFound(true);
    return () => setIsNotFound(false);
  }, [setIsNotFound]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8">
          <Image
            src="/assets/logo/logo-xyvalis-w.png"
            alt="Xyvalis Delivery"
            width={320}
            height={200}
            className="object-contain"
          />
        </div>

        <h1 className="text-9xl font-bold text-gray-200 select-none">404</h1>

        <h2 className="text-2xl font-semibold text-gray-900 mt-4 mb-2">
          Page non trouvée
        </h2>

        <p className="text-gray-600 mb-8">
          Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default">
            <Link href={isAuthenticated ? "/dashboard" : "/login"}>
              {isAuthenticated ? (
                <>
                  <Home className="mr-2 h-4 w-4" />
                  Retour au tableau de bord
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Se connecter
                </>
              )}
            </Link>
          </Button>

          <Button asChild variant="outline">
            <span className="cursor-pointer" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Page précédente
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

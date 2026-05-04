"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { useNotFound } from "@/contexts/not-found-context";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeNames: Record<string, string> = {
  dashboard: "Tableau de bord",
  products: "Produits",
  new: "Nouveau",
  orders: "Commandes",
  commandes: "Commandes",
  customers: "Clients",
  reviews: "Avis",
  analytics: "Statistiques",
  wallet: "Portefeuille",
  settings: "Paramètres",
  promotions: "Promotions",
};

export default function DynamicBreadcrumb() {
  const pathname = usePathname();
  const { isNotFound } = useNotFound();

  // Ne pas afficher sur la page de login, la page d'accueil ou la page 404
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/otp" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    isNotFound
  ) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);

  // Si pas de segments, ne rien afficher
  if (segments.length === 0) {
    return null;
  }

  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];
  const firstLabel = routeNames[firstSegment] || firstSegment;
  const lastLabel = routeNames[lastSegment] || lastSegment;
  const firstHref = "/" + firstSegment;

  return (
    <div className="border-b bg-white">
      <div className="max-w-360 mx-auto px-4 md:px-6 py-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" aria-label="Accueil">
                  <Home className="size-4" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {segments.length === 1 ? (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-primary font-medium">
                    {firstLabel}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={firstHref}>{firstLabel}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>

                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-primary font-medium">
                    {lastLabel}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { useNotFound } from "@/contexts/not-found-context";
import { useAuth } from "@/contexts/auth-context";
import { useBreadcrumb } from "@/contexts/breadcrumb-context";
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
  organisateurs: "Organisateurs",
  prestataires: "Prestataires",
  reviews: "Avis",
  analytics: "Statistiques",
  wallet: "Portefeuille",
  settings: "Paramètres",
  promotions: "Promotions",
};

export default function DynamicBreadcrumb() {
  const pathname = usePathname();
  const { isNotFound } = useNotFound();
  const { isAuthenticated, isLoading } = useAuth();
  const { customLabels } = useBreadcrumb();

  // Ne pas afficher sur la page de login, la page d'accueil, si non authentifié ou la page 404
  if (
    isLoading ||
    !isAuthenticated ||
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
  const firstLabel = customLabels[firstSegment] || routeNames[firstSegment] || firstSegment;
  const lastLabel = customLabels[lastSegment] || routeNames[lastSegment] || lastSegment;
  const firstHref = "/" + firstSegment;

  return (
    <div className="bg-primary border-b border-primary/20">
      <div className="max-w-360 mx-auto px-4 lg:px-6 py-2.5">
        <Breadcrumb>
          <BreadcrumbList className="text-primary-foreground/70 [&_svg]:text-primary-foreground/50">
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-primary-foreground/70 hover:text-white transition-colors">
                <Link href="/" aria-label="Accueil">
                  <Home className="size-4" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {segments.length === 1 ? (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-semibold">
                    {firstLabel}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="text-primary-foreground/70 hover:text-white transition-colors">
                    <Link href={firstHref}>{firstLabel}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {segments.length > 2 && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbEllipsis className="text-primary-foreground/70" />
                    </BreadcrumbItem>
                  </>
                )}

                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-semibold">
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

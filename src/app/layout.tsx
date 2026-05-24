import type { Metadata } from "next";
import { Geist_Mono, Nunito_Sans, Oxanium } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { NotFoundProvider } from "@/contexts/not-found-context";
import { BreadcrumbProvider } from "@/contexts/breadcrumb-context";
import ConditionalHeader from "@/components/conditional-header";
import ConditionalFooter from "@/components/conditional-footer";
import DynamicBreadcrumb from "@/components/dynamic-breadcrumb";
import ConditionalMain from "@/components/conditional-main";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const nunitoSansHeading = Nunito_Sans({ subsets: ['latin'], variable: '--font-heading' });

const oxanium = Oxanium({ subsets: ['latin'], variable: '--font-sans' });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "event Reco",
  description: "Plateforme de livraison event Reco",
  icons: {
    icon: '/assets/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, oxanium.variable, nunitoSansHeading.variable)}
    >
      <body className="min-h-svh flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <NotFoundProvider>
              <BreadcrumbProvider>
                <LayoutContent>{children}</LayoutContent>
              </BreadcrumbProvider>
            </NotFoundProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConditionalHeader />
      <DynamicBreadcrumb />
      <ConditionalMain>{children}</ConditionalMain>
      <ConditionalFooter />
      <Toaster position="top-right" richColors />
    </>
  );
}

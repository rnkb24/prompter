import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PromptProvider } from "@/lib/store/prompt-context";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prompt Organizer",
  description: "Organize and manage your prompts efficiently.",
};

import { Suspense } from "react";
// ... imports

// ...
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PromptProvider>
          <div className="flex h-screen overflow-hidden bg-background">
            <Suspense fallback={null}>
              <MobileNav />
            </Suspense>
            <Suspense fallback={<div className="hidden md:flex w-64 border-r bg-gray-50/40" />}>
              <Sidebar className="hidden md:flex w-64 flex-shrink-0" />
            </Suspense>
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </PromptProvider>
      </body>
    </html>
  );
}

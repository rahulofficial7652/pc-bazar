"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LayoutManager({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide navbar/footer on admin & other specific routes
  const hide =
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/super-admin";

  const hideNav =
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/super-admin";

  return (
    <SessionProvider>
      {!hideNav && <Navbar />}
      {children}
      {!hideNav && <Footer />}
    </SessionProvider>
  );
}


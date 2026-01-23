"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function LayoutManager({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide navbar/footer on admin & other specific routes
  const hide =
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/super-admin" ||
    pathname === "/dashboard";

  return (
    <>
      {!hide && <Navbar />}
      {children}
      {!hide && <Footer />}
    </>
  );
}


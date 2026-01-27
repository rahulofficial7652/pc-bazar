import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/signup");
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

    // 1. If user is logged in and tries to access Auth pages, redirect them
    if (isAuthPage) {
        if (isAuth) {
             // @ts-ignore
             if (token?.role === "ADMIN") {
                 return NextResponse.redirect(new URL("/admin", req.url));
             }
             return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        return null; // Allow access to login/signup if not logged in
    }

    // 2. Protect Admin Routes
    if (isAdminPage) {
        // @ts-ignore
        if (token?.role !== "ADMIN") {
             // Redirect regular users to their dashboard if they try to access admin
             return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }
    
    return null;
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // We handle logic above
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/signup"],
};

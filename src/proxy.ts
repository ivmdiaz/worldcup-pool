import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  // No autenticado: solo puede estar en /
  if (!req.auth && pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // PENDING: solo puede estar en /pending
  if (req.auth && role === "PENDING" && pathname !== "/pending") {
    return NextResponse.redirect(new URL("/pending", req.url));
  }

  // USER no puede acceder a /admin
  if (req.auth && role === "USER" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/matches", req.url));
  }

  // Autenticado y aprobado: no tiene sentido estar en / ni /pending
  if (req.auth && (role === "USER" || role === "ADMIN") && (pathname === "/" || pathname === "/pending")) {
    return NextResponse.redirect(new URL("/matches", req.url));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

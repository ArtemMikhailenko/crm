import { type NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/"];
const authRoutes = ["/auth/:path*"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session")?.value;

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.match(new RegExp(route.replace('*', '.*'))));

  // If user has session and tries to access auth pages, redirect to dashboard
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // In development mode, allow access to all routes (we use localStorage for auth)
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // TEMP: Allow access without authorization to all routes for now
  // Keep only the redirect for logged-in users away from auth routes

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

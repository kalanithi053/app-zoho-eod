import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;

  if (pathname === "/signin" && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/settings")) &&
    !accessToken
  ) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (pathname.startsWith("/connect") && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/signin", "/connect", "/dashboard/:path*", "/settings/:path*"],
};

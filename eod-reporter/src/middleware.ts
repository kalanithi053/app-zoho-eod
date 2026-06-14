export { default } from "next-auth/middleware";

export const config = {
  // Protect all routes under /dashboard and /settings
  matcher: ["/dashboard/:path*", "/settings/:path*"],
};

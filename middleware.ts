import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "rf_session";

export function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isPrivateApi =
    request.nextUrl.pathname.startsWith("/api/businesses") ||
    request.nextUrl.pathname.startsWith("/api/stripe/checkout");

  if ((isDashboard || isPrivateApi) && !session) {
    if (isPrivateApi) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/businesses/:path*", "/api/stripe/checkout"],
};

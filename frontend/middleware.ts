import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");

  const loginOrSignupPaths = ["/login", "/signup"];
  if (token && loginOrSignupPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    !token &&
    req.nextUrl.pathname !== "/login" &&
    req.nextUrl.pathname !== "/signup"
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/setting", "/login", "/signup"],
};

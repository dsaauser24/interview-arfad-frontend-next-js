import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = await getToken({ req, secret: process.env.NEXT_SECRET });

  if (
    !token &&
    !url.pathname.startsWith("/auth") &&
    !url.pathname.startsWith("/api")
  ) {
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  if (token && url.pathname.startsWith("/auth")) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

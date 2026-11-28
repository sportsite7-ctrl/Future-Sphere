import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILES = new Set([
  "/favicon.png",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/news-sitemap.xml",
  "/manifest.webmanifest",
]);

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    PUBLIC_FILES.has(pathname) ||
    /\.[^/]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/uk", request.url), 308);
  }

  const localized = pathname.match(/^\/(uk|en)(\/.*)?$/);
  if (localized) {
    const locale = localized[1];
    const internalPath = localized[2] || "/";
    const destination = new URL(internalPath + search, request.url);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-fs-locale", locale);
    return NextResponse.rewrite(destination, { request: { headers: requestHeaders } });
  }

  return NextResponse.redirect(new URL("/uk" + pathname + search, request.url), 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

import authConfig from "./auth.config"
import NextAuth from "next-auth"
import { publicRoutes, protectedRoutes, authRoutes, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT } from "./routes"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname) || nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/day/")
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname)

  // 1. API Auth routes always allowed
  if (isApiAuthRoute) return NextResponse.next()

  // 2. Agar user logged in hai aur sign-in page kholne ki koshish kare, toh use dashboard pe bhej do
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return NextResponse.next()
  }

  // 3. Agar route protected hai (jaise dashboard) aur user logged in NAHI hai, toh sign-in pe bhej do
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl))
  }

  // 4. Public routes (Landing page, etc.) sabke liye allowed hain
  if (isPublicRoute) {
    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
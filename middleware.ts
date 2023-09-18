import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  console.log("MIDDLEWARE: ", req.nextUrl.toString())
  // We need to create a response and hand it to the supabase client to be able to modify the response headers.
  const res = NextResponse.next()
  // Create authenticated Supabase Client.
  const supabase = createMiddlewareClient({ req, res })
  // Check if we have a session
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  // Check auth condition
  if (session) {
    // Authentication successful, forward request to protected route.
    console.log("AUTH SUCCESSFUL")
    return res
  }

  //!: REMOVE AFTER FIXING REDIRECTING ISSUE
  console.log("MIDDLEWARE: ", "AUTH FAILED", req.nextUrl.toString())
  console.log(req.nextUrl)
  if (error) {
    console.log(error)
  }

  // Auth condition not met, redirect to home page.
  const redirectUrl = req.nextUrl.clone()
  redirectUrl.pathname = "/login"
  redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: [
    "/((?!login|signup|about|api|_next/static|_next/image|favicon.ico).*)",
  ],
}

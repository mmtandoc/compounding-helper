import { NextMiddleware, NextRequest, NextResponse } from "next/server"

export const middleware: NextMiddleware = (req: NextRequest) => {
  const basicAuth = req.headers.get("authorization")
  const url = req.nextUrl

  const basicAuthCredentials = process.env.BASIC_AUTH_CREDENTIALS

  if (basicAuth && basicAuthCredentials) {
    const authValue = basicAuth.split(" ")[1]
    const [user, pwd] = atob(authValue).split(":")
    const [correctUser, correctPwd] = basicAuthCredentials.split(":")
    if (user === correctUser && pwd === correctPwd) {
      return NextResponse.next()
    }
  }
  url.pathname = "/api/auth"

  return NextResponse.rewrite(url)
}

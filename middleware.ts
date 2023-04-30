import { NextMiddleware, NextRequest, NextResponse } from "next/server"

export const middleware: NextMiddleware = (req: NextRequest) => {
  const basicAuthCredentials = process.env.BASIC_AUTH_CREDENTIALS

  if (!basicAuthCredentials) {
    return NextResponse.next()
  }

  const validCredentials = basicAuthCredentials.split(";").map((cred) => {
    const [username, password] = cred.split(":")
    return { username, password }
  })

  const basicAuth = req.headers.get("authorization")

  if (basicAuth) {
    const credentials = basicAuth.split(" ")[1]
    const [user, password] = atob(credentials).split(":")
    if (
      validCredentials.some(
        ({ username: validUsername, password: validPassword }) =>
          user === validUsername && password === validPassword,
      )
    ) {
      return NextResponse.next()
    }
  }

  return NextResponse.rewrite(new URL("/api/auth", req.url))
}

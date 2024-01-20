import { ParsedUrlQuery } from "querystring"

import { CookieOptions } from "@supabase/auth-helpers-shared"
import { isError } from "lodash"
import { GetServerSideProps, PreviewData } from "next"

import { AppSession, getSession } from "lib/api/utils"

type AddParameters<
  TFunction extends (...args: any) => any,
  TParameters extends [...args: any],
> = (
  ...args: [...Parameters<TFunction>, ...TParameters]
) => ReturnType<TFunction>

type WithPageAuthProps<
  Props extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
> = (
  | {
      requireAuth?: true
      getServerSideProps?: AddParameters<
        GetServerSideProps<Props, Params, Preview>,
        [AppSession]
      >
      redirectTo?: string
      cookieOptions?: CookieOptions
    }
  | {
      requireAuth: false
      getServerSideProps?: AddParameters<
        GetServerSideProps<Props, Params, Preview>,
        [AppSession | null]
      >
      redirectTo?: never
    }
) & {
  cookieOptions?: CookieOptions
}

export default function withPageAuth<
  Props extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
>({
  getServerSideProps,
  requireAuth,
  redirectTo = "/",
  cookieOptions,
}: WithPageAuthProps<Props, Params, Preview>): GetServerSideProps<
  Props,
  Params,
  Preview
> {
  return async (context) => {
    try {
      const session = await getSession(context, { cookieOptions })

      let gsspRes: any = { props: {} }

      if (getServerSideProps) {
        if (requireAuth === false) {
          gsspRes = await getServerSideProps(context, session)
        } else {
          if (session === null) {
            throw new Error("Unauthenticated")
          }
          gsspRes = await getServerSideProps(context, session)
        }
      }

      return {
        ...gsspRes,
        props: {
          initialAppSession: session,
          ...gsspRes.props,
        },
      }
    } catch (error) {
      // Don't catch other errors thrown by getServerSideProps
      if (isError(error) && error.message !== "Unauthenticated") {
        throw error
      }

      if (requireAuth) {
        return {
          redirect: {
            destination: redirectTo,
            permanent: false,
          },
        }
      }

      return { props: {} }
    }
  }
}

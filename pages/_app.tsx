import { User } from "@prisma/client"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import axios, { isCancel } from "axios"
import App, { AppContext } from "next/app"
import { SnackbarProvider, closeSnackbar } from "notistack"
import { useEffect, useState } from "react"
import { IconContext } from "react-icons"
import { MdClose } from "react-icons/md"
import { SWRConfig, mutate } from "swr"

import { getDefaultLayout } from "components/common/layouts/DefaultLayout"
import { IconButton } from "components/ui"
import { Alert } from "components/ui/Alert"
import { AppSession, getSession } from "lib/api/utils"
import {
  AppAbility,
  defineAbilityForUser,
  unauthAbility,
} from "lib/auth/ability/appAbilities"
import { AbilityContext } from "lib/contexts/AbilityContext"
import { AppPropsWithLayout } from "types/common"

import "styles/main.scss"

//TODO: Move to separate file
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDates = (body: any) => {
  if (body === null || body === undefined || typeof body !== "object") {
    return body
  }

  const isIsoDateString = (value: unknown): boolean => {
    return (
      value !== null &&
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/.test(
        value,
      )
    )
  }

  for (const key of Object.keys(body)) {
    const value = body[key]
    if (isIsoDateString(value)) {
      body[key] = new Date(value)
    } else if (typeof value === "object") {
      handleDates(value)
    }
  }
}

axios.interceptors.response.use((originalResponse) => {
  handleDates(originalResponse.data)
  return originalResponse
})

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export const multiFetcher = (
  urls: Record<string, string> | string[] | string,
) => {
  if (typeof urls === "string") {
    return fetcher(urls)
  }

  const urlEntries = Object.entries(urls)
  if (urlEntries.length === 0) {
    return
  }

  return Promise.allSettled(
    urlEntries.map(([key, url]) =>
      fetcher(url)
        .then<{ key: string; data: unknown }>((response) => {
          return { key, data: response }
        })
        .catch<{ key: string; data: unknown }>((response) => {
          return { key, data: response }
        }),
    ),
  ).then((results) => {
    const entries: [key: string, data: unknown][] = results.map((result) => {
      const { key, data } =
        result.status === "fulfilled"
          ? result.value
          : (result.reason as { key: string; data: unknown })

      return [key, data]
    })

    if (Array.isArray(urls)) {
      return entries.map(([, data]) => data)
    }

    return Object.fromEntries(entries)
  })
}

function MyApp({
  Component,
  pageProps,
  initialAppSession,
}: AppPropsWithLayout<{
  initialAppSession?: AppSession
}> & {
  initialAppSession?: AppSession
}) {
  initialAppSession ??= pageProps.initialAppSession
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  // Track whether user is signed in to override initialSession to be null
  // Otherwise, signing out while on a page that gives an "initialSession" page prop causes header to not update
  const [isSignedIn, setIsSignedIn] = useState(!!initialAppSession)

  const [currentUser, setCurrentUser] = useState<User | undefined>()

  const [ability, setAbility] = useState<AppAbility>(
    initialAppSession
      ? defineAbilityForUser(initialAppSession.appUser)
      : unauthAbility,
  )

  useEffect(() => {
    console.log({ ability })
  }, [ability])

  useEffect(() => {
    if (currentUser) {
      setAbility(defineAbilityForUser(currentUser))
    }
    console.log({ currentUser: currentUser })
  }, [currentUser])

  //TODO: Improve current user profile handling
  useEffect(() => {
    const controller = new AbortController()
    async function getCurrentUser() {
      return axios
        .get<User>("/api/users/current", { signal: controller.signal })
        .then((res) => res.data)
        .catch((e) => {
          if (isCancel(e)) {
            return undefined
          }
        })
    }
    supabaseClient.auth.onAuthStateChange(async (e) => {
      switch (e) {
        case "INITIAL_SESSION":
          setIsSignedIn(true)
          break
        case "SIGNED_IN":
        case "TOKEN_REFRESHED":
        case "USER_UPDATED":
          mutate("/api/users/current")
          setIsSignedIn(true)
          getCurrentUser().then((currentUser) => setCurrentUser(currentUser))
          break
        case "SIGNED_OUT":
          mutate("/api/users/current", null)
          setIsSignedIn(false)
          ability.update([])
          break
      }
    })

    return () => {
      controller.abort()
    }
  }, [ability, supabaseClient.auth])

  const getLayout = Component.getLayout ?? getDefaultLayout
  const layout = getLayout(<Component {...pageProps} />, pageProps)

  return (
    <>
      <SWRConfig
        value={{
          fetcher: multiFetcher,
          fallback: {
            "/api/users/current": initialAppSession?.appUser,
          },
        }}
      >
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={
            isSignedIn ? initialAppSession?.authSession : undefined
          }
        >
          <AbilityContext.Provider value={ability}>
            <IconContext.Provider
              value={{
                style: { verticalAlign: "middle", overflow: "visible" },
              }}
            >
              <SnackbarProvider
                Components={{
                  success: Alert,
                  info: Alert,
                  error: Alert,
                  default: Alert,
                  warning: Alert,
                }}
                autoHideDuration={5000}
                action={(snackbarId) => (
                  <IconButton
                    onClick={() => closeSnackbar(snackbarId)}
                    icon={MdClose}
                    variant="text"
                  />
                )}
              >
                {layout}
              </SnackbarProvider>
            </IconContext.Provider>
          </AbilityContext.Provider>
        </SessionContextProvider>
      </SWRConfig>

      <style jsx global>{`
        #__next {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
      `}</style>
    </>
  )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext)

  if ("initialAppSession" in appProps.pageProps) {
    return appProps
  }

  let session: AppSession | null = null

  // Check if server-side
  if (typeof window === "undefined") {
    session = await getSession({
      req: appContext.ctx.req as any,
      res: appContext.ctx.res as any,
    })
  }

  return { ...appProps, initialAppSession: session ?? undefined }
}

export default MyApp

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import axios from "axios"
import { SnackbarProvider, closeSnackbar } from "notistack"
import { useEffect, useMemo, useState } from "react"
import { IconContext } from "react-icons"
import { MdClose } from "react-icons/md"
import { SWRConfig, mutate } from "swr"

import { getDefaultLayout } from "components/common/layouts/DefaultLayout"
import { IconButton } from "components/ui"
import { Alert } from "components/ui/Alert"
import { AppSession } from "lib/api/utils"
import {
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
}: AppPropsWithLayout<{
  initialAppSession?: AppSession
}>) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  // Track whether user is signed in to override initialSession to be null
  // Otherwise, signing out while on a page that gives an "initialSession" page prop causes header to not update
  const [isSignedIn, setIsSignedIn] = useState(false)

  const ability = useMemo(
    () =>
      isSignedIn && pageProps.initialAppSession
        ? defineAbilityForUser(pageProps.initialAppSession?.appUser)
        : unauthAbility,
    [isSignedIn, pageProps.initialAppSession],
  )

  //TODO: Improve current user profile handling
  useEffect(() => {
    supabaseClient.auth.onAuthStateChange((e) => {
      switch (e) {
        case "SIGNED_IN":
        case "TOKEN_REFRESHED":
        case "USER_UPDATED":
          mutate("/api/users/current")
          setIsSignedIn(true)
          //?: Is ability.update() needed here?
          break
        case "SIGNED_OUT":
          mutate("/api/users/current", null)
          setIsSignedIn(false)
          //?: Is ability.update() needed here?
          break
      }
    })
  }, [supabaseClient.auth])

  const getLayout = Component.getLayout ?? getDefaultLayout
  const layout = getLayout(<Component {...pageProps} />, pageProps)

  return (
    <>
      <AbilityContext.Provider value={ability}>
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={
            isSignedIn ? pageProps.initialAppSession?.authSession : null
          }
        >
          <IconContext.Provider
            value={{ style: { verticalAlign: "middle", overflow: "visible" } }}
          >
            <SWRConfig
              value={{
                fetcher: multiFetcher,
                fallback: {
                  "/api/users/current": pageProps.initialAppSession?.appUser,
                },
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
            </SWRConfig>
          </IconContext.Provider>
        </SessionContextProvider>
      </AbilityContext.Provider>
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

export default MyApp

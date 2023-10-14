import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { ReactNode, useEffect, useState } from "react"

import { AppSession } from "lib/api/utils"
import { AbilityContext } from "lib/contexts/AbilityContext"
import { useCurrentUser } from "lib/hooks/useCurrentUser"

import {
  AppAbility,
  defineAbilityForUser,
  unauthAbility,
} from "./ability/appAbilities"

type Props = {
  initialAppSession?: AppSession | null
  children: ReactNode
}

const AuthProvider = ({ initialAppSession, children }: Props) => {
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  // Track whether user is signed in to override initialSession to be null
  // Otherwise, signing out while on a page that gives an "initialSession" page prop causes header to not update
  const [isSignedIn, setIsSignedIn] = useState(!!initialAppSession)

  const { user, error: userError, mutate: mutateUser } = useCurrentUser()

  if (userError) {
    console.error(userError)
  }

  const [ability, setAbility] = useState<AppAbility>(
    initialAppSession
      ? defineAbilityForUser(initialAppSession.appUser)
      : unauthAbility,
  )

  useEffect(() => {
    console.log({ initialAppSession: initialAppSession })
  }, [initialAppSession])

  useEffect(() => console.log({ ability }), [ability])

  useEffect(() => console.log({ isSignedIn }), [isSignedIn])

  useEffect(() => {
    if (user) {
      setAbility(defineAbilityForUser(user))
    }
  }, [user])

  //TODO: Improve current user profile handling
  useEffect(() => {
    console.log("supabaseClient change")
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (e) => {
        console.log(e)
        switch (e) {
          case "INITIAL_SESSION":
            setIsSignedIn(true)
            break
          case "SIGNED_IN":
          case "USER_UPDATED":
          case "TOKEN_REFRESHED":
            mutateUser()
            setIsSignedIn(true)
            break
          case "SIGNED_OUT":
            mutateUser()
            setIsSignedIn(false)
            ability.update([])
            break
        }
      },
    )

    return () => {
      console.log("UNSUBSCRIBE")
      authListener.subscription.unsubscribe()
    }
  }, [supabaseClient])

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={isSignedIn ? initialAppSession?.authSession : undefined}
    >
      <AbilityContext.Provider value={ability}>
        {children}
      </AbilityContext.Provider>
    </SessionContextProvider>
  )
}

export default AuthProvider

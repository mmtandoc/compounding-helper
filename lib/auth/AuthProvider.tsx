import {
  SupabaseClient,
  createPagesBrowserClient,
} from "@supabase/auth-helpers-nextjs"
import { Session as AuthSession } from "@supabase/supabase-js"
import { useRouter } from "next/router"
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

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

type AuthContext =
  | {
      isLoading: true
      session: null
      error: null
      supabaseClient: SupabaseClient
    }
  | {
      isLoading: false
      session: AppSession
      error: null
      supabaseClient: SupabaseClient
    }
  | {
      isLoading: false
      session: null
      error: Error
      supabaseClient: SupabaseClient
    }
  | {
      isLoading: false
      session: null
      error: null
      supabaseClient: SupabaseClient
    }

const AuthContext = createContext<AuthContext>({
  isLoading: true,
  session: null,
  error: null,
  supabaseClient: {} as any,
})

const AuthProvider = ({ initialAppSession, children }: Props) => {
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  const {
    user,
    error: userError,
    mutate: mutateUser,
    isLoading: isUserLoading,
  } = useCurrentUser({
    fallbackData: initialAppSession?.appUser ?? null,
  })

  const [authSession, setAuthSession] = useState<AuthSession | null>(
    initialAppSession?.authSession ?? null,
  )

  const [isLoading, setIsLoading] = useState<boolean>(!initialAppSession)
  const [error, setError] = useState<Error>()

  const [ability, setAbility] = useState<AppAbility>(
    initialAppSession
      ? defineAbilityForUser(initialAppSession.appUser)
      : unauthAbility,
  )

  useEffect(() => {
    console.log("useEffect", { initialAppSession })
    // As initialAppSession will always be set by MyApp.getInitialProps if it exists,
    // we know that if initialAppSession is null, then a session doesn't exist
    if (!initialAppSession && authSession) {
      setAuthSession(null)
      mutateUser(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAppSession, mutateUser])

  useEffect(() => {
    console.log({ user })
  }, [user])

  /* useEffect(() => {
    async function getActiveSession() {
      console.log("getActiveSession()")
      const {
        data: { session: activeSession },
      } = await supabaseClient.auth.getSession()
      setAuthSession(activeSession ?? null)
      //setIsSignedIn(!!activeSession)
    }

    getActiveSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) */

  useEffect(() => {
    let mounted = true

    async function getSession() {
      console.log("getSession()")
      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession()

      // only update the react state if the component is still mounted
      if (mounted) {
        if (error) {
          setError(error)
          setIsLoading(false)
          return
        }
        setAuthSession(session)
        setIsLoading(false)
      }
    }

    getSession()

    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setAbility(user ? defineAbilityForUser(user) : unauthAbility)
  }, [user])

  const router = useRouter()

  //TODO: Improve current user profile handling
  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (e, session) => {
        console.log(e)
        switch (e) {
          case "INITIAL_SESSION":
          case "SIGNED_IN":
          case "USER_UPDATED":
          case "TOKEN_REFRESHED":
            mutateUser()
            setAuthSession(session)
            break
          case "SIGNED_OUT":
            mutateUser(null)
            setAuthSession(null)
            ability.update([])

            router.push("/login")
            break
        }
      },
    )

    return () => {
      console.log("UNSUBSCRIBE")
      authListener.subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabaseClient])

  const value: AuthContext = useMemo(() => {
    if (isLoading) {
      return {
        isLoading: true,
        session: null,
        error: null,
        supabaseClient,
      }
    }

    if (error) {
      return {
        isLoading: false,
        session: null,
        error,
        supabaseClient,
      }
    }

    return {
      isLoading: false,
      session: authSession && user ? { authSession, appUser: user } : null,
      error: null,
      supabaseClient,
    }
  }, [isLoading, error, authSession, user, supabaseClient])

  /* if (userError) {
    console.error(userError)
    return (
      <ErrorPage
        statusCode={userError?.code ?? 500}
        title="Unable to retrieve current user."
      />
    )
  } */

  return (
    <AuthContext.Provider value={value}>
      <AbilityContext.Provider value={ability}>
        {children}
      </AbilityContext.Provider>
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuthContext must be used within a AuthProvider.`)
  }

  return context
}

export function useSupabaseClient<
  Database = any,
  SchemaName extends string & keyof Database = "public" extends keyof Database
    ? "public"
    : string & keyof Database,
>() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error(
      `useSupabaseClient must be used within a SessionContextProvider.`,
    )
  }

  return context.supabaseClient as SupabaseClient<Database, SchemaName>
}

export const useAppSession = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAppSession must be used within a AuthProvider.")
  }

  return context.session?.authSession
}

export const useAuthSession = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthSession must be used within a AuthProvider.")
  }

  return context.session?.authSession
}

export const useAppUser = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAppUser must be used within a AuthProvider.")
  }

  return context.session?.appUser ?? null
}

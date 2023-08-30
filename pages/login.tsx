import { zodResolver } from "@hookform/resolvers/zod"
import {
  createPagesBrowserClient,
  createPagesServerClient,
} from "@supabase/auth-helpers-nextjs"
import { useUser } from "@supabase/auth-helpers-react"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "components/ui"
import { Form, FormGroup, Input } from "components/ui/forms"
import { getSession } from "lib/api/utils"
import { formErrorMap } from "lib/formErrorMap"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const LoginPage = () => {
  const user = useUser()
  const router = useRouter()

  type LoginFields = z.input<typeof loginSchema>

  const { handleSubmit, register } = useForm<LoginFields>({
    criteriaMode: "all",
    mode: "onTouched",
    reValidateMode: "onChange",
    resolver: async (values, context, options) => {
      const result = await zodResolver(loginSchema, { errorMap: formErrorMap })(
        values,
        context,
        options,
      )
      return result
    },
  })

  const supabaseClient = createPagesBrowserClient()

  const [error, setError] = useState<Error | undefined>()

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleSignIn: SubmitHandler<LoginFields> = async (data) => {
    setError(undefined)
    const response = await supabaseClient.auth.signInWithPassword(data)
    if (response.error) {
      setError(response.error)
      return
    }

    router.push("/")
  }

  return (
    <div className="login-page">
      <Form
        onSubmit={handleSubmit(handleSignIn, (errors) => {
          console.error(errors)
        })}
        noValidate
      >
        <FormGroup>
          <label htmlFor="email">Email:</label>
          <Input id="email" type="email" {...register("email")} size={40} />
        </FormGroup>
        <FormGroup>
          <label htmlFor="password">Password:</label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            size={40}
          />
        </FormGroup>
        {error && <div className="error-field">Error: {error.message}</div>}
        <Button type="submit">Sign in</Button>
        <div className="links">
          {/* 
            <Link href="" className="disabled">
              Forgot your password? (NOT IMPLEMENTED)
            </Link>
            <Link href="/signup">Don&apos;t have an account? Sign up</Link> 
          */}
        </div>
      </Form>
      <style jsx>{`
        .login-page :global(button[type="submit"]) {
          margin-left: 0.75em;
        }

        .links {
          display: flex;
          flex-direction: column;
          margin: 1rem;
          row-gap: 0.4rem;
        }

        .links > :global(a) {
          font-size: var(--font-size-sm);
        }
      `}</style>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Check if we have a session
  const session = await getSession(context)

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: { title: "Login" },
  }
}

export default LoginPage
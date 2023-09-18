import { zodResolver } from "@hookform/resolvers/zod"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import { useUser } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "components/ui"
import { Form, FormGroup, Input } from "components/ui/forms"
import { withPageAuth } from "lib/auth"
import { formErrorMap } from "lib/formErrorMap"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const LoginPage = () => {
  const user = useUser()
  const router = useRouter()

  type LoginFields = z.input<typeof loginSchema>

  const formMethods = useForm<LoginFields>({
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

  const { handleSubmit, register } = formMethods

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
  }

  return (
    <div className="login-page">
      <Form
        onSubmit={handleSubmit(handleSignIn, (errors) => {
          console.error(errors)
        })}
        noValidate
      >
        <FormProvider {...formMethods}>
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
        </FormProvider>
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

export const getServerSideProps = withPageAuth({
  getServerSideProps: async (_, session) => {
    if (session) {
      console.log("Already logged in. Redirecting to home page.")
      console.log({ session })
      return { redirect: { destination: "/", permanent: false } }
    }

    return {
      props: {
        title: "Login",
      },
    }
  },
  requireAuth: false,
})

export default LoginPage

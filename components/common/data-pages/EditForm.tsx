import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError, AxiosResponse, isAxiosError } from "axios"
import Link from "next/link"
import { useRouter } from "next/router"
import { enqueueSnackbar } from "notistack"
import React, { useEffect, useState } from "react"
import {
  DeepPartial,
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form"

import { Button } from "components/ui"
import { Form } from "components/ui/forms"
import { formErrorMap } from "lib/formErrorMap"
import { DataEntryComponent, JsonError } from "types/common"

type EditFormProps<
  TSchema extends Zod.ZodTypeAny,
  TFieldValues extends FieldValues,
> = {
  values: TFieldValues
  schema?: TSchema
  apiEndpointPath: string
  urlPath: string
  entryComponent: DataEntryComponent<TFieldValues>
  entryComponentProps?: Record<string, unknown>
  onSuccessfulSubmit?: (value: TFieldValues, res: AxiosResponse) => void
  onFailedSubmit?: (reason: any) => void
}

const EditForm = <
  TSchema extends Zod.ZodTypeAny,
  TFieldValues extends FieldValues,
>(
  props: EditFormProps<TSchema, TFieldValues>,
) => {
  const {
    values,
    apiEndpointPath,
    urlPath,
    entryComponent: EntryComponent,
    entryComponentProps,
    schema,
    onSuccessfulSubmit,
    onFailedSubmit,
  } = props

  const router = useRouter()

  const [saveSuccessful, setSaveSuccessful] = useState<boolean | undefined>()
  const formMethods = useForm<TFieldValues>({
    defaultValues: values as DeepPartial<TFieldValues>,
    criteriaMode: "all",
    mode: "onTouched",
    reValidateMode: "onChange",
    resolver: schema
      ? async (values, context, options) => {
          console.log("formData", values)
          const result = await zodResolver(schema, { errorMap: formErrorMap })(
            values,
            context,
            options,
          )
          console.log("validation", result)
          return result
        }
      : undefined,
  })

  const { handleSubmit, reset } = formMethods

  useEffect(() => {
    reset(values)
  }, [reset, values])

  const onSubmit: SubmitHandler<TFieldValues> = async (data) => {
    await axios
      .put(`${apiEndpointPath}`, data)
      .then((res) => {
        onSuccessfulSubmit?.(data, res)

        enqueueSnackbar("Save successful.", { variant: "success" })
        setSaveSuccessful(true)
        router.push(`${urlPath}`)
      })
      .catch((error: Error | AxiosError<JsonError>) => {
        onFailedSubmit?.(error)

        if (isAxiosError<JsonError>(error)) {
          if (error.code === "409") {
          }
          enqueueSnackbar(error.response?.data.message ?? error.message, {
            variant: "error",
          })
        } else {
          enqueueSnackbar(error.message, { variant: "error" })
        }
        console.error({ error })
        setSaveSuccessful(false)
      })
  }

  return (
    <FormProvider {...formMethods}>
      <Form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.error(errors)
          setSaveSuccessful(false)
        })}
        autoComplete="off"
        noValidate
      >
        <EntryComponent
          values={values}
          formMethods={formMethods}
          action="update"
          {...entryComponentProps}
        />
        <div>
          <div className="button-row">
            <Button theme="primary" type="submit">
              Save
            </Button>
            <Link href={`${urlPath}`}>
              <Button>Cancel</Button>
            </Link>
          </div>
          {saveSuccessful !== undefined && (
            <p style={{ color: saveSuccessful ? "green" : "red" }}>
              {saveSuccessful ? "Saved" : "Error"}
            </p>
          )}
        </div>
        <style jsx>{`
          form {
            align-self: center;
            margin-bottom: 2rem;
          }

          .button-row {
            display: flex;
            column-gap: 0.8rem;
            margin-top: 1.2rem;
          }
        `}</style>
      </Form>
    </FormProvider>
  )
}
export default EditForm

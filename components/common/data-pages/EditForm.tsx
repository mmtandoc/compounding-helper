import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import {
  DeepPartial,
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form"

import Button from "components/common/Button"
import { DataEntryComponent } from "types/common"

import Form from "../forms/Form"

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
          const result = await zodResolver(schema)(values, context, options)
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
      .then(() => {
        setSaveSuccessful(true)
        router.push(`${urlPath}`)
      })
      .catch((reason) => {
        //TODO: Handle error
        console.log(JSON.stringify(reason))
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

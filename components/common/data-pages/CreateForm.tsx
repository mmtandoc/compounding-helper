import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import Link from "next/link"
import { useEffect, useState } from "react"
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
import { DataEntryComponent } from "types/common"

type CreateFormProps<
  TSchema extends Zod.ZodTypeAny,
  TFieldValues extends FieldValues,
> = {
  schema?: TSchema
  defaultValues: TFieldValues
  apiEndpointPath: string | ((values: TFieldValues) => string)
  entryComponent: DataEntryComponent<TFieldValues>
  dataName: string
}

const CreateForm = <
  TSchema extends Zod.ZodTypeAny,
  TFieldValues extends FieldValues,
>(
  props: CreateFormProps<TSchema, TFieldValues>,
) => {
  const {
    defaultValues,
    apiEndpointPath,
    entryComponent: EntryComponent,
    dataName,
    schema,
  } = props

  const [saveSuccessful, setSaveSuccessful] = useState<boolean | undefined>()
  const [resourceUrl, setResourceUrl] = useState<string | undefined>()

  const formMethods = useForm<TFieldValues>({
    defaultValues: defaultValues as DeepPartial<TFieldValues>,
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
    reset(defaultValues)
  }, [reset, defaultValues])

  const onSubmit: SubmitHandler<TFieldValues> = async (data) => {
    await axios
      .post(
        typeof apiEndpointPath === "function"
          ? apiEndpointPath(data)
          : apiEndpointPath,
        data,
      )
      .then((res) => {
        setSaveSuccessful(true)
        setResourceUrl(res.headers["location"])
      })
      .catch((reason) => {
        //TODO: Handle error
        console.log(JSON.stringify(reason))
        setSaveSuccessful(false)
      })
  }

  return (
    <>
      {!saveSuccessful || !resourceUrl ? (
        <FormProvider {...formMethods}>
          <Form
            onSubmit={handleSubmit(onSubmit, (errors) => {
              console.error(errors)
              setSaveSuccessful(false)
            })}
            autoComplete="off"
            noValidate
          >
            <EntryComponent formMethods={formMethods} />
            <div className="action-row">
              <Button theme="primary" type="submit">
                Submit
              </Button>
              <Button onClick={() => reset()}>Clear</Button>
            </div>
          </Form>
        </FormProvider>
      ) : (
        <div className="savedPrompt">
          <p className="content">The {dataName} has been saved.</p>
          <div className="saved-action-row">
            <Link
              href={""}
              onClick={() => {
                setSaveSuccessful(undefined)
                setResourceUrl(undefined)
                reset()
              }}
            >
              Add another {dataName}
            </Link>
            <Link href={resourceUrl}>View created {dataName}</Link>
          </div>
        </div>
      )}
      <style jsx>{`
        form {
          align-self: center;
        }

        .action-row {
          display: flex;
          column-gap: 1rem;
          margin-left: 0.5rem;
          margin-top: 1rem;
        }

        .savedPrompt {
          > .content {
            font-size: var(--font-size-lg);
            font-weight: 600;
          }

          .saved-action-row {
            display: flex;
            column-gap: 3rem;
          }
        }
      `}</style>
    </>
  )
}

export default CreateForm

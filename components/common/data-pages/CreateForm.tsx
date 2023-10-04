import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError, isAxiosError } from "axios"
import Link from "next/link"
import { enqueueSnackbar } from "notistack"
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
import { DataEntryComponent, JsonError } from "types/common"

type CreateFormProps<
  TSchema extends Zod.ZodTypeAny,
  TFieldValues extends FieldValues,
> = {
  schema?: TSchema
  defaultValues: TFieldValues
  apiEndpointPath: string | ((values: TFieldValues) => string)
  entryComponent: DataEntryComponent<TFieldValues>
  dataName: string
  renderCustomAfterSaveActions?: (props: {
    values: TFieldValues
    dataName: string
    resourceUrl: string
  }) => JSX.Element
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
    renderCustomAfterSaveActions,
  } = props

  const [saveSuccessful, setSaveSuccessful] = useState<boolean | undefined>()
  const [savedPayload, setSavedPayload] = useState<TFieldValues | undefined>()
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
        setSavedPayload(data)
        setResourceUrl(res.headers["location"])
      })
      .catch((error: Error | AxiosError<JsonError>) => {
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
            <EntryComponent formMethods={formMethods} action="create" />
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
                setSavedPayload(undefined)
                setResourceUrl(undefined)
                reset()
              }}
            >
              Add another {dataName}
            </Link>
            <Link href={resourceUrl}>View created {dataName}</Link>
            {renderCustomAfterSaveActions?.({
              values: savedPayload as TFieldValues,
              dataName,
              resourceUrl,
            })}
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

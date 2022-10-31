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

import { DataEntryComponent } from "types/common"

type CreateFormProps<
  TSchema extends Zod.ZodTypeAny,
  TFieldValues extends FieldValues,
> = {
  schema?: TSchema
  defaultValues: TFieldValues
  apiEndpointPath: string
  urlPath: string
  entryComponent: DataEntryComponent<TFieldValues>
  dataName: string
}

const CreateForm = <
  TDataModel extends { id: number },
  TSchema extends Zod.ZodTypeAny,
  TFieldValues extends FieldValues,
>(
  props: CreateFormProps<TSchema, TFieldValues>,
) => {
  const {
    defaultValues,
    apiEndpointPath,
    urlPath,
    entryComponent: EntryComponent,
    dataName,
    schema,
  } = props

  const [saveSuccessful, setSaveSuccessful] = useState<boolean | undefined>()
  const [savedData, setSavedData] = useState<TDataModel | undefined>()
  const formMethods = useForm<TFieldValues>({
    defaultValues: defaultValues as DeepPartial<TFieldValues>,
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
    reset(defaultValues)
  }, [reset, defaultValues])

  const onSubmit: SubmitHandler<TFieldValues> = async (data) => {
    await axios
      .post<TDataModel>(apiEndpointPath, data)
      .then((res) => {
        setSaveSuccessful(true)
        setSavedData(res.data)
      })
      .catch((reason) => {
        //TODO: Handle error
        console.log(JSON.stringify(reason))
        setSaveSuccessful(false)
      })
  }

  return (
    <>
      {!saveSuccessful || !savedData ? (
        <FormProvider {...formMethods}>
          <form
            onSubmit={handleSubmit(onSubmit, (errors) => {
              console.error(errors)
              setSaveSuccessful(false)
            })}
            autoComplete="off"
            noValidate
          >
            <EntryComponent formMethods={formMethods} />
            <div className="action-row">
              <button type="submit">Submit</button>
              <button type="button" onClick={() => reset()}>
                Clear
              </button>
            </div>
          </form>
        </FormProvider>
      ) : (
        <div className="savedPrompt">
          <p style={{ fontSize: "2.4rem", fontWeight: 600 }}>
            The {dataName} has been saved.
          </p>
          <div style={{ display: "flex", columnGap: "3rem" }}>
            <Link href={`${urlPath}/new`} passHref>
              <a
                onClick={() => {
                  setSaveSuccessful(undefined)
                  setSavedData(undefined)
                  reset()
                }}
              >
                Add another {dataName}
              </a>
            </Link>
            <Link href={`${urlPath}/${savedData.id}`} passHref>
              <a>View created {dataName}</a>
            </Link>
          </div>
        </div>
      )}
      <style jsx>{`
        form {
          margin-bottom: 5rem;
          align-self: center;
        }

        .action-row {
          display: flex;
          column-gap: 1rem;
          margin-left: 0.5rem;
          margin-top: 1rem;
        }
      `}</style>
    </>
  )
}

export default CreateForm

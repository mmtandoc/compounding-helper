import React, { useEffect, useState } from "react"
import {
  DeepPartial,
  FieldValues,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form"
import axios from "axios"
import { useRouter } from "next/router"
import Link from "next/link"

type entryComponentProps<TFieldValues extends FieldValues> = {
  values: TFieldValues
  formMethods: UseFormReturn<TFieldValues>
} & Record<string, unknown>

type EditFormProps<
  TFieldValues extends FieldValues,
  TEntryProps extends Record<string, unknown>,
> = {
  id: number
  values: TFieldValues
  apiEndpointPath: string
  urlPath: string
  entryComponent: (props: entryComponentProps<TFieldValues>) => JSX.Element
  entryComponentProps?: TEntryProps
}

const EditForm = <
  TFieldValues extends FieldValues,
  TEntryProps extends Record<string, unknown>,
>(
  props: EditFormProps<TFieldValues, TEntryProps>,
) => {
  const {
    id,
    values,
    apiEndpointPath,
    urlPath,
    entryComponent: EntryComponent,
    entryComponentProps,
  } = props

  const router = useRouter()

  const [saveSuccessful, setSaveSuccessful] = useState<boolean | undefined>()
  const formMethods = useForm<TFieldValues>({
    defaultValues: values as DeepPartial<TFieldValues>,
  })

  const { handleSubmit } = formMethods

  const onSubmit: SubmitHandler<TFieldValues> = async (data) => {
    await axios
      .put(`${apiEndpointPath}/${id}`, data)
      .then(() => {
        setSaveSuccessful(true)
        router.push(`${urlPath}/${id}`)
      })
      .catch((reason) => {
        //TODO: Handle error
        console.log(JSON.stringify(reason))
        setSaveSuccessful(false)
      })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log(errors)
        setSaveSuccessful(false)
      })}
      autoComplete="off"
    >
      <EntryComponent
        values={values}
        formMethods={formMethods}
        {...entryComponentProps}
      />
      <div>
        <div className="button-row">
          <button type="submit">Save</button>
          <Link href={`${urlPath}/${id}`} passHref>
            <button type="button">Cancel</button>
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
    </form>
  )
}
export default EditForm

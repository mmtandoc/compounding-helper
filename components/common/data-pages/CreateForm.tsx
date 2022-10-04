import axios from "axios"
import _ from "lodash"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  DeepPartial,
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form"
import { DataEntryComponent } from "types/common"

type CreateFormProps<TFieldValues extends FieldValues> = {
  defaultValues: TFieldValues
  apiEndpointPath: string
  urlPath: string
  entryComponent: DataEntryComponent<TFieldValues>
  dataName: string
}

const CreateForm = <
  TDataModel extends { id: number },
  TFieldValues extends FieldValues,
>(
  props: CreateFormProps<TFieldValues>,
) => {
  const {
    defaultValues,
    apiEndpointPath,
    urlPath,
    entryComponent: EntryComponent,
    dataName,
  } = props

  const [saveSuccessful, setSaveSuccessful] = useState<boolean | undefined>()
  const [savedData, setSavedData] = useState<TDataModel | undefined>()
  const formMethods = useForm<TFieldValues>({
    defaultValues: defaultValues as DeepPartial<TFieldValues>,
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
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <EntryComponent formMethods={formMethods} />
          <div className="action-row">
            <button type="submit">Submit</button>
            <button type="button" onClick={() => reset()}>
              Clear
            </button>
          </div>
        </form>
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

import axios from "axios"
import Layout from "components/Layout"
import SdsEntry from "components/sds/SdsEntry"
import SdsMapper from "lib/mappers/SdsMapper"
import { NullPartialSdsFields } from "lib/fields"
import { GetServerSideProps, NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { getSdsById } from "pages/api/sds/[id]"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

type EditSdsPageProps = {
  values: NullPartialSdsFields
}

const EditSdsPage: NextPage<EditSdsPageProps> = (props: EditSdsPageProps) => {
  const { values } = props

  const router = useRouter()

  const [saveSuccessful, setSaveSuccessful] = useState<boolean | undefined>()

  const formMethods = useForm<NullPartialSdsFields>({ defaultValues: values })
  const { handleSubmit } = formMethods

  const sdsId = parseInt(router.query.id as string)

  const onSubmit: SubmitHandler<NullPartialSdsFields> = async (data) => {
    await axios
      .put(`/api/sds/${sdsId}`, data)
      .then(() => {
        setSaveSuccessful(true)
        router.push(`/sds/${sdsId}`)
      })
      .catch((reason) => {
        //TODO: Handle error
        console.log(JSON.stringify(reason))
        setSaveSuccessful(false)
      })
  }

  return (
    <Layout>
      <div className="page">
        <h1 style={{ marginTop: "0px" }}>Edit SDS</h1>
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log(errors)
            setSaveSuccessful(false)
          })}
          autoComplete="off"
        >
          <SdsEntry formMethods={formMethods} />
          <div>
            <div className="row">
              <button type="submit">Save</button>
              <Link href={`/sds/${sdsId}`} passHref>
                <button type="button">Cancel</button>
              </Link>
            </div>
            {saveSuccessful !== undefined && (
              <p style={{ color: saveSuccessful ? "green" : "red" }}>
                {saveSuccessful ? "Saved" : "Error"}
              </p>
            )}
          </div>
        </form>
      </div>
      <style jsx>{`
        form {
          align-self: center;
        }

        .page {
          margin-bottom: 5rem;
        }
      `}</style>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<EditSdsPageProps> = async (
  context,
) => {
  const sdsId = parseInt(context.query.id as string)

  if (isNaN(sdsId)) {
    return { notFound: true }
  }

  const data = await getSdsById(sdsId)

  if (data === null) {
    return { notFound: true }
  }

  return {
    props: {
      values: SdsMapper.toFieldValues(data),
    },
  }
}

export default EditSdsPage

import EditForm from "components/common/data-pages/EditForm"
import Layout from "components/Layout"
import SdsEntry from "components/sds/SdsEntry"
import { NullPartialSdsFields, sdsSchema } from "lib/fields"
import SdsMapper from "lib/mappers/SdsMapper"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { getSdsById } from "pages/api/sds/[id]"

type EditSdsPageProps = {
  values: NullPartialSdsFields
}

const EditSdsPage: NextPage<EditSdsPageProps> = (props: EditSdsPageProps) => {
  const { values } = props

  const router = useRouter()
  const id = parseInt(router.query.id as string)

  return (
    <Layout>
      <div className="page">
        <h1 style={{ marginTop: "0px" }}>Edit SDS</h1>
        <EditForm
          id={id}
          schema={sdsSchema}
          values={values as NullPartialSdsFields}
          apiEndpointPath="/api/sds"
          urlPath="/sds"
          entryComponent={SdsEntry}
        />
      </div>
      <style jsx>{`
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

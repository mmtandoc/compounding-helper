import EditForm from "components/common/data-pages/EditForm"
import CompoundEntry from "components/compound/CompoundEntry"
import Layout from "components/Layout"
import { compoundSchema, NullPartialCompoundFields } from "lib/fields"
import CompoundMapper from "lib/mappers/CompoundMapper"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { getCompoundById } from "pages/api/compounds/[id]"

type Props = {
  values: NullPartialCompoundFields
}

const EditCompound: NextPage<Props> = (props: Props) => {
  const { values } = props

  const router = useRouter()
  const riskAssessmentId = parseInt(router.query.id as string)

  return (
    <Layout>
      <div className="page">
        <h1>Edit Compound - {values.name}</h1>
        <EditForm
          id={riskAssessmentId}
          values={values as NullPartialCompoundFields}
          schema={compoundSchema}
          apiEndpointPath="/api/compounds"
          urlPath="/compounds"
          entryComponent={CompoundEntry}
          entryComponentProps={{ showPastSdsRevisions: true, display: "all" }}
        />
      </div>
      <style jsx>{`
        h1 {
          margin-top: 0;
        }
      `}</style>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = parseInt(context.query.id as string)

  if (isNaN(id)) {
    return { notFound: true }
  }

  const data = await getCompoundById(id)

  if (data === null) {
    return { notFound: true }
  }

  return {
    props: {
      values: CompoundMapper.toFieldValues(data),
    },
  }
}

export default EditCompound

import EditForm from "components/common/data-pages/EditForm"
import CompoundEntry from "components/compound/CompoundEntry"
import { compoundSchema, NullPartialCompoundFields } from "lib/fields"
import CompoundMapper from "lib/mappers/CompoundMapper"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { getCompoundById } from "pages/api/compounds/[id]"
import { NextPageWithLayout } from "types/common"

type Props = {
  values: NullPartialCompoundFields
}

const EditCompound: NextPageWithLayout<Props> = (props: Props) => {
  const { values } = props

  const router = useRouter()
  const riskAssessmentId = parseInt(router.query.id as string)

  return (
    <EditForm
      id={riskAssessmentId}
      values={values as NullPartialCompoundFields}
      schema={compoundSchema}
      apiEndpointPath="/api/compounds"
      urlPath="/compounds"
      entryComponent={CompoundEntry}
      entryComponentProps={{ showPastSdsRevisions: true, display: "all" }}
    />
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
  const values = CompoundMapper.toFieldValues(data)

  return {
    props: {
      title: `Edit Compound - ${values.name}`,
      values,
    },
  }
}


export default EditCompound

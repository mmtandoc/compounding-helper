import { GetServerSideProps } from "next"
import { useRouter } from "next/router"

import EditForm from "components/common/data-pages/EditForm"
import CompoundEntry from "components/compound/CompoundEntry"
import { getSession } from "lib/api/utils"
import { NullableCompoundFields, compoundSchema } from "lib/fields"
import CompoundMapper from "lib/mappers/CompoundMapper"
import { getCompoundById } from "pages/api/compounds/[id]"
import { NextPageWithLayout } from "types/common"

type Props = {
  values: NullableCompoundFields
}

const EditCompound: NextPageWithLayout<Props> = (props: Props) => {
  const { values } = props

  const router = useRouter()
  const id = parseInt(router.query.id as string)

  return (
    <EditForm
      values={values as NullableCompoundFields}
      schema={compoundSchema}
      apiEndpointPath={`/api/compounds/${id}`}
      urlPath={`/compounds/${id}`}
      entryComponent={CompoundEntry}
      entryComponentProps={{ showPastSdsRevisions: true, display: "all" }}
    />
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }

  const id = parseInt(context.query.id as string)

  if (isNaN(id)) {
    return { notFound: true }
  }

  const data = await getCompoundById(session.user, id)

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

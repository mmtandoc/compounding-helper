import { useRouter } from "next/router"

import EditForm from "components/common/data-pages/EditForm"
import CompoundEntry from "components/compound/CompoundEntry"
import { withPageAuth } from "lib/auth"
import { NullableCompoundFields, compoundSchema } from "lib/fields"
import CompoundMapper from "lib/mappers/CompoundMapper"
import { isCentralPharmacy } from "lib/utils"
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

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (context, session) => {
    const id = parseInt(context.query.id as string)

    if (isNaN(id)) {
      return { notFound: true }
    }

    const data = await getCompoundById(session, id)

    if (data === null) {
      return { notFound: true }
    }

    //Check if record is owned by central & current user is not a central user
    if (
      isCentralPharmacy(data.pharmacyId) &&
      session.appUser.pharmacyId !== data.pharmacyId
    ) {
      //TODO: Return 403 status code instead?
      return { notFound: true }
    }

    const values = CompoundMapper.toFieldValues(data)

    return {
      props: {
        title: `Edit Compound - ${values.name}`,
        values,
      },
    }
  },
  requireAuth: true,
})

export default EditCompound

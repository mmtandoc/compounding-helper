import { subject } from "@casl/ability"

import Details from "components/common/data-pages/Details"
import { UserDetails } from "components/user/UserDetails"
import { getUser } from "lib/api/users"
import { withPageAuth } from "lib/auth"
import { useAbility } from "lib/contexts/AbilityContext"
import { NextPageWithLayout } from "types/common"
import { UserWithPharmacy } from "types/models"

type Props = { data: UserWithPharmacy }

const ViewUser: NextPageWithLayout<Props> = ({ data }) => {
  const ability = useAbility()

  const canEdit = ability.can("update", subject("User", data))
  const canDelete = ability.can("delete", subject("User", data))

  return (
    <Details
      data={data}
      dataLabel="user"
      apiEndpointPath={`/api/pharmacies/${data.pharmacyId}/users/${data.id}`}
      urlPath={`/pharmacy/users/${data.id}`}
      detailsComponent={UserDetails}
      actions={{
        edit: { visible: canEdit },
        delete: { visible: canDelete },
      }}
    />
  )
}

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (context, session) => {
    const id = context.query.id as string

    const data = await getUser(session, { id })

    if (data === null) {
      return { notFound: true }
    }

    return {
      props: {
        title: `View User - ${data.email}`,
        data,
      },
    }
  },
  requireAuth: true,
})

export default ViewUser

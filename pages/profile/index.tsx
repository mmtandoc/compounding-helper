import { subject } from "@casl/ability"

import Details from "components/common/data-pages/Details"
import { ProfileDetails } from "components/profile/ProfileDetails"
import { withPageAuth } from "lib/auth"
import { useAbility } from "lib/contexts/AbilityContext"
import { NextPageWithLayout } from "types/common"
import { UserWithPharmacy } from "types/models"

type Props = { data: UserWithPharmacy }

const Profile: NextPageWithLayout<Props> = ({ data }) => {
  const ability = useAbility()

  const canEdit = ability.can("update", subject("User", data))

  // TODO: Implement deleting users
  //const canDelete = ability.can("delete", subject("User", data))

  return (
    <Details
      data={data}
      dataLabel="user"
      apiEndpointPath={`/api/profile`}
      urlPath={`/profile`}
      detailsComponent={ProfileDetails}
      actions={{
        edit: { visible: canEdit },
        delete: false,
      }}
    />
  )
}

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (_, session) => ({
    props: {
      title: "Profile",
      data: session.appUser,
    },
  }),
  requireAuth: true,
})

export default Profile

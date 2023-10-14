import EditForm from "components/common/data-pages/EditForm"
import ProfileEntry from "components/profile/ProfileEntry"
import { withPageAuth } from "lib/auth"
import { NullableProfileFields, ProfileFields, profileSchema } from "lib/fields"
import { NextPageWithLayout } from "types/common"

type Props = {
  values: ProfileFields
}

const EditProfile: NextPageWithLayout<Props> = (props) => {
  const { values } = props

  return (
    <EditForm
      schema={profileSchema}
      values={values as NullableProfileFields}
      apiEndpointPath={`/api/profile`}
      urlPath={`/profile`}
      entryComponent={ProfileEntry}
    />
  )
}

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (_, session) => ({
    props: {
      title: "Edit Profile",
      values: session.appUser,
    },
  }),
  requireAuth: true,
})

export default EditProfile

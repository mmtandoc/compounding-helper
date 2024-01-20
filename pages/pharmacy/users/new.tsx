import { useMemo } from "react"

import CreateForm from "components/common/data-pages/CreateForm"
import UserEntry from "components/user/UserEntry"
import { withPageAuth } from "lib/auth"
import { NullableUserFields, userSchema } from "lib/fields"
import { useCurrentUser } from "lib/hooks/useCurrentUser"
import { NextPageWithLayout } from "types/common"

const defaultValues: NullableUserFields = {
  email: null,
  password: null,
  role: null,
}

const NewUser: NextPageWithLayout = () => {
  const { user, error: userError } = useCurrentUser()

  if (!user || userError) {
    console.error(userError)
    return null
  }

  return (
    <CreateForm
      schema={userSchema}
      dataName="user"
      defaultValues={defaultValues}
      apiEndpointPath={`/api/pharmacies/${user.pharmacyId}/users`}
      entryComponent={UserEntry}
    />
  )
}

export const getServerSideProps = withPageAuth({
  getServerSideProps: async (_, session) => {
    return {
      props: {
        title: `New User for ${session.appUser.pharmacy.name}`,
      },
    }
  },
  requireAuth: true,
})

export default NewUser

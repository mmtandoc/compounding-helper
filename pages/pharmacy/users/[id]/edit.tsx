import { subject } from "@casl/ability"

import EditForm from "components/common/data-pages/EditForm"
import UserEntry from "components/user/UserEntry"
import { getUser } from "lib/api/users"
import { withPageAuth } from "lib/auth"
import { defineAbilityForUser } from "lib/auth/ability/appAbilities"
import { NullableUserFields, UserFields, userSchema } from "lib/fields"
import UserMapper from "lib/mappers/UserMapper"
import { NextPageWithLayout } from "types/common"

type Props = {
  values: UserFields
}

const EditUser: NextPageWithLayout<Props> = (props) => {
  const { values } = props

  return (
    <EditForm
      schema={userSchema}
      values={values as NullableUserFields}
      apiEndpointPath={`/api/pharmacies/${values.pharmacyId}/users/${values.id}`}
      urlPath={`/pharmacy/users/${values.id}`}
      entryComponent={UserEntry}
    />
  )
}

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (context, session) => {
    const id = context.query.id as string

    const data = await getUser(session, { id })

    // Check if current user has permission to edit user
    if (
      data === null ||
      defineAbilityForUser(session.appUser).cannot(
        "update",
        subject("User", data),
      )
    ) {
      //TODO: Return 403 status code instead?
      //TODO: Return cause message from CASL
      return { notFound: true }
    }

    const values = UserMapper.toFieldValues(data)

    return {
      props: {
        title: `Edit User - ${data.email}`,
        values,
      },
    }
  },
  requireAuth: true,
})

export default EditUser

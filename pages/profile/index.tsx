import { Role } from "@prisma/client"
import type { NextPage } from "next"

import { FormGroup } from "components/ui/forms"
import { withPageAuth } from "lib/auth"
import { UserWithPharmacy } from "types/models"

type Props = { user: UserWithPharmacy }

const roleMapper = new Map<Role, string>([
  [Role.admin, "Admin"],
  [Role.superadmin, "SuperAdmin"],
  [Role.user, "User"],
])

const Profile: NextPage<Props> = ({ user }) => {
  return (
    <div className="profile-page">
      <FormGroup row>
        <span className="label">Email:</span>
        {user.email}
      </FormGroup>
      <FormGroup row>
        <span className="label">Pharmacy:</span>
        {user.pharmacy.name}
      </FormGroup>
      <FormGroup row>
        <span className="label">Role:</span>
        {roleMapper.get(user.role)}
      </FormGroup>
    </div>
  )
}

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (_, session) => {
    return {
      props: {
        title: "Profile",
        user: session.appUser,
      },
    }
  },
  requireAuth: true,
})

export default Profile

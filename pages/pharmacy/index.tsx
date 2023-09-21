import { Role } from "@prisma/client"
import type { NextPage } from "next"

import { FormGroup } from "components/ui/forms"
import { withPageAuth } from "lib/auth"
import { getPharmacyById } from "pages/api/pharmacies/[id]"
import { PharmacyWithUsers } from "types/models"

type Props = { pharmacy: PharmacyWithUsers }

const roleMapper = new Map<Role, string>([
  [Role.admin, "Admin"],
  [Role.superadmin, "SuperAdmin"],
  [Role.user, "User"],
])

const Pharmacy: NextPage<Props> = ({ pharmacy }) => {
  return (
    <div className="profile-page">
      <FormGroup row>
        <span className="label">Pharmacy name:</span>
        {pharmacy.name}
      </FormGroup>
      <FormGroup>
        <span className="label">Users:</span>
        <ul>
          {pharmacy.users.map((user) => (
            <li key={user.id}>
              {user.email} (Role: {roleMapper.get(user.role)})
            </li>
          ))}
        </ul>
      </FormGroup>
      <style jsx global>{`
        .profile-page ul {
          margin-block: 0;
        }
      `}</style>
    </div>
  )
}

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (_, session) => {
    const pharmacy = await getPharmacyById(session, session.appUser.pharmacyId)

    if (!pharmacy) {
      throw new Error("Can't find current pharmacy.")
    }

    return {
      props: {
        title: `Pharmacy: ${pharmacy.name}`,
        pharmacy,
      },
    }
  },
  requireAuth: true,
})

export default Pharmacy

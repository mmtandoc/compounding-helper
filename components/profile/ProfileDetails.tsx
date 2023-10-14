import { UserDetails } from "components/user/UserDetails"
import { UserWithPharmacy } from "types/models"

type Props = {
  data: UserWithPharmacy
}

export const ProfileDetails = (props: Props) => <UserDetails {...props} />

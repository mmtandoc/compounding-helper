import { Role } from "@prisma/client"
import Link from "next/link"

import { FormGroup } from "components/ui/forms"
import { UserWithPharmacy } from "types/models"

import { getRoleName } from "./utils"

type UserDetailsProps = {
  data: UserWithPharmacy
}
export const UserDetails = (props: UserDetailsProps) => (
  <>
    <FormGroup row>
      <span className="label">Email:</span>
      {props.data.email}
    </FormGroup>
    <FormGroup row>
      <span className="label">Pharmacy:</span>
      <Link href="/pharmacy">{props.data.pharmacy.name}</Link>
    </FormGroup>
    <FormGroup row>
      <span className="label">Role:</span>
      {getRoleName(props.data.role)}
    </FormGroup>
  </>
)

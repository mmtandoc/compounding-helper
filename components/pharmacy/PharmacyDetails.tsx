import { Fieldset, FormGroup } from "components/ui/forms"
import { PharmacyWithUsers } from "types/models"

import PharmacyUsersTable from "./PharmacyUsersTable"

type Props = {
  data: PharmacyWithUsers
}

const PharmacyDetails = (props: Props) => {
  const { data } = props

  return (
    <div className="pharmacy-details">
      <FormGroup row>
        <span className="label">Pharmacy name:</span>
        {data.name}
      </FormGroup>
      <Fieldset legend="Users:">
        {/* <TableActionBar>
          <Can do="create" on="User">
            <Link href="/pharmacy/users/new">
              <Button>Add New User</Button>
            </Link>
          </Can>
        </TableActionBar> */}
        <PharmacyUsersTable data={data.users} />
      </Fieldset>
      <style jsx global>{`
        .pharmacy-details {
          ul {
            margin-block: 0;
          }
          .pharmacy-users-table {
            width: 100%;
          }

          > .form-group {
            padding-inline: 0.75em;
          }

          > * {
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default PharmacyDetails

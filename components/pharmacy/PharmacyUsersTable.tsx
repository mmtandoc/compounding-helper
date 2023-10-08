import { Role, User } from "@prisma/client"
import { createColumnHelper } from "@tanstack/react-table"

import { Table } from "components/ui"

type Props = {
  data: User[]
}

const columnHelper = createColumnHelper<User>()

const roleMapper = new Map<Role, string>([
  [Role.admin, "Admin"],
  [Role.superadmin, "SuperAdmin"],
  [Role.user, "User"],
  [Role.guest, "Guest"],
])

const getRoleName = (role: Role) => roleMapper.get(role) ?? role

const columns = [
  columnHelper.accessor("email", {
    header: "Email",
    filterFn: "includesString",
  }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: (info) => getRoleName(info.getValue()),
  }),
  /*
  TODO: Implement user details and edit pages
  columnHelper.display({
    id: "actions",
    cell: function ActionsCell(info) {
      const ability = useAbility()
      const data = info.row.original
      const canEdit = ability.can("update", subject("User", data))
      return (
        <DataRowActions
          row={info.row}
          viewButton={{ getUrl: (data) => `/pharmacy/users/${data.id}` }}
          editButton={
            canEdit
              ? { getUrl: (data) => `/pharmacy/users/${data.id}/edit` }
              : undefined
          }
        />
      )
    },
    meta: {
      headerStyle: { width: 0 },
    },
  }),
  */
]

const PharmacyUsersTable = (props: Props) => {
  const { data } = props

  return (
    <Table className="pharmacy-users-table" data={data} columns={columns} />
  )
}

export default PharmacyUsersTable

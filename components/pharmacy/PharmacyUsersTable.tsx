import { subject } from "@casl/ability"
import { Role, User } from "@prisma/client"
import { createColumnHelper } from "@tanstack/react-table"

import { Table } from "components/ui"
import DataRowActions from "components/ui/Table/DataRowActions"
import { getRoleName } from "components/user/utils"
import { useAbility } from "lib/contexts/AbilityContext"

type Props = {
  data: User[]
}

const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor("email", {
    header: "Email",
    filterFn: "includesString",
  }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: (info) => getRoleName(info.getValue()),
    sortingFn: (rowA, rowB) => {
      const roleOrder = [Role.superadmin, Role.admin, Role.user, Role.guest]

      const roleA = rowA.original.role
      const roleB = rowB.original.role

      if (roleA === roleB) {
        return rowA.original.email.localeCompare(rowB.original.email)
      }

      return roleOrder.indexOf(roleA) - roleOrder.indexOf(roleB)
    },
  }),
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
]

const PharmacyUsersTable = (props: Props) => {
  const { data } = props

  return (
    <Table className="pharmacy-users-table" data={data} columns={columns} />
  )
}

export default PharmacyUsersTable

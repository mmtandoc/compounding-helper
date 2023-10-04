import { subject } from "@casl/ability"
import { Chemical } from "@prisma/client"
import { createColumnHelper } from "@tanstack/react-table"
import { BsGlobe } from "react-icons/bs"

import { Table } from "components/ui"
import DataRowActions from "components/ui/Table/DataRowActions"
import { useAbility } from "lib/contexts/AbilityContext"
import { useCurrentUser } from "lib/hooks/useCurrentUser"
import { isCentralPharmacy, toIsoDateString } from "lib/utils"

type Props = {
  data: Chemical[]
}

const columnHelper = createColumnHelper<Chemical>()

const columns = [
  columnHelper.accessor((c) => isCentralPharmacy(c.pharmacyId), {
    id: "isCentral",
    header: "",
    cell: (info) => (info.getValue() ? <BsGlobe title="Central" /> : null),
    enableColumnFilter: false,
  }),
  columnHelper.accessor("id", {
    header: "ID",
    filterFn: "equalsString",
  }),
  columnHelper.accessor("name", {
    header: "Name",
    filterFn: "includesString",
  }),
  columnHelper.accessor("casNumber", {
    header: "CAS #",
  }),
  columnHelper.accessor("nioshTable", {
    header: "NIOSH Table",
    cell: (info) =>
      info.getValue() === -1 ? "N/A" : `Table ${info.getValue()}`,
    enableColumnFilter: false,
  }),
  columnHelper.accessor("nioshRevisionDate", {
    header: "NIOSH Revision Date",
    cell: (info) => {
      const value = info.getValue()
      return value ? toIsoDateString(value) : ""
    },
    enableColumnFilter: false,
  }),
  columnHelper.display({
    id: "actions",
    cell: function ActionsCell(info) {
      const { user } = useCurrentUser()
      const ability = useAbility()
      const data = info.row.original
      const canEditChemical = ability.can("update", subject("Chemical", data))
      const canManageAdditionalInfo = ability.can(
        "manage",
        subject("AdditionalChemicalInfo", {
          id: 0,
          chemical: data,
          chemicalId: data.id,
          value: "PLACEHOLDER",
          pharmacyId: user?.pharmacyId ?? NaN,
        }),
      )
      return (
        <DataRowActions
          row={info.row}
          viewButton={{ getUrl: (data) => `/chemicals/${data.id}` }}
          editButton={
            canEditChemical || canManageAdditionalInfo
              ? { getUrl: (data) => `/chemicals/${data.id}/edit` }
              : undefined
          }
        />
      )
    },
  }),
]

const ChemicalTable = (props: Props) => {
  const { data } = props

  return <Table className="chemical-table" data={data} columns={columns} />
}

export default ChemicalTable

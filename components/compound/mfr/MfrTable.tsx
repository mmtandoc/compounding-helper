import Link from "next/link"

import Button from "components/common/Button"
import Table from "components/common/Table"
import filterFns from "lib/table/filterFns"
import { toIsoDateString } from "lib/utils"
import { IngredientAll, MfrAll } from "types/models"

type Props = {
  data: MfrAll[]
}

const MfrTable = (props: Props) => {
  const { data } = props

  return (
    <Table
      className="mfr-table"
      data={data}
      columns={[
        {
          label: "Version",
          sortable: true,
          compare: (a: number, b: number) => a - b,
          accessorPath: "version",
        },
        {
          label: "Developed by",
          sortable: true,
          compare: (a: string, b: string) => a.localeCompare(b),
          accessorPath: "developedBy",
        },
        {
          label: "Verified by",
          sortable: true,
          compare: (a: string | null, b: string | null) =>
            (a ?? "").localeCompare(b ?? ""),
          accessorPath: "verifiedBy",
          renderCell: (val) => val ?? "N/A",
        },
        {
          label: "Effective date",
          sortable: true,
          compare: (a: string, b: string) => Date.parse(a) - Date.parse(b),
          accessorPath: "effectiveDate",
          renderCell: (date: Date) => toIsoDateString(date),
        },
        {
          id: "actions",
          renderCell: (_, data) => (
            <div>
              <Link href={`/compounds/${data.compoundId}/mfrs/${data.version}`}>
                <Button size="small">View</Button>
              </Link>
              <Link
                href={`/compounds/${data.compoundId}/mfrs/${data.version}/edit`}
              >
                <Button size="small">Edit</Button>
              </Link>
              <style jsx>{`
                div {
                  display: flex;
                  column-gap: 0.3rem;
                  flex-wrap: nowrap;
                  margin: 0.2rem 0;
                }
              `}</style>
            </div>
          ),
        },
      ]}
    />
  )
}

export default MfrTable

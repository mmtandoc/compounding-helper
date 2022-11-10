import { Chemical } from "@prisma/client"
import Link from "next/link"

import Button from "components/common/Button"
import Table from "components/common/Table"
import filterFns from "lib/table/filterFns"

type Props = {
  data: Chemical[]
}

//TODO: Implement searching
const ChemicalTable = (props: Props) => {
  const { data } = props

  return (
    <>
      <Table
        className="chemical-table"
        data={data}
        columns={[
          {
            accessorPath: "id",
            label: "ID",
            sortable: true,
            compare: (a: number, b: number) => a - b,
          },
          {
            accessorPath: "name",
            label: "Name",
            sortable: true,
            compare: (a: string, b: string) =>
              a.localeCompare(b, "en-CA", { numeric: true }),
            enableColumnFilter: true,
            filterFn: filterFns.string,
          },
          {
            accessorPath: "casNumber",
            label: "CAS Number",
            sortable: true,
            compare: (a: string | null, b: string | null) =>
              (a ?? "").localeCompare(b ?? "", "en-CA", { numeric: true }),
            renderCell: (value: string | null) => value ?? "N/A",
            enableColumnFilter: true,
            filterFn: filterFns.string,
          },
          {
            accessorPath: "nioshTable",
            label: "NIOSH Table",
            sortable: true,
            compare: (a: number, b: number) => a - b,
            renderCell: (value: number) =>
              value === -1 ? "N/A" : `Table ${value}`,
          },
          {
            accessorPath: "nioshRevisionDate",
            label: "NIOSH Revision Date",
            sortable: true,
            compare: (a: Date | null, b: Date | null) =>
              (a?.toISOString() ?? "").localeCompare(b?.toISOString() ?? ""),
            renderCell: (date: Date | null) =>
              date?.toLocaleDateString("en-CA") ?? "",
          },
          {
            id: "actions",
            renderCell: (_, data) => (
              <div>
                <Link href={`/chemicals/${data.id}`}>
                  <Button size="small">View</Button>
                </Link>
                <Link href={`/chemicals/${data.id}/edit`}>
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
    </>
  )
}

export default ChemicalTable

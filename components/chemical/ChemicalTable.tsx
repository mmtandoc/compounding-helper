import { Chemical } from "@prisma/client"
import Link from "next/link"

import Table from "components/common/Table"

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
          },
          {
            accessorPath: "casNumber",
            label: "CAS Number",
            sortable: true,
            compare: (a: string | null, b: string | null) =>
              (a ?? "").localeCompare(b ?? "", "en-CA", { numeric: true }),
            renderCell: (value: string | null) => value ?? "N/A",
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
            accessorPath: "",
            label: "",
            sortable: false,
            renderCell: (_, value) => (
              <>
                <Link href={`/chemicals/${value.id}`} passHref>
                  <button type="button">View</button>
                </Link>
                <style jsx>{`
                  td > button {
                    display: block;
                    margin: auto;
                  }
                `}</style>
              </>
            ),
          },
        ]}
      />
    </>
  )
}

export default ChemicalTable

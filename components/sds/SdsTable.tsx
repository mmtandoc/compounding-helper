import { Chemical } from "@prisma/client"
import Link from "next/link"
import React from "react"

import Table from "components/common/Table"
import filterFns from "lib/table/filterFns"
import { SdsWithRelations } from "types/models"

type Props = {
  data: SdsWithRelations[]
}

//TODO: Allow searching & sorting, add option to hide old revisions
const SdsTable = (props: Props) => {
  const { data } = props

  return (
    <>
      <Table
        className="sds-table"
        data={data}
        columns={[
          {
            accessorPath: "id",
            label: "ID",
            sortable: true,
            compare: (a: number, b: number) => a - b,
          },
          {
            accessorPath: "product.chemical",
            label: "Chemical",
            sortable: true,
            compare: (a: Chemical, b: Chemical) =>
              a.name.localeCompare(b.name, "en-CA", { numeric: true }),
            enableColumnFilter: true,
            filterFn: (chemical: Chemical, _, query) =>
              [chemical.name, ...chemical.synonyms].some((str) =>
                filterFns.string(str, _, query),
              ),
            renderCell: (chemical: Chemical) => chemical.name,
          },
          {
            accessorPath: "product.name",
            label: "Product",
            sortable: true,
            compare: (a: string, b: string) =>
              a.localeCompare(b, "en-CA", { numeric: true }),
            enableColumnFilter: true,
            filterFn: filterFns.string,
          },
          {
            accessorPath: "product.vendor.name",
            label: "Vendor",
            sortable: true,
            compare: (a: string, b: string) =>
              a.localeCompare(b, "en-CA", { numeric: true }),
            enableColumnFilter: true,
            filterFn: filterFns.string,
          },
          {
            accessorPath: "revisionDate",
            label: "Revision Date",
            sortable: true,
            compare: (a: Date, b: Date) =>
              a.toISOString().localeCompare(b.toISOString()),
            renderCell: (date: Date) => date.toISOString().split("T")[0],
          },
          {
            id: "view",
            renderCell: (_, value) => (
              <>
                <Link href={`/sds/${value.id}`}>
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

export default SdsTable

import { Chemical } from "@prisma/client"
import Link from "next/link"
import React from "react"

import { Button, Table } from "components/ui"
import filterFns from "lib/table/filterFns"
import { toIsoDateString } from "lib/utils"
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
            renderCell: (date: Date) => toIsoDateString(date),
          },
          {
            id: "actions",
            renderCell: (_, data) => (
              <div>
                <Link href={`/sds/${data.id}`}>
                  <Button size="small" theme="primary">
                    View
                  </Button>
                </Link>
                <Link href={`/sds/${data.id}/edit`}>
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

export default SdsTable

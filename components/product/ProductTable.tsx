import { Chemical } from "@prisma/client"
import Link from "next/link"

import Button from "components/common/Button"
import Table from "components/common/Table"
import filterFns from "lib/table/filterFns"
import { ProductAll } from "types/models"

type Props = {
  data: ProductAll[]
}

//TODO: Implement searching
const ProductTable = (props: Props) => {
  const { data } = props

  return (
    <>
      <Table
        className="product-table"
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
            accessorPath: "vendor.name",
            label: "Vendor",
            sortable: true,
            compare: (a: string, b: string) =>
              a.localeCompare(b, "en-CA", { numeric: true }),
            enableColumnFilter: true,
            filterFn: filterFns.string,
          },
          {
            accessorPath: "chemical",
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
            id: "actions",
            renderCell: (_, data) => (
              <div>
                <Link href={`/products/${data.id}`}>
                  <Button size="small" theme="primary">
                    View
                  </Button>
                </Link>
                <Link href={`/products/${data.id}/edit`}>
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

export default ProductTable

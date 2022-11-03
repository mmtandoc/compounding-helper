import { Chemical } from "@prisma/client"
import Link from "next/link"

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
            renderCell: (_, value) => (
              <>
                <Link href={`/products/${value.id}`} passHref>
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

export default ProductTable

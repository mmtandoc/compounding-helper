import Table from "components/common/Table"
import Link from "next/link"
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
            accessorPath: "vendor.name",
            label: "Vendor",
            sortable: true,
            compare: (a: string, b: string) =>
              a.localeCompare(b, "en-CA", { numeric: true }),
          },
          {
            accessorPath: "chemical.name",
            label: "Chemical",
            sortable: true,
            compare: (a: string, b: string) =>
              a.localeCompare(b, "en-CA", { numeric: true }),
          },
          {
            accessorPath: "",
            label: "",
            sortable: false,
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

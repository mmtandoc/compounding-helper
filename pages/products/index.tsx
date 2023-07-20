import { GetServerSideProps } from "next"
import Link from "next/link"

import TableActionBar from "components/common/TableActionBar"
import ProductTable from "components/product/ProductTable"
import { Button } from "components/ui"
import { getProducts } from "pages/api/products"
import { NextPageWithLayout } from "types/common"
import { ProductAll } from "types/models"

type Props = {
  data: ProductAll[]
}

const Products: NextPageWithLayout<Props> = (props: Props) => {
  const { data } = props

  const actionBar = (
    <TableActionBar>
      <Link href="/products/new">
        <Button>New Product</Button>
      </Link>
    </TableActionBar>
  )

  return (
    <div>
      {actionBar}
      <ProductTable data={data} />
      {actionBar}
      <style jsx>{`
        :global(.product-table) {
          width: 100%;
        }
      `}</style>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const data: ProductAll[] = (await getProducts()) ?? []

  return { props: { title: "Products", data } }
}

export default Products

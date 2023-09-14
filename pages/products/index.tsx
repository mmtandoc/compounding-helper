import Link from "next/link"

import TableActionBar from "components/common/TableActionBar"
import ProductTable from "components/product/ProductTable"
import { Button } from "components/ui"
import { withPageAuth } from "lib/auth"
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

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (_, session) => {
    const data: ProductAll[] = (await getProducts(session)) ?? []

    return { props: { title: "Products", data } }
  },
  requireAuth: true,
})

export default Products

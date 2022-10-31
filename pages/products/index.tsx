import { GetServerSideProps } from "next"
import Link from "next/link"

import ProductTable from "components/product/ProductTable"
import { getProducts } from "pages/api/products"
import { NextPageWithLayout } from "types/common"
import { ProductAll } from "types/models"

type Props = {
  data: ProductAll[]
}

const Products: NextPageWithLayout<Props> = (props: Props) => {
  const { data } = props

  const actionBar = (
    <div className="action-bar">
      <Link href="/products/new">
        <button type="button">New Product</button>
      </Link>
      <style jsx>{`
        .action-bar {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          display: flex;
          column-gap: 0.5rem;
        }
      `}</style>
    </div>
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

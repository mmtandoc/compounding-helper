import Layout from "components/Layout"
import ProductTable from "components/product/ProductTable"
import { GetServerSideProps, NextPage } from "next"
import Link from "next/link"
import { getProducts } from "pages/api/products"
import { ProductAll } from "types/models"

type Props = {
  data: ProductAll[]
}

const Products: NextPage<Props> = (props: Props) => {
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
    <Layout>
      <div className="page">
        <h1>Products</h1>
        <div>
          {actionBar}
          <ProductTable data={data} />
          {actionBar}
        </div>
      </div>
      <style jsx>{`
        h1 {
          margin-top: 0;
        }
      `}</style>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const data: ProductAll[] = (await getProducts()) ?? []

  return { props: { data } }
}

export default Products

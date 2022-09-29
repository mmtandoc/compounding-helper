import Details from "components/common/data-pages/Details"
import Layout from "components/Layout"
import ProductDetails from "components/product/ProductDetails"
import { GetServerSideProps, NextPage } from "next"
import { getProductById } from "pages/api/products/[id]"
import { ProductAll } from "types/models"

type Props = {
  data: ProductAll
}

const ProductPage: NextPage<Props> = (props: Props) => {
  const { data } = props

  return (
    <Layout>
      <div className="page">
        <h1>
          Product: {data.name} ({data.vendor.name})
        </h1>
        <Details
          id={data.id}
          data={data}
          dataLabel="product"
          apiPath="/api/products"
          urlPath="/products"
          detailsComponent={ProductDetails}
        />
      </div>
      <style jsx>{`
        h1 {
          margin-top: 0;
        }
        .page {
          margin-bottom: 5rem;
        }
      `}</style>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const id = parseInt(context.query.id as string)

  if (isNaN(id)) {
    return { notFound: true }
  }

  const data = await getProductById(id)

  if (data === null) {
    return { notFound: true }
  }

  return { props: { data } }
}

export default ProductPage

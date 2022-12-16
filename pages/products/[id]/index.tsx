import { GetServerSideProps } from "next"

import Details from "components/common/data-pages/Details"
import ProductDetails from "components/product/ProductDetails"
import { getProductById } from "pages/api/products/[id]"
import { NextPageWithLayout } from "types/common"
import { ProductAll } from "types/models"

type Props = {
  data: ProductAll
}

const ProductPage: NextPageWithLayout<Props> = (props: Props) => {
  const { data } = props

  return (
    <Details
      data={data}
      dataLabel="product"
      apiEndpointPath={`/api/products/${data.id}`}
      urlPath={`/products/${data.id}`}
      detailsComponent={ProductDetails}
    />
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

  return {
    props: { title: `Product: ${data.name} (${data.vendor.name})`, data },
  }
}

export default ProductPage

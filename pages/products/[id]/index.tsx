import { useMemo } from "react"

import Details from "components/common/data-pages/Details"
import ProductDetails from "components/product/ProductDetails"
import { withPageAuth } from "lib/auth"
import { useCurrentUser } from "lib/hooks/useCurrentUser"
import { getProductById } from "pages/api/products/[id]"
import { NextPageWithLayout } from "types/common"
import { ProductAll } from "types/models"

type Props = {
  data: ProductAll
}

const ProductPage: NextPageWithLayout<Props> = (props: Props) => {
  const { data } = props

  const { user } = useCurrentUser()

  const disableEditDelete = useMemo(
    () => user?.pharmacyId !== data.pharmacyId,
    [user?.pharmacyId, data.pharmacyId],
  )

  return (
    <Details
      data={data}
      dataLabel="product"
      apiEndpointPath={`/api/products/${data.id}`}
      urlPath={`/products/${data.id}`}
      detailsComponent={ProductDetails}
      notice={
        disableEditDelete &&
        "Current record is owned by central. Unable to edit or delete."
      }
      actions={{
        edit: { visible: true, disabled: disableEditDelete },
        delete: { visible: true, disabled: disableEditDelete },
      }}
    />
  )
}

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (context, session) => {
    const id = parseInt(context.query.id as string)

    if (isNaN(id)) {
      return { notFound: true }
    }

    const data = await getProductById(session, id)

    if (data === null) {
      return { notFound: true }
    }

    return {
      props: {
        title: `Product: ${data.name} (${data.vendor.name})`,
        data,
      },
    }
  },
  requireAuth: true,
})

export default ProductPage

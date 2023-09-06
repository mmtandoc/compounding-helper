import { GetServerSideProps } from "next"
import { useMemo } from "react"

import Details from "components/common/data-pages/Details"
import ProductDetails from "components/product/ProductDetails"
import { getSession } from "lib/api/utils"
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

  const permissions = useMemo(() => {
    const canEditDelete = user?.pharmacyId === data.pharmacyId
    return { edit: canEditDelete, delete: canEditDelete }
  }, [user?.pharmacyId, data.pharmacyId])

  return (
    <Details
      data={data}
      dataLabel="product"
      apiEndpointPath={`/api/products/${data.id}`}
      urlPath={`/products/${data.id}`}
      detailsComponent={ProductDetails}
      actions={permissions}
    />
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const session = await getSession(context)

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }

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
      initialAppSession: session,
      data,
    },
  }
}

export default ProductPage

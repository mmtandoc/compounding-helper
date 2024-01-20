import { subject } from "@casl/ability"

import Details from "components/common/data-pages/Details"
import ProductDetails from "components/product/ProductDetails"
import { withPageAuth } from "lib/auth"
import { useAbility } from "lib/contexts/AbilityContext"
import { isCentralPharmacy } from "lib/utils"
import { getProductById } from "pages/api/products/[id]"
import { NextPageWithLayout } from "types/common"
import { ProductAll } from "types/models"

type Props = {
  data: ProductAll
}

const ProductPage: NextPageWithLayout<Props> = (props: Props) => {
  const { data } = props

  const ability = useAbility()

  const canEdit = ability.can("update", subject("Product", data))
  const canDelete = ability.can("delete", subject("Product", data))

  let notice: string | undefined = undefined

  if (isCentralPharmacy(data.pharmacyId) && !canEdit && !canDelete) {
    notice = "Current record is owned by central. Unable to edit or delete."
  }

  return (
    <Details
      data={data}
      dataLabel="product"
      apiEndpointPath={`/api/products/${data.id}`}
      urlPath={`/products/${data.id}`}
      detailsComponent={ProductDetails}
      notice={notice}
      actions={{
        edit: { visible: true, disabled: !canEdit },
        delete: { visible: true, disabled: !canDelete },
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

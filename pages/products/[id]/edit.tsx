import { subject } from "@casl/ability"
import { useRouter } from "next/router"

import EditForm from "components/common/data-pages/EditForm"
import ProductEntry from "components/product/ProductEntry"
import { withPageAuth } from "lib/auth"
import { defineAbilityForUser } from "lib/auth/ability/appAbilities"
import { NullableProductFields, ProductFields, productSchema } from "lib/fields"
import ProductMapper from "lib/mappers/ProductMapper"
import { getProductById } from "pages/api/products/[id]"
import { NextPageWithLayout } from "types/common"

type EditProductProps = {
  values: ProductFields
}

const EditProduct: NextPageWithLayout<EditProductProps> = (
  props: EditProductProps,
) => {
  const { values } = props

  const router = useRouter()
  const id = parseInt(router.query.id as string)

  return (
    <EditForm
      schema={productSchema}
      values={values as NullableProductFields}
      apiEndpointPath={`/api/products/${id}`}
      urlPath={`/products/${id}`}
      entryComponent={ProductEntry}
    />
  )
}

export const getServerSideProps = withPageAuth<EditProductProps>({
  getServerSideProps: async (context, session) => {
    const id = parseInt(context.query.id as string)

    if (isNaN(id)) {
      return { notFound: true }
    }

    const data = await getProductById(session, id)

    if (data === null) {
      return { notFound: true }
    }

    // Check if current user has permission to update the product
    if (
      defineAbilityForUser(session.appUser).cannot(
        "update",
        subject("Product", data),
      )
    ) {
      //TODO: Return 403 status code instead?
      //TODO: Return cause message from CASL
      return { notFound: true }
    }

    const values = ProductMapper.toFieldValues(data)

    return {
      props: {
        title: `Edit Product - ${values?.name}`,
        values,
      },
    }
  },
  requireAuth: true,
})

export default EditProduct

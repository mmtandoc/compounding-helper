import { GetServerSideProps } from "next"
import { useRouter } from "next/router"

import EditForm from "components/common/data-pages/EditForm"
import ProductEntry from "components/product/ProductEntry"
import { getSession } from "lib/api/utils"
import { NullableProductFields, ProductFields, productSchema } from "lib/fields"
import ProductMapper from "lib/mappers/ProductMapper"
import { isCentralPharmacy } from "lib/utils"
import { getProductById } from "pages/api/products/[id]"
import { ErrorProps, NextPageWithLayout } from "types/common"

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

export const getServerSideProps: GetServerSideProps<EditProductProps> = async (
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

  //Check if record is owned by central
  if (isCentralPharmacy(data.pharmacyId)) {
    /* return {
      props: { error: { statusCode: 403, message: "Forbidden" } },
    } */
  }

  const values = ProductMapper.toFieldValues(data)

  return {
    props: {
      title: `Edit Product - ${values?.name}`,
      values,
    },
  }
}

export default EditProduct

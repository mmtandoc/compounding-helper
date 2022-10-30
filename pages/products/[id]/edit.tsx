import EditForm from "components/common/data-pages/EditForm"
import ProductEntry from "components/product/ProductEntry"
import ProductMapper from "lib/mappers/ProductMapper"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { getProductById } from "pages/api/products/[id]"
import {
  NullPartialProductFields,
  ProductFields,
  productSchema,
} from "lib/fields"
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
      id={id}
      schema={productSchema}
      values={values as NullPartialProductFields}
      apiEndpointPath="/api/products"
      urlPath="/products"
      entryComponent={ProductEntry}
    />
  )
}

export const getServerSideProps: GetServerSideProps<EditProductProps> = async (
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

  const values = ProductMapper.toFieldValues(data)

  return {
    props: {
      title: `Edit Product - ${values?.name}`,
      values,
    },
  }
}


export default EditProduct

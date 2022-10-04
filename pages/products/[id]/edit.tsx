import EditForm from "components/common/data-pages/EditForm"
import Layout from "components/Layout"
import ProductEntry, {
  NullPartialProductFields,
} from "components/product/ProductEntry"
import ProductMapper from "lib/mappers/ProductMapper"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { getProductById } from "pages/api/products/[id]"
import { ProductFields } from "types/fields"

type EditProductProps = {
  values: ProductFields
}

const EditProduct: NextPage<EditProductProps> = (props: EditProductProps) => {
  const { values } = props

  const router = useRouter()
  const id = parseInt(router.query.id as string)

  return (
    <Layout>
      <div className="page">
        <h1>Edit Product - {values?.name}</h1>
        <EditForm
          id={id}
          values={values as NullPartialProductFields}
          apiEndpointPath="/api/products"
          urlPath="/products"
          entryComponent={ProductEntry}
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

  return {
    props: {
      values: ProductMapper.toFieldValues(data),
    },
  }
}

export default EditProduct

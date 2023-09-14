import CreateForm from "components/common/data-pages/CreateForm"
import ProductEntry from "components/product/ProductEntry"
import { withPageAuth } from "lib/auth"
import { NullableProductFields, productSchema } from "lib/fields"
import { NextPageWithLayout } from "types/common"

const defaultValues: NullableProductFields = {
  name: null,
  vendorId: null,
  chemicalId: null,
}

const NewProduct: NextPageWithLayout = () => {
  return (
    <CreateForm
      dataName="product"
      schema={productSchema}
      defaultValues={defaultValues}
      apiEndpointPath="/api/products"
      entryComponent={ProductEntry}
    />
  )
}

export const getServerSideProps = withPageAuth({
  getServerSideProps: async () => {
    return {
      props: {
        title: "New Product",
      },
    }
  },
  requireAuth: true,
})

export default NewProduct

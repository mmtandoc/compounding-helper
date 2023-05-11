import { GetStaticProps } from "next"

import CreateForm from "components/common/data-pages/CreateForm"
import ProductEntry from "components/product/ProductEntry"
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

export const getStaticProps: GetStaticProps = () => ({
  props: { title: "New Product" },
})

export default NewProduct

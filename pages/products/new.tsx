import CreateForm from "components/common/data-pages/CreateForm"
import Layout from "components/Layout"
import ProductEntry from "components/product/ProductEntry"
import { NullPartialProductFields, productSchema } from "lib/fields"
import { NextPage } from "next"

const defaultValues: NullPartialProductFields = {
  name: null,
  vendorId: null,
  chemicalId: null,
}

const NewProduct: NextPage = () => {
  return (
    <Layout>
      <div className="page">
        <h1>New Product</h1>
        <CreateForm
          dataName="product"
          schema={productSchema}
          defaultValues={defaultValues}
          apiEndpointPath="/api/products"
          urlPath="/products"
          entryComponent={ProductEntry}
        />
      </div>
      <style jsx>{`
        h1 {
          margin-top: 0;
        }
      `}</style>
    </Layout>
  )
}

export default NewProduct

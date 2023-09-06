import { GetServerSideProps } from "next"

import CreateForm from "components/common/data-pages/CreateForm"
import ProductEntry from "components/product/ProductEntry"
import { getSession } from "lib/api/utils"
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }

  return {
    props: {
      title: "New Product",
      initialAppSession: session,
    },
  }
}

export default NewProduct

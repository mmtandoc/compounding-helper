import CreateForm from "components/common/data-pages/CreateForm"
import SdsEntry from "components/sds/SdsEntry"
import { withPageAuth } from "lib/auth"
import { NullableSdsFields, sdsSchema } from "lib/fields"
import { NextPageWithLayout } from "types/common"

const defaultValues: NullableSdsFields = {
  chemicalId: null,
  productId: null,
  hmisHazardLevel: null,
  revisionDate: null,
  hazards: [],
  requireVentilation: null,
}

const NewSafetyDataSheet: NextPageWithLayout = () => {
  return (
    <CreateForm
      schema={sdsSchema}
      defaultValues={defaultValues}
      entryComponent={SdsEntry}
      apiEndpointPath="/api/sds"
      dataName="SDS"
    />
  )
}

export const getServerSideProps = withPageAuth({
  getServerSideProps: async () => {
    return {
      props: {
        title: "New SDS summary",
      },
    }
  },
  requireAuth: true,
})

export default NewSafetyDataSheet

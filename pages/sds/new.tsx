import { GetStaticProps } from "next"

import CreateForm from "components/common/data-pages/CreateForm"
import SdsEntry from "components/sds/SdsEntry"
import { NullPartialSdsFields, sdsSchema } from "lib/fields"
import { NextPageWithLayout } from "types/common"

const defaultValues: NullPartialSdsFields = {
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

export const getStaticProps: GetStaticProps = async () => ({
  props: {
    title: "New SDS summary",
  },
})

export default NewSafetyDataSheet

import CreateForm from "components/common/data-pages/CreateForm"
import Layout from "components/Layout"
import SdsEntry from "components/sds/SdsEntry"
import { NullPartialSdsFields, sdsSchema } from "lib/fields"
import { NextPage } from "next"

const defaultValues: NullPartialSdsFields = {
  chemicalId: null,
  productId: null,
  hmisHazardLevel: null,
  revisionDate: null,
  hazards: [],
  requireVentilation: null,
  filename: "N/A",
}

const NewSafetyDataSheet: NextPage = () => {
  return (
    <Layout>
      <div className="page">
        <h1>New Safety Data Sheet</h1>
        <CreateForm
          schema={sdsSchema}
          defaultValues={defaultValues}
          entryComponent={SdsEntry}
          apiEndpointPath="/api/sds"
          urlPath="/sds"
          dataName="SDS"
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

export default NewSafetyDataSheet

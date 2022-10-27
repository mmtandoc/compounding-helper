import CreateForm from "components/common/data-pages/CreateForm"
import CompoundEntry from "components/compound/CompoundEntry"
import Layout from "components/Layout"
import { NullPartialCompoundFields, riskAssessmentSchema } from "lib/fields"
import { NextPage } from "next"

const defaultValues: NullPartialCompoundFields = {
  name: null,
  ingredients: [
    {
      order: NaN,
      chemicalId: null,
      physicalForm: null,
      sdsId: null,
      isCommercialProduct: null,
      commercialProduct: {
        name: null,
        din: null,
        hasNoDin: null,
        hasProductMonographConcerns: null,
        concernsDescription: null,
      },
    },
  ],
}

const NewCompound: NextPage = () => {
  return (
    <Layout>
      <div className="page">
        <h1>New Compound</h1>
        <CreateForm
          defaultValues={defaultValues as NullPartialCompoundFields}
          schema={riskAssessmentSchema}
          entryComponent={CompoundEntry}
          apiEndpointPath="/api/compounds"
          urlPath="/compounds"
          dataName="compounds"
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

export default NewCompound

import CreateForm from "components/common/data-pages/CreateForm"
import CompoundEntry from "components/compound/CompoundEntry"
import { withPageAuth } from "lib/auth"
import { NullableCompoundFields, riskAssessmentSchema } from "lib/fields"
import { NextPageWithLayout } from "types/common"

const defaultValues: NullableCompoundFields = {
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

const NewCompound: NextPageWithLayout = () => {
  return (
    <CreateForm
      defaultValues={defaultValues as NullableCompoundFields}
      schema={riskAssessmentSchema}
      entryComponent={CompoundEntry}
      apiEndpointPath="/api/compounds"
      dataName="compounds"
    />
  )
}

export const getServerSideProps = withPageAuth({
  getServerSideProps: async () => {
    return {
      props: {
        title: "New Compound",
      },
    }
  },
  requireAuth: true,
})

export default NewCompound

import { GetStaticProps } from "next"

import CreateForm from "components/common/data-pages/CreateForm"
import CompoundEntry from "components/compound/CompoundEntry"
import { NullPartialCompoundFields, riskAssessmentSchema } from "lib/fields"
import { NextPageWithLayout } from "types/common"

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

const NewCompound: NextPageWithLayout = () => {
  return (
    <CreateForm
      defaultValues={defaultValues as NullPartialCompoundFields}
      schema={riskAssessmentSchema}
      entryComponent={CompoundEntry}
      apiEndpointPath="/api/compounds"
      dataName="compounds"
    />
  )
}

export const getStaticProps: GetStaticProps = () => {
  return {
    props: { title: "New Compound" },
  }
}

export default NewCompound

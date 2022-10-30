import ChemicalEntry from "components/chemical/ChemicalEntry"
import CreateForm from "components/common/data-pages/CreateForm"
import { chemicalSchema, NullPartialChemicalFields } from "lib/fields"
import { GetStaticProps } from "next"
import { NextPageWithLayout } from "types/common"

const defaultValues: NullPartialChemicalFields = {
  name: null,
  casNumber: null,
  hasNoCasNumber: null,
  synonyms: null,
  nioshTable: null,
  nioshRevisionDate: null,
}

const NewChemical: NextPageWithLayout = () => {
  return (
    <CreateForm
      schema={chemicalSchema}
      dataName="chemical"
      defaultValues={defaultValues}
      apiEndpointPath="/api/chemicals"
      urlPath="/chemicals"
      entryComponent={ChemicalEntry}
    />
  )
}


export const getStaticProps: GetStaticProps = () => ({
  props: { title: "New Chemical" },
})

export default NewChemical

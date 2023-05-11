import { GetStaticProps } from "next"

import ChemicalEntry from "components/chemical/ChemicalEntry"
import CreateForm from "components/common/data-pages/CreateForm"
import { NullableChemicalFields, chemicalSchema } from "lib/fields"
import { NextPageWithLayout } from "types/common"

const defaultValues: NullableChemicalFields = {
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
      entryComponent={ChemicalEntry}
    />
  )
}

export const getStaticProps: GetStaticProps = () => ({
  props: { title: "New Chemical" },
})

export default NewChemical

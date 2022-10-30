import ChemicalEntry from "components/chemical/ChemicalEntry"
import EditForm from "components/common/data-pages/EditForm"
import ChemicalMapper from "lib/mappers/ChemicalMapper"
import {
  ChemicalFields,
  chemicalSchema,
  NullPartialChemicalFields,
} from "lib/fields"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { getChemicalById } from "pages/api/chemicals/[id]"
import { NextPageWithLayout } from "types/common"

type EditChemicalProps = {
  values: ChemicalFields
}

const EditChemical: NextPageWithLayout<EditChemicalProps> = (
  props: EditChemicalProps,
) => {
  const { values } = props

  const router = useRouter()
  const id = parseInt(router.query.id as string)

  return (
    <EditForm
      id={id}
      schema={chemicalSchema}
      values={values as NullPartialChemicalFields}
      apiEndpointPath="/api/chemicals"
      urlPath="/chemicals"
      entryComponent={ChemicalEntry}
    />
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = parseInt(context.query.id as string)

  if (isNaN(id)) {
    return { notFound: true }
  }

  const data = await getChemicalById(id)

  if (data === null) {
    return { notFound: true }
  }

  const values = ChemicalMapper.toFieldValues(data)

  return {
    props: {
      title: `Edit Chemical - ${values?.name}`,
      values,
    },
  }
}


export default EditChemical

import { GetServerSideProps } from "next"
import { useRouter } from "next/router"

import ChemicalEntry from "components/chemical/ChemicalEntry"
import EditForm from "components/common/data-pages/EditForm"
import {
  ChemicalFields,
  NullableChemicalFields,
  chemicalSchema,
} from "lib/fields"
import ChemicalMapper from "lib/mappers/ChemicalMapper"
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
      schema={chemicalSchema}
      values={values as NullableChemicalFields}
      apiEndpointPath={`/api/chemicals/${id}`}
      urlPath={`/chemicals/${id}`}
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

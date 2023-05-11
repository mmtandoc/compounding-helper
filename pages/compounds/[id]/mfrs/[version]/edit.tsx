import { GetServerSideProps } from "next"

import EditForm from "components/common/data-pages/EditForm"
import MfrEntry from "components/compound/mfr/MfrEntry"
import { MfrFieldsWithVersion, NullableMfrFields, mfrSchema } from "lib/fields"
import MfrMapper from "lib/mappers/MfrMapper"
import { getMfr } from "pages/api/compounds/[id]/mfrs/[version]"
import { NextPageWithLayout } from "types/common"

type EditMfrProps = {
  values: MfrFieldsWithVersion
}

const EditMfr: NextPageWithLayout<EditMfrProps> = (props: EditMfrProps) => {
  const { values } = props

  const compoundId = values.compoundId
  const version = values.version

  return (
    <EditForm
      schema={mfrSchema}
      values={values as NullableMfrFields}
      apiEndpointPath={`/api/compounds/${compoundId}/mfrs/${version}`}
      urlPath={`/compounds/${compoundId}/mfrs/${version}`}
      entryComponent={MfrEntry}
    />
  )
}

export const getServerSideProps: GetServerSideProps<EditMfrProps> = async (
  context,
) => {
  const compoundId = parseInt(context.query.id as string)
  const version = parseInt(context.query.version as string)

  if (isNaN(compoundId) || isNaN(version)) {
    return { notFound: true }
  }

  const data = await getMfr(compoundId, version)

  if (data === null) {
    return { notFound: true }
  }

  const values = MfrMapper.toFieldValues(data) as MfrFieldsWithVersion

  return {
    props: {
      title: `Edit MFR - ${data.compound.name} - v${data.version}`,
      values,
    },
  }
}

export default EditMfr

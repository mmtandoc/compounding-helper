import { GetServerSideProps } from "next"

import CreateForm from "components/common/data-pages/CreateForm"
import MfrEntry from "components/compound/mfr/MfrEntry"
import { NullPartialMfrFields, mfrSchema } from "lib/fields"
import { getCompoundById } from "pages/api/compounds/[id]"
import { NextPageWithLayout } from "types/common"

const defaultValues: NullPartialMfrFields = {
  compoundId: NaN,
  riskAssessmentId: null,
  quantities: [],
  expectedYield: null,
  training: null,
  requiredEquipment: [],
  calculations: null,
  compoundingMethod: null,
  qualityControl: null,
  packaging: null,
  beyondUseDate: null,
  storage: null,
  labelling: null,
  references: null,
  developedBy: null,
  verifiedBy: null,
  effectiveDate: new Date().toISOString().split("T")[0],
}

type NewMfrProps = {
  compoundId: number
}

const NewMfr: NextPageWithLayout<NewMfrProps> = (props) => {
  const { compoundId } = props
  return (
    <CreateForm
      defaultValues={{ ...defaultValues, compoundId } as NullPartialMfrFields}
      schema={mfrSchema}
      entryComponent={MfrEntry}
      apiEndpointPath={`/api/compounds/${compoundId}/mfrs`}
      dataName="MFR"
    />
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const compoundId = parseInt(context.query.id as string)
  const compound = await getCompoundById(compoundId)

  if (compound === null) {
    return { notFound: true }
  }

  return {
    props: { title: `New MFR - ${compound.name}`, compoundId },
  }
}

export default NewMfr

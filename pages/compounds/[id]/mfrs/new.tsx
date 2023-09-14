import CreateForm from "components/common/data-pages/CreateForm"
import MfrEntry from "components/compound/mfr/MfrEntry"
import { withPageAuth } from "lib/auth"
import { NullableMfrFields, mfrSchema } from "lib/fields"
import { isCentralPharmacy } from "lib/utils"
import { getCompoundById } from "pages/api/compounds/[id]"
import { NextPageWithLayout } from "types/common"

const defaultValues: NullableMfrFields = {
  compoundId: NaN,
  version: undefined,
  pharmaceuticalForm: null,
  routeOfAdministration: null,
  riskAssessmentId: null,
  quantities: [],
  expectedYield: null,
  training: [],
  requiredEquipment: [],
  calculations: null,
  compoundingMethod: null,
  qualityControls: [{ name: null, expectedSpecification: null }],
  packaging: null,
  beyondUseDate: null,
  storage: null,
  labelling: [],
  references: [],
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
      defaultValues={{ ...defaultValues, compoundId } as NullableMfrFields}
      schema={mfrSchema}
      entryComponent={MfrEntry}
      apiEndpointPath={`/api/compounds/${compoundId}/mfrs`}
      dataName="MFR"
    />
  )
}

export const getServerSideProps = withPageAuth<NewMfrProps>({
  getServerSideProps: async (context, session) => {
    const compoundId = parseInt(context.query.id as string)
    const compound = await getCompoundById(session, compoundId)

    if (compound === null) {
      return { notFound: true }
    }

    //Check if record is owned by central & current user is not a central user
    if (
      isCentralPharmacy(compound.pharmacyId) &&
      session.appUser.pharmacyId !== compound.pharmacyId
    ) {
      //TODO: Return 403 status code instead?
      return { notFound: true }
    }

    return {
      props: { title: `New MFR - ${compound.name}`, compoundId },
    }
  },
  requireAuth: true,
})

export default NewMfr

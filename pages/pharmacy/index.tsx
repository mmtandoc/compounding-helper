import { subject } from "@casl/ability"

import Details from "components/common/data-pages/Details"
import PharmacyDetails from "components/pharmacy/PharmacyDetails"
import { withPageAuth } from "lib/auth"
import { useAbility } from "lib/contexts/AbilityContext"
import { getPharmacyById } from "pages/api/pharmacies/[id]"
import { NextPageWithLayout } from "types/common"
import { PharmacyWithUsers } from "types/models"

type Props = { data: PharmacyWithUsers }

const PharmacyPage: NextPageWithLayout<Props> = (props) => {
  const { data } = props

  const ability = useAbility()

  const canEdit = ability.can("update", subject("Pharmacy", data))

  /*
  TODO: Implement deleting pharmacy
  const canDelete = ability.can("delete", subject("Pharmacy", data))
  */

  return (
    <Details
      data={data}
      dataLabel="pharmacy"
      apiEndpointPath={`/api/pharmacies/${data.id}`}
      urlPath={`/pharmacy`}
      detailsComponent={PharmacyDetails}
      actions={{
        edit: { visible: canEdit },
        delete: { visible: false },
      }}
    />
  )
}

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (_, session) => {
    const pharmacy = await getPharmacyById(session, session.appUser.pharmacyId)

    if (!pharmacy) {
      throw new Error("Can't find current pharmacy.")
    }

    return {
      props: {
        title: `Pharmacy: ${pharmacy.name}`,
        data: pharmacy,
      },
    }
  },
  requireAuth: true,
})

export default PharmacyPage

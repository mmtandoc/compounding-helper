import { subject } from "@casl/ability"

import ChemicalDetails from "components/chemical/ChemicalDetails"
import Details from "components/common/data-pages/Details"
import { withPageAuth } from "lib/auth"
import { AppActions } from "lib/auth/ability/appAbilities"
import { useAbility } from "lib/contexts/AbilityContext"
import { useCurrentUser } from "lib/hooks/useCurrentUser"
import { getChemicalById } from "pages/api/chemicals/[id]"
import { NextPageWithLayout } from "types/common"
import { ChemicalAll } from "types/models"

type ChemicalPageProps = {
  data: ChemicalAll
}

const ChemicalPage: NextPageWithLayout<ChemicalPageProps> = (
  props: ChemicalPageProps,
) => {
  const { data } = props

  const { user } = useCurrentUser()
  const ability = useAbility()

  // Users are allowed to go to edit page if they have permission to update the chemical,
  // or are able to create/update the chemical's additional info
  const canEdit =
    ability.can("update", subject("Chemical", data)) ||
    (["create", "update"] as AppActions[]).every((action) =>
      ability.can(
        action,
        subject("AdditionalChemicalInfo", {
          id: NaN,
          chemicalId: data.id,
          chemical: data,
          pharmacyId: user?.pharmacyId ?? NaN,
          value: "PLACEHOLDER VALUE",
        }),
      ),
    )

  const canDelete = ability.can("delete", subject("Chemical", data))

  return (
    <Details
      data={data}
      dataLabel="chemical"
      apiEndpointPath={`/api/chemicals/${data.id}`}
      urlPath={`/chemicals/${data.id}`}
      detailsComponent={ChemicalDetails}
      notice={
        //TODO: Update notice to be dynamic (based on CASL rule reason)
        !canDelete && "Current record is owned by central. Unable to delete."
      }
      actions={{
        edit: { visible: true, disabled: !canEdit },
        delete: { visible: true, disabled: !canDelete },
      }}
    />
  )
}

export const getServerSideProps = withPageAuth<ChemicalPageProps>({
  getServerSideProps: async (context, session) => {
    const id = parseInt(context.query.id as string)

    if (isNaN(id)) {
      return { notFound: true }
    }

    const data = await getChemicalById(session, id)

    if (data === null) {
      return { notFound: true }
    }

    return {
      props: {
        title: `Chemical: ${data.name}`,
        data,
      },
    }
  },
  requireAuth: true,
})

export default ChemicalPage

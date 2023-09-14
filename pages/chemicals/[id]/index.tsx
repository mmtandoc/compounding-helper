import { useMemo } from "react"

import ChemicalDetails from "components/chemical/ChemicalDetails"
import Details from "components/common/data-pages/Details"
import { withPageAuth } from "lib/auth"
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

  const ownedByCurrentPharmacy = useMemo(
    () => user?.pharmacyId === data.pharmacyId,
    [data.pharmacyId, user?.pharmacyId],
  )

  return (
    <Details
      data={data}
      dataLabel="chemical"
      apiEndpointPath={`/api/chemicals/${data.id}`}
      urlPath={`/chemicals/${data.id}`}
      detailsComponent={ChemicalDetails}
      notice={
        !ownedByCurrentPharmacy &&
        "Current record is owned by central. Unable to delete."
      }
      // Users are allowed to edit even if owned by central, but can only modify their own local additional info
      actions={{
        edit: true,
        delete: { visible: true, disabled: !ownedByCurrentPharmacy },
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

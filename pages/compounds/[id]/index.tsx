import { useMemo } from "react"

import Details from "components/common/data-pages/Details"
import CompoundDetails from "components/compound/CompoundDetails"
import { withPageAuth } from "lib/auth"
import { useCurrentUser } from "lib/hooks/useCurrentUser"
import { getCompoundById } from "pages/api/compounds/[id]"
import { NextPageWithLayout } from "types/common"
import { CompoundWithIngredients } from "types/models"

type Props = {
  data: CompoundWithIngredients
}

const CompoundPage: NextPageWithLayout<Props> = (props: Props) => {
  const { data } = props

  const { user } = useCurrentUser()

  const disableEdit = useMemo(
    () => user?.pharmacyId !== data.pharmacyId,
    [user?.pharmacyId, data.pharmacyId],
  )

  return (
    <Details
      data={data}
      dataLabel="compound"
      apiEndpointPath={`/api/compounds/${data.id}`}
      urlPath={`/compounds/${data.id}`}
      detailsComponent={({ data }) => (
        <CompoundDetails data={data} display="all" />
      )}
      notice={
        disableEdit && "Current record is owned by central. Unable to edit."
      }
      actions={{
        delete: false,
        edit: { visible: true, disabled: disableEdit },
      }}
    />
  )
}

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (context, session) => {
    const id = parseInt(context.query.id as string)

    if (isNaN(id)) {
      return { notFound: true }
    }

    const data = await getCompoundById(session, id)

    if (data === null) {
      return { notFound: true }
    }

    return {
      props: {
        title: `Compound: ${data.name}`,
        data,
      },
    }
  },
  requireAuth: true,
})

export default CompoundPage

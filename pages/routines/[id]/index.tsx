import { subject } from "@casl/ability"

import Details from "components/common/data-pages/Details"
import RoutineDetails from "components/routine/RoutineDetails"
import { withPageAuth } from "lib/auth"
import { useAbility } from "lib/contexts/AbilityContext"
import { getRoutineById } from "pages/api/routines/[id]"
import { NextPageWithLayout } from "types/common"
import { RoutineWithHistory } from "types/models"

type ViewRoutineProps = {
  data: RoutineWithHistory
}

const ViewRoutine: NextPageWithLayout<ViewRoutineProps> = (
  props: ViewRoutineProps,
) => {
  const { data } = props

  const ability = useAbility()

  const canEdit = ability.can("update", subject("Routine", data))
  const canDelete = ability.can("delete", subject("Routine", data))

  return (
    <Details
      data={data}
      dataLabel="routine"
      apiEndpointPath={`/api/routines/${data.id}`}
      urlPath={`/routines/${data.id}`}
      detailsComponent={RoutineDetails}
      actions={{
        print: true,
        edit: { visible: true, disabled: !canEdit },
        delete: { visible: true, disabled: !canDelete },
      }}
    />
  )
}

export const getServerSideProps = withPageAuth<ViewRoutineProps>({
  getServerSideProps: async (context, session) => {
    const id = parseInt(context.query.id as string)

    if (isNaN(id)) {
      return { notFound: true }
    }

    const data = await getRoutineById(session, id)

    if (data === null) {
      return { notFound: true }
    }

    return {
      props: {
        title: `Routine: ${data.name}`,
        data,
      },
    }
  },
  requireAuth: true,
})

export default ViewRoutine

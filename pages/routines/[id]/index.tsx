import Details from "components/common/data-pages/Details"
import RoutineDetails from "components/routine/RoutineDetails"
import { withPageAuth } from "lib/auth"
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

  return (
    <Details
      data={data}
      dataLabel="routine"
      apiEndpointPath={`/api/routines/${data.id}`}
      urlPath={`/routines/${data.id}`}
      detailsComponent={RoutineDetails}
      actions={{ print: true }}
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

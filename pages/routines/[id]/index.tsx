import { GetServerSideProps } from "next"

import Details from "components/common/data-pages/Details"
import RoutineDetails from "components/routine/RoutineDetails"
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
    />
  )
}

export const getServerSideProps: GetServerSideProps<ViewRoutineProps> = async (
  context,
) => {
  const id = parseInt(context.query.id as string)

  if (isNaN(id)) {
    return { notFound: true }
  }

  const data = await getRoutineById(id)

  if (data === null) {
    return { notFound: true }
  }

  return { props: { title: `Routine: ${data.name}`, data } }
}

export default ViewRoutine

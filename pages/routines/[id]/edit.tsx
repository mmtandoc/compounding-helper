import { GetServerSideProps } from "next"
import { useRouter } from "next/router"

import EditForm from "components/common/data-pages/EditForm"
import RoutineEntry from "components/routine/RoutineEntry"
import { getSession } from "lib/api/utils"
import { NullableRoutineFields, RoutineFields, routineSchema } from "lib/fields"
import RoutineMapper from "lib/mappers/RoutineMapper"
import { getRoutineById } from "pages/api/routines/[id]"
import { NextPageWithLayout } from "types/common"

type EditRoutineProps = {
  values: RoutineFields
}

//TODO: Make certain fields readonly (based on user type?)
const EditRoutine: NextPageWithLayout<EditRoutineProps> = (
  props: EditRoutineProps,
) => {
  const { values } = props

  const router = useRouter()
  const id = parseInt(router.query.id as string)

  return (
    <EditForm
      schema={routineSchema}
      values={values as NullableRoutineFields}
      apiEndpointPath={`/api/routines/${id}`}
      urlPath={`/routines/${id}`}
      entryComponent={(props) => <RoutineEntry {...props} type="full" />}
    />
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }

  const id = parseInt(context.query.id as string)

  if (isNaN(id)) {
    return { notFound: true }
  }

  const data = await getRoutineById(session.user, id)

  if (data === null) {
    return { notFound: true }
  }

  const values = RoutineMapper.toFieldValues(data)

  return {
    props: {
      title: `Edit Routine - ${values?.name}`,
      values,
    },
  }
}

export default EditRoutine

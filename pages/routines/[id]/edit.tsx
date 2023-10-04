import { subject } from "@casl/ability"
import { useRouter } from "next/router"

import EditForm from "components/common/data-pages/EditForm"
import RoutineEntry from "components/routine/RoutineEntry"
import { withPageAuth } from "lib/auth"
import { defineAbilityForUser } from "lib/auth/ability/appAbilities"
import { NullableRoutineFields, RoutineFields, routineSchema } from "lib/fields"
import RoutineMapper from "lib/mappers/RoutineMapper"
import { getRoutineById } from "pages/api/routines/[id]"
import { NextPageWithLayout } from "types/common"
import { RoutineWithHistory } from "types/models"

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

//TODO: Should be 'withPageAuth<EditRoutineProps>', but typing is incorrect (RoutineFields vs RoutineFieldsInput)
export const getServerSideProps = withPageAuth({
  getServerSideProps: async (context, session) => {
    const id = parseInt(context.query.id as string)

    if (isNaN(id)) {
      return { notFound: true }
    }

    const data: RoutineWithHistory | null = await getRoutineById(session, id)

    if (data === null) {
      return { notFound: true }
    }

    // Check if current user has permission to update this routine
    if (
      defineAbilityForUser(session.appUser).cannot(
        "update",
        subject("Routine", data),
      )
    ) {
      //TODO: Return 403 status code instead?
      //TODO: Return cause message from CASL
      return { notFound: true }
    }

    const values = RoutineMapper.toFieldValues(data)

    return {
      props: {
        title: `Edit Routine - ${values?.name}`,
        values,
      },
    }
  },
  requireAuth: true,
})

export default EditRoutine

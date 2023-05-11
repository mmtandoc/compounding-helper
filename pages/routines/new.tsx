import { GetStaticProps } from "next"
import { Frequency } from "rrule"

import CreateForm from "components/common/data-pages/CreateForm"
import RoutineEntry from "components/routine/RoutineEntry"
import { NullableRoutineFields, routineSchema } from "lib/fields"
import { toIsoDateString } from "lib/utils"
import { NextPageWithLayout } from "types/common"

const defaultValues: NullableRoutineFields = {
  name: null,
  description: null,
  recurrenceRule: {
    startDate: toIsoDateString(new Date()),
    frequency: Frequency.YEARLY,
    interval: 1,
  },
}

const NewRoutine: NextPageWithLayout = () => {
  return (
    <CreateForm
      schema={routineSchema}
      dataName="routine"
      defaultValues={defaultValues}
      apiEndpointPath="/api/routines"
      entryComponent={(props) => <RoutineEntry {...props} type="partial" />}
    />
  )
}

export const getStaticProps: GetStaticProps = () => ({
  props: { title: "New Routine" },
})

export default NewRoutine

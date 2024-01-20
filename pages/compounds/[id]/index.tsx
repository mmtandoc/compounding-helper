import { subject } from "@casl/ability"

import Details from "components/common/data-pages/Details"
import CompoundDetails from "components/compound/CompoundDetails"
import { withPageAuth } from "lib/auth"
import { useAbility } from "lib/contexts/AbilityContext"
import { getCompoundById } from "pages/api/compounds/[id]"
import { NextPageWithLayout } from "types/common"
import { CompoundWithIngredients } from "types/models"

type Props = {
  data: CompoundWithIngredients
}

const CompoundPage: NextPageWithLayout<Props> = (props: Props) => {
  const { data } = props

  const ability = useAbility()

  const canEdit = ability.can("update", subject("Compound", data))

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
        //TODO: Update notice to be dynamic based on CASL rule causes
        !canEdit && "Current record is owned by central. Unable to edit."
      }
      actions={{
        delete: false,
        edit: { visible: true, disabled: !canEdit },
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

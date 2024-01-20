import { subject } from "@casl/ability"

import EditForm from "components/common/data-pages/EditForm"
import MfrEntry from "components/compound/mfr/MfrEntry"
import { withPageAuth } from "lib/auth"
import { defineAbilityForUser } from "lib/auth/ability/appAbilities"
import { MfrFieldsWithVersion, NullableMfrFields, mfrSchema } from "lib/fields"
import MfrMapper from "lib/mappers/MfrMapper"
import { getMfr } from "pages/api/compounds/[id]/mfrs/[version]"
import { NextPageWithLayout } from "types/common"

type EditMfrProps = {
  values: MfrFieldsWithVersion
}

const EditMfr: NextPageWithLayout<EditMfrProps> = (props: EditMfrProps) => {
  const { values } = props

  const compoundId = values.compoundId
  const version = values.version

  return (
    <EditForm
      schema={mfrSchema}
      values={values as NullableMfrFields}
      apiEndpointPath={`/api/compounds/${compoundId}/mfrs/${version}`}
      urlPath={`/compounds/${compoundId}/mfrs/${version}`}
      entryComponent={MfrEntry}
    />
  )
}

export const getServerSideProps = withPageAuth<EditMfrProps>({
  getServerSideProps: async (context, session) => {
    const compoundId = parseInt(context.query.id as string)
    const version = parseInt(context.query.version as string)

    if (isNaN(compoundId) || isNaN(version)) {
      return { notFound: true }
    }

    const data = await getMfr(session, compoundId, version)

    if (data === null) {
      return { notFound: true }
    }

    // Check if current user has permission to update this MFR
    if (
      defineAbilityForUser(session.appUser).cannot(
        "update",
        subject("Mfr", data),
      )
    ) {
      //TODO: Return 403 status code instead?
      //TODO: Return cause message from CASL
      return { notFound: true }
    }

    const values = MfrMapper.toFieldValues(data) as MfrFieldsWithVersion

    return {
      props: {
        title: `Edit MFR - ${data.compound.name} - v${data.version}`,
        values,
      },
    }
  },
  requireAuth: true,
})

export default EditMfr

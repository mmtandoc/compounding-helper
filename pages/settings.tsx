import type { GetServerSideProps } from "next"

import EditForm from "components/common/data-pages/EditForm"
import SettingsEntry from "components/settings/SettingsEntry"
import { getSession } from "lib/api/utils"
import {
  NullableSettingsFields,
  SettingsFields,
  settingsSchema,
} from "lib/fields"
import { getSettings } from "pages/api/settings"
import { NextPageWithLayout } from "types/common"

type Props = { values: SettingsFields }

const Settings: NextPageWithLayout<Props> = (props) => {
  const { values } = props
  return (
    <EditForm
      values={values as NullableSettingsFields}
      schema={settingsSchema}
      apiEndpointPath={`/api/settings`}
      urlPath={`/settings`}
      entryComponent={SettingsEntry}
    />
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const session = await getSession(context)

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }

  const data = (await getSettings(session.user)) ?? []

  const values = settingsSchema.parse(data)

  return {
    props: {
      title: "Settings",
      values,
    },
  }
}

export default Settings

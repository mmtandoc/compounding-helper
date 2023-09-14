import EditForm from "components/common/data-pages/EditForm"
import SettingsEntry from "components/settings/SettingsEntry"
import { withPageAuth } from "lib/auth"
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

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (_, session) => {
    const data = (await getSettings(session)) ?? []

    const values = settingsSchema.parse(data)

    return {
      props: {
        title: "Settings",
        values,
      },
    }
  },
  requireAuth: true,
})

export default Settings

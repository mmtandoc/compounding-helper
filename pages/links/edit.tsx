import EditForm from "components/common/data-pages/EditForm"
import LinkDirectoryEntry from "components/links/LinkDirectoryEntry"
import { withPageAuth } from "lib/auth"
import {
  LinkDirectoryFields,
  NullableLinkDirectoryFields,
  linkDirectorySchema,
} from "lib/fields"
import { getLinks } from "pages/api/links"
import { NextPageWithLayout } from "types/common"

type Props = { values: LinkDirectoryFields }

const EditLinks: NextPageWithLayout<Props> = (props) => {
  const { values } = props
  return (
    <EditForm
      values={values as NullableLinkDirectoryFields}
      schema={linkDirectorySchema}
      apiEndpointPath={`/api/links`}
      urlPath={`/links`}
      entryComponent={LinkDirectoryEntry}
      entryComponentProps={{ showPastSdsRevisions: true, display: "all" }}
    />
  )
}

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (_, session) => {
    const data = (await getLinks(session)) ?? []

    const values = linkDirectorySchema.parse({ links: data })

    return {
      props: {
        title: "Edit Link Directory",
        values,
      },
    }
  },
  requireAuth: true,
})

export default EditLinks

import type { GetServerSideProps } from "next"

import EditForm from "components/common/data-pages/EditForm"
import LinkDirectoryEntry from "components/links/LinkDirectoryEntry"
import {
  LinkDirectoryFields,
  NullPartialLinkDirectoryFields,
  linkDirectorySchema,
} from "lib/fields"
import { getLinks } from "pages/api/links"
import { NextPageWithLayout } from "types/common"

type Props = { values: LinkDirectoryFields }

const EditLinks: NextPageWithLayout<Props> = (props) => {
  const { values } = props
  return (
    <EditForm
      values={values as NullPartialLinkDirectoryFields}
      schema={linkDirectorySchema}
      apiEndpointPath={`/api/links`}
      urlPath={`/links`}
      entryComponent={LinkDirectoryEntry}
      entryComponentProps={{ showPastSdsRevisions: true, display: "all" }}
    />
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const data = (await getLinks()) ?? []

  const values = linkDirectorySchema.parse({ links: data })

  return {
    props: {
      title: "Edit Link Directory",
      values,
    },
  }
}

export default EditLinks

import { Link as LinkModel } from "@prisma/client"
import Link from "next/link"
import { BiEdit } from "react-icons/bi"
import useSWR from "swr"

import { IconButton } from "components/ui"
import { withPageAuth } from "lib/auth"
import { getLinks } from "pages/api/links"
import { NextPageWithLayout } from "types/common"

type Props = {
  data: LinkModel[]
}

const Links: NextPageWithLayout<Props> = (props) => {
  const { data: links, error } = useSWR<LinkModel[]>("/api/links")
  if (error) {
    console.error(error)
  }

  return (
    <>
      <ul>
        {(links ?? props.data).map((link) => (
          <li key={link.id}>
            {link.description ? (
              <details>
                <summary>
                  <a href={link.url} target="_blank" rel="noreferrer">
                    {link.name}
                  </a>
                </summary>
                <p>{link.description}</p>
              </details>
            ) : (
              <a href={link.url} target="_blank" rel="noreferrer">
                {link.name}
              </a>
            )}
          </li>
        ))}
      </ul>
      <div className="actions">
        <Link href="/links/edit">
          <IconButton icon={BiEdit} size="small">
            Edit
          </IconButton>
        </Link>
      </div>
      <style jsx>{`
        .actions {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          column-gap: 1rem;
        }

        li {
          details {
            appearance: none;
          }

          summary {
            width: fit-content;
            list-style: none;
          }

          a {
            font-weight: bold;
            font-size: var(--font-size-lg);
          }
        }
      `}</style>
    </>
  )
}

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (_, session) => {
    const data = (await getLinks(session)) ?? []

    return { props: { title: "Links", data } }
  },
  requireAuth: true,
})

export default Links

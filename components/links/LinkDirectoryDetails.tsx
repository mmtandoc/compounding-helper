import { Link as LinkModel } from "@prisma/client"
import Link from "next/link"
import { BiEdit } from "react-icons/bi"

import { IconButton } from "components/ui"
import { Fieldset } from "components/ui/forms"
import { Can } from "lib/contexts/AbilityContext"

export type LinkDirectory = {
  centralLinks: LinkModel[]
  localLinks: LinkModel[]
}

type Props = {
  linkDirectory: LinkDirectory
}

export const LinkDirectoryDetails = ({ linkDirectory }: Props) => {
  return (
    <div className="link-directory">
      {linkDirectory.centralLinks.length + linkDirectory.localLinks.length ===
        0 && <p>No links exist. To add some, click the Edit button.</p>}
      {linkDirectory.centralLinks.length > 0 && (
        <Fieldset legend="Central">
          <ul>
            {linkDirectory.centralLinks.map((link) => (
              <LinkDetails key={link.id} link={link}></LinkDetails>
            ))}
          </ul>
        </Fieldset>
      )}
      {linkDirectory.localLinks.length > 0 && (
        <Fieldset legend="Local">
          <ul>
            {linkDirectory.localLinks.map((link) => (
              <LinkDetails key={link.id} link={link}></LinkDetails>
            ))}
          </ul>
        </Fieldset>
      )}
      <div className="actions">
        <Can do="update" on="Link">
          <Link href="/links/edit">
            <IconButton icon={BiEdit} size="small">
              Edit
            </IconButton>
          </Link>
        </Can>
      </div>
      <style jsx global>{`
        .link-directory .actions {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          column-gap: 1rem;
        }

        .link-directory li {
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
    </div>
  )
}

const LinkDetails = (props: { link: LinkModel }) => (
  <li>
    {props.link.description ? (
      <details>
        <summary>
          <a href={props.link.url} target="_blank" rel="noreferrer">
            {props.link.name}
          </a>
        </summary>
        <p>{props.link.description}</p>
      </details>
    ) : (
      <a href={props.link.url} target="_blank" rel="noreferrer">
        {props.link.name}
      </a>
    )}
  </li>
)

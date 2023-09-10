import _ from "lodash"
import Link from "next/link"
import { ComponentPropsWithRef } from "react"

type Props = ComponentPropsWithRef<typeof Link> & { disabled?: boolean }

const DisableableLink = ({ disabled, children, ...linkProps }: Props) => {
  if (!disabled) {
    return <Link {...linkProps}>{children}</Link>
  }

  const anchorProps = _.omit(linkProps, [
    "href",
    "as",
    "replace",
    "scroll",
    "shallow",
    "passHref",
    "prefetch",
    "locale",
    "legacyBehavior",
  ])

  if (typeof children === "string" || typeof children === "number") {
    return (
      <a
        {...anchorProps}
        className={`disabled ${anchorProps.className ?? ""}`}
        aria-disabled
      >
        {children}
        <style jsx>{`
          a.disabled {
            pointer-events: none;
          }
        `}</style>
      </a>
    )
  }
  return <>{children}</>
}

export default DisableableLink

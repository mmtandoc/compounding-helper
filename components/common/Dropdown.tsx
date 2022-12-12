import { UrlObject } from "url"

import Link from "next/link"
import React, { CSSProperties, ReactNode } from "react"
import { BiChevronDown } from "react-icons/bi"

//TODO: Update CSS to use custom properties

type DropdownProps = {
  className?: string
  children: React.ReactNode
  style?: CSSProperties
}

const Dropdown = (props: DropdownProps) => {
  const { className, children, style } = props
  return (
    <div className={`dropdown ${className ?? ""}`} style={style}>
      {children}
      <style jsx>{`
        .dropdown {
          position: relative;
          display: inline-block;
        }

        .dropdown:hover :global(.dropdown-menu) {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  )
}

type DropdownMenuProps = {
  children: ReactNode
  style?: CSSProperties
}
export const DropdownMenu = (props: DropdownMenuProps) => {
  const { children, style } = props
  style
  return (
    <div style={style} className="dropdown-menu">
      {children}
      <style jsx>{`
        .dropdown-menu {
          display: none;
          position: absolute;
          background-color: var(--color-dropdown-link-bg);
          min-width: min-content;
          width: max-content;
          box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
          z-index: 1;

          > :global(*) {
            padding: 0.6rem 1rem;
            border: var(--dropdown-border);

            &:hover {
              background-color: var(--color-dropdown-link-hover-bg);
            }
          }

          :global(* + *) {
            border-top: none;
          }

          :global(a) {
            padding: 0.6rem 1rem;
            text-decoration: none;
            display: block;
          }
        }
      `}</style>
    </div>
  )
}

type DropdownToggleProps = {
  children: ReactNode
  style?: CSSProperties
}

export const DropdownToggle = (props: DropdownToggleProps) => {
  const { children, style } = props
  style
  return (
    <div style={style} className="dropdown-toggle">
      {children}
      <BiChevronDown size="20px" />
      <style jsx>{`
        .dropdown-toggle {
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  )
}

type DropdownItemProps = {
  text: string
  href?: string | UrlObject
  style?: CSSProperties
}

export const DropdownItem = (props: DropdownItemProps) => {
  const { href, text, style } = props
  return (
    <div style={style} className="dropdown-item">
      {href ? <Link href={href}>{text}</Link> : <a>{text}</a>}
    </div>
  )
}

export default Dropdown

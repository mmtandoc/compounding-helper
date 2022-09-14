import Link from "next/link"
import React, { CSSProperties, ReactNode, useState } from "react"
import { UrlObject } from "url"

type DropdownProps = {
  children: React.ReactNode
  style?: CSSProperties
}

const Dropdown = (props: DropdownProps) => {
  const { children, style } = props
  return (
    <div className="dropdown" style={style}>
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
          background-color: #f1f1f1;
          min-width: min-content;
          width: max-content;
          box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
          z-index: 1;
        }

        :global(.dropdown-menu > *) {
          padding: 0.6rem 1rem;
        }

        :global(.dropdown-menu > *:hover) {
          background-color: #c9c9c9;
        }

        .dropdown-menu :global(a) {
          color: black;
          padding: 0.6rem 1rem;
          text-decoration: none;
          display: block;
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
      <style jsx>{`
        .dropdown-toggle :global(a) {
          color: black;
          text-decoration: none;
          display: block;
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
      {href ? (
        <Link href={href}>
          <a>{text}</a>
        </Link>
      ) : (
        <a>{text}</a>
      )}
      <style jsx>{`
        .dropdown-item {
          padding: 0.6rem 1rem;
        }
        .dropdown-item:hover {
          background-color: grey;
        }
        a {
          color: black;
          text-decoration: none;
          display: block;
        }
      `}</style>
    </div>
  )
}

export default Dropdown

/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

import Dropdown, {
  DropdownMenu,
  DropdownToggle,
} from "components/common/Dropdown"
import Logo from "public/logo.svg"

const Header = () => {
  const router = useRouter()
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname

  const left = (
    <div className="left">
      <Link href="/" data-active={isActive("/")}>
        Home
      </Link>
      <Dropdown>
        <DropdownToggle>
          <Link
            href="/risk-assessments"
            data-active={isActive("/risk-assessments")}
          >
            Risk Assessments
          </Link>
        </DropdownToggle>
        <DropdownMenu>
          <Link
            href="/risk-assessments"
            data-active={isActive("/risk-assessments")}
          >
            View Risk Assessments
          </Link>
          <Link
            href="/risk-assessments/new"
            data-active={isActive("/risk-assessments/new")}
          >
            Create New Risk Assessment
          </Link>
        </DropdownMenu>
      </Dropdown>
      <Link href="/compounds" data-active={isActive("/compounds")}>
        Compounds
      </Link>
      <Dropdown>
        <DropdownToggle>
          <Link href="/sds" data-active={isActive("/sds")}>
            Safety Data Sheets
          </Link>
        </DropdownToggle>
        <DropdownMenu>
          <Link href="/sds" data-active={isActive("/sds")}>
            View Safety Data Sheets
          </Link>
          <Link href="/sds/new" data-active={isActive("/sds/new")}>
            Create New Safety Data Sheet
          </Link>
        </DropdownMenu>
      </Dropdown>
      <Dropdown>
        <DropdownToggle>
          <Link href="/chemicals" data-active={isActive("/chemicals")}>
            Chemicals
          </Link>
        </DropdownToggle>
        <DropdownMenu>
          <Link href="/chemicals" data-active={isActive("/chemicals")}>
            View chemicals
          </Link>
          <Link href="/chemicals/new" data-active={isActive("/chemicals/new")}>
            Add new chemical
          </Link>
        </DropdownMenu>
      </Dropdown>
      <Dropdown>
        <DropdownToggle>
          <Link href="/products" data-active={isActive("/products")}>
            Products
          </Link>
        </DropdownToggle>
        <DropdownMenu>
          <Link href="/products" data-active={isActive("/products")}>
            View products
          </Link>
          <Link href="/products/new" data-active={isActive("/products/new")}>
            Add new product
          </Link>
        </DropdownMenu>
      </Dropdown>
      <Dropdown>
        <DropdownToggle>
          <a>Misc.</a>
        </DropdownToggle>
        <DropdownMenu>
          <Link href="/hazards" data-active={isActive("/hazards")}>
            Health hazards table
          </Link>
          <Link href="/links" data-active={isActive("/links")}>
            Link Directory
          </Link>
        </DropdownMenu>
      </Dropdown>
      <style jsx>{`
        .left {
          display: flex;
          flex-direction: row;
          padding: 2rem 1rem;
          column-gap: 1.5rem;
        }

        .left :global(a) {
          text-decoration: none;
          display: inline-block;
          font-weight: bold;
          color: var(--color-nav-fg);
          &:hover {
            color: var(--color-nav-link-hover-fg);
          }
          &[data-active="true"] {
            color: var(--color-nav-link-current-fg);
          }
        }
      `}</style>
    </div>
  )

  const environment = process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development"

  const right = (
    <div className="right">
      {environment !== "production" && (
        <span className="env">{environment.toUpperCase()}</span>
      )}
      <style jsx>{`
        .right {
          display: flex;
          justify-content: end;
          padding: 2rem 1rem;
          column-gap: 1.5rem;
          flex-grow: 1;
          margin-right: 2rem;
        }

        .env {
          color: var(--color-fg-muted);
          font-weight: 700;
        }
      `}</style>
    </div>
  )

  return (
    <nav>
      <Link className="logo-link" href="/">
        <Logo />
      </Link>
      {left}
      {right}
      <style jsx>{`
        nav {
          display: flex;
          align-items: center;
          flex-grow: 0;
          flex-shrink: 0;
          background-color: var(--color-nav-bg);
          border-bottom: var(--nav-border);
        }

        :global(.logo-link) {
          max-width: 100%;
          margin-block: 0.5rem;
          margin-inline: 2rem;
          > :global(svg) {
            height: auto;
            width: 45px;
            display: block;
          }
        }
      `}</style>
    </nav>
  )
}

export default Header

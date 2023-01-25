/* eslint-disable jsx-a11y/anchor-is-valid */

import Link from "next/link"
import { useRouter } from "next/router"

import { Dropdown, DropdownMenu, DropdownToggle } from "components/ui"
import Logo from "public/logo.svg"

type NavItem = { label: string; url?: string; children?: NavItem[] }

type NavMenuProps = {
  items: NavItem[]
}

const NavMenu = (props: NavMenuProps) => {
  const { items } = props

  const router = useRouter()
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname

  //TODO: Handle submenus in dropdown
  const NavLink = ({ item }: { item: NavItem }) =>
    item.url ? (
      <Link href={item.url} data-active={isActive(item.url)}>
        {item.label}
      </Link>
    ) : (
      <a>{item.label}</a>
    )

  return (
    <>
      {items.map((item, i) => {
        const { children } = item
        const rootLink = <NavLink item={item} />

        if (!children || !children.length) {
          return rootLink
        }

        return (
          <Dropdown key={i}>
            <DropdownToggle>{rootLink}</DropdownToggle>
            <DropdownMenu>
              {children.map((menuItem, i2) => (
                <NavLink item={menuItem} key={i2} />
              ))}
            </DropdownMenu>
          </Dropdown>
        )
      })}
    </>
  )
}

const Header = () => {
  const left = (
    <div className="left">
      <NavMenu
        items={[
          { label: "Home", url: "/" },
          {
            label: "Risk assessments",
            url: "/risk-assessments",
            children: [
              { label: "View risk assessments", url: "/risk-assessments" },
              {
                label: "Create new risk assessment",
                url: "/risk-assessments/new",
              },
            ],
          },
          { label: "Compounds", url: "/compounds" },
          {
            label: "Safety Data Sheets",
            url: "/sds",
            children: [
              { label: "View Safety Data Sheets", url: "/sds" },
              { label: "Create new Safety Data Sheet", url: "/sds/new" },
            ],
          },
          {
            label: "Products",
            url: "/products",
            children: [
              { label: "View products", url: "/products" },
              { label: "Create new product", url: "/products/new" },
            ],
          },
          {
            label: "Chemicals",
            url: "/chemicals",
            children: [
              { label: "View chemicals", url: "/chemicals" },
              { label: "Create chemical", url: "/chemicals/new" },
            ],
          },
          {
            label: "Misc.",
            children: [
              { label: "Health hazards table", url: "/hazards" },
              { label: "Link directory", url: "/links" },
              { label: "Settings", url: "/settings" },
            ],
          },
        ]}
      />
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
        }

        .left :global(a[data-active="true"]) {
          color: var(--color-nav-link-current-fg);
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

/* eslint-disable jsx-a11y/anchor-is-valid */

import Link from "next/link"
import { NextRouter, useRouter } from "next/router"
import { useMemo } from "react"

import {
  Banner,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
} from "components/ui"
import { useSupabaseClient } from "lib/auth/AuthProvider"
import { useAbility } from "lib/contexts/AbilityContext"
import { useCurrentUser } from "lib/hooks/useCurrentUser"
import { isCentralPharmacy } from "lib/utils"
import Logo from "public/logo.svg"

type NavItem = {
  label: string
  url?: string
  children?: NavItem[]
  hidden?: boolean
}

type NavMenuProps = {
  items: NavItem[]
}

const isActive: (router: NextRouter, currentPathname: string) => boolean = (
  router,
  currentPathname,
) => router.pathname === currentPathname

//TODO: Handle submenus in dropdown
const NavLink = ({ item }: { item: NavItem }) => {
  const router = useRouter()

  if (item.hidden) return null

  return item.url ? (
    <Link href={item.url} data-active={isActive(router, item.url)}>
      {item.label}
    </Link>
  ) : (
    <a>{item.label}</a>
  )
}

const NavMenu = (props: NavMenuProps) => {
  const { items } = props

  return (
    <>
      {items.map((item, i) => {
        const { children, hidden = false } = item

        if (!children || !children.length) {
          return <NavLink item={item} key={i} />
        }

        if (hidden) {
          return null
        }

        return (
          <Dropdown key={i}>
            <DropdownToggle>
              <NavLink item={item} />
            </DropdownToggle>
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
  const { user } = useCurrentUser()

  const ability = useAbility()

  const left = useMemo(
    () => (
      <div className="left">
        {user ? (
          <NavMenu
            items={[
              { label: "Home", url: "/" },
              {
                label: "Compounds",
                url: "/compounds",
                children: [
                  { label: "View compounds", url: "/compounds" },
                  {
                    label: "Create new compound",
                    url: "/risk-assessments/new",
                    hidden: ability.cannot("create", "Compound"),
                  },
                ],
              },
              {
                label: "Risk assessments",
                url: "/risk-assessments",
                children: [
                  { label: "View risk assessments", url: "/risk-assessments" },
                  {
                    label: "Create new risk assessment",
                    url: "/risk-assessments/new",
                    hidden: ability.cannot("create", "RiskAssessment"),
                  },
                ],
              },
              {
                label: "SDS summaries",
                url: "/sds",
                children: [
                  { label: "View SDS summaries", url: "/sds" },
                  {
                    label: "Create new SDS summary",
                    url: "/sds/new",
                    hidden: ability.cannot("create", "SDS"),
                  },
                ],
              },
              {
                label: "Products",
                url: "/products",
                children: [
                  { label: "View products", url: "/products" },
                  {
                    label: "Create new product",
                    url: "/products/new",
                    hidden: ability.cannot("create", "Product"),
                  },
                ],
              },
              {
                label: "Chemicals",
                url: "/chemicals",
                children: [
                  { label: "View chemicals", url: "/chemicals" },
                  {
                    label: "Create chemical",
                    url: "/chemicals/new",
                    hidden: ability.cannot("create", "Chemical"),
                  },
                ],
              },
              {
                label: "Misc.",
                children: [
                  { label: "Health hazards table", url: "/hazards" },
                  { label: "Link directory", url: "/links" },
                  { label: "Routines", url: "/routines" },
                  {
                    label: "Settings",
                    url: "/settings",
                    hidden: ability.cannot("update", "Settings"),
                  },
                ],
              },
            ]}
          />
        ) : (
          <NavMenu
            items={[
              { label: "Home", url: "/" },
              /* { label: "About", url: "/about" }, */
            ]}
          />
        )}
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
    ),
    [ability, ability.rules, user],
  )

  const environment = process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development"

  const AuthActions = () => {
    const supabaseClient = useSupabaseClient()
    const router = useRouter()
    //const user = useUser()

    if (user) {
      return (
        <Dropdown>
          <DropdownToggle>
            <Link href="/profile">
              <Button variant="text">{user.email}</Button>
            </Link>
          </DropdownToggle>
          <DropdownMenu
            style={{ width: "100%", fontWeight: "bold", textAlign: "center" }}
          >
            <NavLink item={{ label: "Pharmacy", url: "/pharmacy" }} />
            <Button
              variant="text"
              onClick={async () => {
                await supabaseClient.auth.signOut()
              }}
              style={{ fontWeight: "bold" }}
            >
              Sign out
            </Button>
          </DropdownMenu>
        </Dropdown>
      )
    }
    return (
      <>
        <Link href="/login">Sign in</Link>
      </>
    )
  }

  const right = (
    <div className="right">
      <AuthActions />
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

        .right :global(a) {
          text-decoration: none;
          display: inline-block;
          font-weight: bold;
          color: var(--color-nav-fg);
          &:hover {
            color: var(--color-nav-link-hover-fg);
          }
        }

        .right :global(a[data-active="true"]) {
          color: var(--color-nav-link-current-fg);
        }

        .env {
          color: var(--color-fg-muted);
          font-weight: 700;
        }
      `}</style>
    </div>
  )

  return (
    <div className="header">
      <nav>
        <Link className="logo-link" href="/">
          <Logo />
        </Link>
        {left}
        {right}
      </nav>
      {user && isCentralPharmacy(user.pharmacyId) && (
        <Banner theme="attention">Currently managing central database.</Banner>
      )}
      <style jsx>{`
        .header {
          display: flex;
          align-items: stretch;
          flex-direction: column;
        }
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
    </div>
  )
}

export default Header

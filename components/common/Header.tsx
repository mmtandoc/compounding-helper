/* eslint-disable jsx-a11y/anchor-is-valid */

import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import Link from "next/link"
import { useRouter } from "next/router"

import {
  Banner,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
} from "components/ui"
import { useCurrentUser } from "lib/hooks/useCurrentUser"
import { isCentralPharmacy } from "lib/utils"
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

        if (!children || !children.length) {
          return <NavLink item={item} key={i} />
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

  const left = (
    <div className="left">
      {user ? (
        <NavMenu
          items={[
            /* { label: "Home", url: "/" }, */
            {
              label: "Compounds",
              url: "/compounds",
              children: [
                { label: "View compounds", url: "/compounds" },
                {
                  label: "Create new compound",
                  url: "/risk-assessments/new",
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
                },
              ],
            },
            {
              label: "SDS summaries",
              url: "/sds",
              children: [
                { label: "View SDS summaries", url: "/sds" },
                { label: "Create new SDS summary", url: "/sds/new" },
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
                { label: "Routines", url: "/routines" },
                { label: "Settings", url: "/settings" },
              ],
            },
          ]}
        />
      ) : (
        <NavMenu
          items={
            [
              /* { label: "Home", url: "/" }, */
              /* { label: "About", url: "/about" }, */
            ]
          }
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
  )

  const environment = process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development"

  const AuthActions = () => {
    const supabaseClient = useSupabaseClient()
    const router = useRouter()
    //const user = useUser()

    if (user) {
      return (
        <>
          <Link href="/profile">
            <Button variant="text">{user.email}</Button>
          </Link>
          <Button
            variant="text"
            onClick={async () => {
              await supabaseClient.auth.signOut()
              //.then(() => router.push("/login"))
              router.push("/login")
            }}
          >
            Sign out
          </Button>
        </>
      )
    }
    return (
      <>
        <Link href="/login" prefetch={false}>
          Sign in
        </Link>
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
        <Link className="logo-link" href="/" prefetch={false}>
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

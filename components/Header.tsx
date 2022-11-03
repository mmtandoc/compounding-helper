/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

import Dropdown, {
  DropdownMenu,
  DropdownToggle,
} from "components/common/Dropdown"

const Header = () => {
  const router = useRouter()
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname

  const left = (
    <div className="left">
      <Link href="/" className="bold" data-active={isActive("/")}>
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
          <span className="bold">Misc.</span>
        </DropdownToggle>
        <DropdownMenu>
          <Link href="/hazards" data-active={isActive("/hazards")}>
            Health hazards table
          </Link>
        </DropdownMenu>
      </Dropdown>
      <style jsx>{`
        .bold {
          font-weight: bold;
        }

        .left {
          display: flex;
          flex-direction: row;
          column-gap: 1.5rem;
        }

        .left :global(a) {
          text-decoration: none;
          color: #000;
          display: inline-block;
          font-weight: bold;
        }

        .left :global(a[data-active="true"]) {
          color: gray;
        }
      `}</style>
    </div>
  )

  const right = <></>

  return (
    <nav>
      {left}
      {right}
      <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
          flex-grow: 0;
          flex-shrink: 0;
        }
      `}</style>
    </nav>
  )
}

export default Header

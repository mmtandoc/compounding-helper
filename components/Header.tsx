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
      <Link href="/">
        <a className="bold" data-active={isActive("/")}>
          Home
        </a>
      </Link>
      <Dropdown>
        <DropdownToggle>
          <Link href="/risk-assessments">
            <a className="bold" data-active={isActive("/risk-assessments")}>
              Risk Assessments
            </a>
          </Link>
        </DropdownToggle>
        <DropdownMenu>
          <Link href="/risk-assessments">
            <a className="bold" data-active={isActive("/risk-assessments")}>
              View Risk Assessments
            </a>
          </Link>
          <Link href="/risk-assessments/new">
            <a className="bold" data-active={isActive("/risk-assessments/new")}>
              Create New Risk Assessment
            </a>
          </Link>
        </DropdownMenu>
      </Dropdown>
      <Link href="/compounds">
        <a className="bold" data-active={isActive("/compounds")}>
          Compounds
        </a>
      </Link>
      <Dropdown>
        <DropdownToggle>
          <Link href="/sds">
            <a className="bold" data-active={isActive("/sds")}>
              Safety Data Sheets
            </a>
          </Link>
        </DropdownToggle>
        <DropdownMenu>
          <Link href="/sds">
            <a className="bold" data-active={isActive("/sds")}>
              View Safety Data Sheets
            </a>
          </Link>
          <Link href="/sds/new">
            <a className="bold" data-active={isActive("/sds/new")}>
              Create New Safety Data Sheet
            </a>
          </Link>
        </DropdownMenu>
      </Dropdown>
      <Dropdown>
        <DropdownToggle>
          <Link href="/chemicals">
            <a className="bold" data-active={isActive("/chemicals")}>
              Chemicals
            </a>
          </Link>
        </DropdownToggle>
        <DropdownMenu>
          <Link href="/chemicals">
            <a className="bold" data-active={isActive("/chemicals")}>
              View chemicals
            </a>
          </Link>
          <Link href="/chemicals/new">
            <a className="bold" data-active={isActive("/chemicals/new")}>
              Add new chemical
            </a>
          </Link>
        </DropdownMenu>
      </Dropdown>
      <Dropdown>
        <DropdownToggle>
          <Link href="/products">
            <a className="bold" data-active={isActive("/products")}>
              Products
            </a>
          </Link>
        </DropdownToggle>
        <DropdownMenu>
          <Link href="/products">
            <a className="bold" data-active={isActive("/products")}>
              View products
            </a>
          </Link>
          <Link href="/products/new">
            <a className="bold" data-active={isActive("/products/new")}>
              Add new product
            </a>
          </Link>
        </DropdownMenu>
      </Dropdown>
      <Dropdown>
        <DropdownToggle>
          <span className="bold">Misc.</span>
        </DropdownToggle>
        <DropdownMenu>
          <Link href="/hazards">
            <a className="bold" data-active={isActive("/hazards")}>
              Health hazards table
            </a>
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

        .left > a,
        .left :global(.dropdown-main > a) {
          text-decoration: none;
          color: #000;
          display: inline-block;
          font-weight: bold;
        }

        .left a[data-active="true"] {
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

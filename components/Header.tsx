/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"

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
      <Link href="/risk-assessments">
        <a className="bold" data-active={isActive("/risk-assessments")}>
          Risk Assessments
        </a>
      </Link>
      <style jsx>{`
        .bold {
          font-weight: bold;
        }

        a {
          text-decoration: none;
          color: #000;
          display: inline-block;
        }

        .left a[data-active="true"] {
          color: gray;
        }

        a + a {
          margin-left: 1rem;
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

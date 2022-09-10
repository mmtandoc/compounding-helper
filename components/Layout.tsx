import React, { ReactNode } from "react"
import Header from "components/Header"

type Props = {
  children: ReactNode
}

const Layout = (props: Props) => (
  <>
    <Header />
    <div className="layout">{props.children}</div>
    <style jsx global>{`
      .layout {
        padding: 0 2rem;
        display: flex;
        flex-grow: 1;
        flex-shrink: 1;
        align-items: stretch;
      }
      .page {
        align-self: stretch;
        max-width: 1264px;
        margin: 0 auto;
        width: 100%;
      }
    `}</style>
  </>
)

export default Layout

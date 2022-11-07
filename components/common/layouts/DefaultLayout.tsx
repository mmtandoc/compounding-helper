import Head from "next/head"
import React, { ReactNode } from "react"

import Header from "components/Header"

type Props = {
  title?: string
  pageRef?: React.Ref<HTMLDivElement>
  children: ReactNode
}

const DefaultLayout = ({ title, pageRef, children }: Props) => (
  <>
    {title && (
      <Head>
        <title>{title}</title>
      </Head>
    )}
    <Header />
    <main>
      <div className="page" ref={pageRef}>
        {title && (
          <header>
            <h1>{title}</h1>
          </header>
        )}
        {children}
      </div>
    </main>
    <style jsx global>{`
      main {
        padding: 0 2rem;
        display: flex;
        flex-grow: 1;
        flex-shrink: 1;
        align-items: stretch;
        flex-direction: column;
      }

      .page {
        align-self: stretch;
        max-width: 1264px;
        margin: 0 auto;
        width: 100%;
        padding: 0 4rem 9rem 4rem;
        flex-grow: 1;
        background-color: var(--color-canvas-default);
        border-left: var(--border-default);
        border-right: var(--border-default);
      }
    `}</style>
  </>
)

export default DefaultLayout
export const getDefaultLayout = (
  page: React.ReactElement,
  { title = undefined }: { title?: string },
) => <DefaultLayout title={title}>{page}</DefaultLayout>

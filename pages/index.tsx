import { GetStaticProps } from "next"
import Link from "next/link"
import React from "react"

import { NextPageWithLayout } from "types/common"

type HomeGridItem = {
  id: string
  header: string
  links: { label: string; url: string }[]
}

const homeLinks: HomeGridItem[] = [
  {
    id: "compounds",
    header: "Compounds & MFRs",
    links: [{ label: "View all", url: "/compounds" }],
  },
  {
    id: "risk-assessments",
    header: "Risk assessments",
    links: [
      { label: "View all", url: "/risk-assessments" },
      {
        label: "Create",
        url: "/risk-assessments/new",
      },
    ],
  },
  {
    id: "sds-summaries",
    header: "SDS summaries",
    links: [
      { label: "View all", url: "/sds" },
      { label: "Create", url: "/sds/new" },
    ],
  },
  {
    id: "products",
    header: "Products",
    links: [
      { label: "View all", url: "/products" },
      { label: "Create", url: "/products/new" },
    ],
  },
  {
    id: "chemicals",
    header: "Chemicals",
    links: [
      { label: "View all", url: "/chemicals" },
      { label: "Create", url: "/chemicals/new" },
    ],
  },
]
/* {
  header: "Misc.",
  links: [
    { label: "Health hazards table", url: "/hazards" },
    { label: "Link directory", url: "/links" },
    { label: "Settings", url: "/settings" },
  ],
}, */

const HomeCell = ({ item }: { item: HomeGridItem }) => (
  <div className={`home-cell ${item.id}`}>
    <div className="header">{item.header}</div>
    <div className="links">
      {item.links.map((link, i) => (
        <Link href={link.url} key={i}>
          {link.label}
        </Link>
      ))}
    </div>
    <style jsx>{`
      .home-cell {
        grid-area: ${item.id};
      }
    `}</style>
  </div>
)

const Home: NextPageWithLayout = () => {
  return (
    <>
      <div className="home-grid">
        {homeLinks.map((item, i) => (
          <HomeCell key={i} item={item} />
        ))}
      </div>
      <style jsx global>{`
        .home-grid {
          margin-top: 5rem;
          padding: 0.5rem;
          display: grid;
          grid-template-columns: 1fr;
          grid-template-areas:
            "compounds"
            "risk-assessments"
            "sds-summaries"
            "products"
            "chemicals";
          gap: 1rem;
          margin-inline: auto;

          > div {
            border: var(--border-default);
            display: flex;
            flex-direction: column;
            > .header {
              margin-block: 0;
              font-size: var(--font-size-lg);
              font-weight: 600;
              background: var(--color-canvas-subtle);
              border-bottom: var(--border-default);
              text-align: center;
              padding: 0.3rem 3rem;
            }

            > .links {
              display: flex;
              height: 100%;
              > * {
                flex: 1;
                font-size: var(--font-size-base);
                text-align: center;
                padding: 0.3rem 0.6rem;
              }

              > :not(:last-child) {
                border-right: var(--border-default);
              }
            }
          }
        }

        @media (min-width: 850px) {
          .home-grid {
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(3, 1fr);
            grid-template-areas:
              "compounds risk-assessments sds-summaries"
              ". . products"
              ". . chemicals";

            width: fit-content;

            > div {
              > .header {
                font-size: var(--font-size-lg);
                white-space: nowrap;
              }

              > .links > * {
                font-size: var(--font-size-base);
              }
            }
          }
        }

        @media (min-width: 1000px) {
          .home-grid > div {
            > .header {
              font-size: var(--font-size-xl);
            }

            > .links > * {
              font-size: var(--font-size-lg);
            }
          }
        }
      `}</style>
    </>
  )
}

export const getStaticProps: GetStaticProps = () => ({
  props: { title: "Compounding Helper - Home" },
})

export default Home

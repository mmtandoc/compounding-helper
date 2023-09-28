import Link from "next/link"

import { withPageAuth } from "lib/auth"
import { AppAbility } from "lib/auth/ability/appAbilities"
import { useAbility } from "lib/contexts/AbilityContext"
import { NextPageWithLayout } from "types/common"

type HomeGridItem = {
  id: string
  header?: string
  links: {
    label: string
    url: string
    hasPermission?: (ability: AppAbility) => boolean
  }[]
}

const mainGridItems: HomeGridItem[] = [
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
        label: "Create new",
        url: "/risk-assessments/new",
        hasPermission: (ability) => ability.can("create", "RiskAssessment"),
      },
    ],
  },
]

const dataGridItems: HomeGridItem[] = [
  {
    id: "sds-summaries",
    header: "SDS summaries",
    links: [
      { label: "View all", url: "/sds" },
      {
        label: "Create new",
        url: "/sds/new",
        hasPermission: (ability) => ability.can("create", "SDS"),
      },
    ],
  },
  {
    id: "products",
    header: "Products",
    links: [
      { label: "View all", url: "/products" },
      {
        label: "Create new",
        url: "/products/new",
        hasPermission: (ability) => ability.can("create", "Product"),
      },
    ],
  },
  {
    id: "chemicals",
    header: "Chemicals",
    links: [
      { label: "View all", url: "/chemicals" },
      {
        label: "Create new",
        url: "/chemicals/new",
        hasPermission: (ability) => ability.can("create", "Chemical"),
      },
    ],
  },
]

const miscGridItems: HomeGridItem[] = [
  {
    id: "misc",
    links: [
      { label: "Health hazards table", url: "/hazards" },
      { label: "Link directory", url: "/links" },
      { label: "Routines", url: "/routines" },
      {
        label: "Settings",
        url: "/settings",
        hasPermission: (ability) => ability.can("update", "Settings"),
      },
    ],
  },
]

const HomeCell = ({ item }: { item: HomeGridItem }) => {
  const ability = useAbility()

  return (
    <div className={`home-cell ${item.id}`}>
      {item.header && <div className="header">{item.header}</div>}
      <div className="links">
        {item.links.map((link, i) =>
          link.hasPermission?.(ability) ?? true ? (
            <Link href={link.url} key={i}>
              {link.label}
            </Link>
          ) : null,
        )}
      </div>
      <style jsx global>{`
        .home-cell {
          flex: 1;
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
            white-space: nowrap;
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

        @media (min-width: 850px) {
          .home-cell {
            > .header {
              font-size: var(--font-size-lg);
              white-space: nowrap;
            }

            > .links > * {
              font-size: var(--font-size-base);
              padding: 1.5rem 1rem;
            }
          }
        }

        @media (min-width: 1000px) {
          .home-cell {
            > .header {
              font-size: var(--font-size-xl);
            }

            > .links > * {
              font-size: var(--font-size-lg);
              padding: 1.5rem 1rem;
            }
          }
        }
      `}</style>
    </div>
  )
}

const HomeSection = (props: { className?: string; items: HomeGridItem[] }) => (
  <div className={`home-grid ${props.className ?? ""}`}>
    {props.items.map((item, i) => (
      <HomeCell key={i} item={item} />
    ))}
    <style jsx global>{`
      .home-grid {
        padding: 0.5rem;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1rem;
        margin-inline: auto;
      }

      @media (min-width: 500) {
        .home-grid {
          flex-direction: column;
        }
      }
    `}</style>
  </div>
)

const Home: NextPageWithLayout = () => {
  return (
    <div className="home-page">
      <details className="data-collapsible" open>
        <summary>Compounds</summary>
        <HomeSection className="main-section" items={mainGridItems} />
      </details>
      <details className="data-collapsible">
        <summary>Data Management</summary>
        <HomeSection className="data-section" items={dataGridItems} />
      </details>
      <details className="data-collapsible" open>
        <summary>Misc.</summary>
        <HomeSection className="misc-section" items={miscGridItems} />
      </details>

      <style jsx global>{`
        .data-collapsible {
          margin-top: 1rem;
          border: var(--border-default);
          padding: 0.5rem 1rem;
          > summary {
            font-weight: 600;
            font-size: var(--font-size-lg);
            cursor: pointer;
            //width: fit-content;
            user-select: none;
          }
        }

        @media (min-width: 850px) {
          .data-collapsible > summary {
            font-size: var(--font-size-xl);
          }
        }

        @media (min-width: 1000px) {
          .data-collapsible > summary {
            font-size: var(--font-size-xl);
          }
        }
      `}</style>
    </div>
  )
}

export const getServerSideProps = withPageAuth({
  getServerSideProps: async () => ({
    props: { title: "Compounding Helper - Home" },
  }),
  requireAuth: false,
})

export default Home

import { ReactNode } from "react"

type Props = {
  children: ReactNode
  theme?: "neutral" | "primary" | "danger" | "attention"
}

//TODO: Implement dismissable banners

const Banner = ({ children, theme = "primary" }: Props) => {
  return (
    <div className={`banner ${theme}`}>
      {children}
      <style jsx>{`
        .banner {
          padding: 1rem 2rem;

          background-color: var(--color-canvas-subtle);
          color: var(--color-fg-default);
          border-bottom: var(--border-default);

          &.danger {
            background-color: var(--color-danger-subtle);
            color: var(--color-danger-fg);
            border-color: var(--color-danger-muted);
          }

          &.attention {
            background-color: var(--color-attention-subtle);
            color: var(--color-attention-fg);
            border-color: var(--color-attention-muted);
          }

          &.primary {
            background-color: var(--color-accent-subtle);
            color: var(--color-accent-fg);
            border-color: var(--color-accent-muted);
          }
        }
      `}</style>
    </div>
  )
}

export default Banner

import React, { ReactNode, useState } from "react"

import { Tooltip } from "components/ui"

export const HoverTooltip = (props: {
  children: ReactNode
  tooltipContent: ReactNode
  arrowPosition?: "top-start" | "top-end"
  className?: string
  style?: React.CSSProperties
  offset?: string
}) => {
  const {
    children,
    tooltipContent,
    arrowPosition = "top-start",
    style,
    className,
    offset = "2.5rem",
  } = props
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)

  return (
    <span className={`hover-tooltip ${className ?? ""}`} style={style}>
      <span
        className="content"
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
        {children}
      </span>
      <Tooltip visible={isTooltipVisible} arrowPosition={arrowPosition}>
        {tooltipContent}
      </Tooltip>
      <style jsx global>{`
        .hover-tooltip {
          position: relative;

          .content {
            cursor: pointer;
          }

          .tooltip {
            top: ${offset};

            white-space: pre-wrap;
            background-color: var(--color-canvas-subtle);
            max-width: 40rem;
            width: max-content;
          }

          .tooltip.top-end {
            left: auto;
            right: -2.35rem;
          }

          .tooltip.top-start {
            left: -2.35rem;
          }
        }
      `}</style>
    </span>
  )
}

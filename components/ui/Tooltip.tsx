import React, { ReactNode, useMemo } from "react"

type TooltipProps = {
  children: ReactNode
  visible: boolean
  arrowPosition?: "top-start" | "top-end"
  className?: string
  style?: React.CSSProperties
}

//TODO: Support arrow changing arrow position
//TODO: Implement using Floating UI
const Tooltip = (props: TooltipProps) => {
  const {
    children,
    visible,
    arrowPosition = "top-start",
    className,
    style,
  } = props

  // To fix issue #76, "TypeError: Cannot read properties of undefined (reading 'backgroundColor')"
  const arrowColor = useMemo(
    () =>
      `transparent transparent ${
        style?.backgroundColor ?? "#dedede"
      } transparent`,
    [style?.backgroundColor],
  )

  return (
    <>
      {visible && (
        <div
          role="tooltip"
          className={`tooltip ${!!className ? className : ""} ${arrowPosition}`}
          style={style}
        >
          {children}
          <style jsx>{`
            .tooltip {
              padding: 0.8rem 2rem;
              margin-top: 1.2rem;
              border-radius: 0.2rem;
              position: absolute;
              z-index: 10;
              box-shadow: 1px 2px 1px 1px rgba(0, 0, 0, 0.316);
            }

            .tooltip.top-start:after {
              left: 2rem;
            }

            .tooltip.top-end:after {
              right: 2rem;
            }

            .tooltip:after {
              content: "";
              position: absolute;

              /* vertically center */
              bottom: 100%;

              /* the arrow */
              border: 10px solid black;

              display: block;
              z-index: 10;
            }
          `}</style>
          <style jsx>{`
            .tooltip:after {
              border-color: ${arrowColor};
            }
          `}</style>
        </div>
      )}
    </>
  )
}

export default Tooltip

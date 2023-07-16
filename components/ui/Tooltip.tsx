import React, { ReactNode, useMemo } from "react"

type TooltipProps = {
  children: ReactNode
  visible: boolean
  className?: string
  style?: React.CSSProperties
}

const Tooltip = (props: TooltipProps) => {
  const { children, visible, className, style } = props

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
          className={`tooltip ${!!className ? className : ""}`}
          style={style}
        >
          {children}{" "}
          <style jsx>{`
            .tooltip {
              padding: 0.8rem 2rem;
              margin-top: 1.2rem;
              border-radius: 0.2rem;
              position: absolute;
              z-index: 10;
              box-shadow: 1px 2px 1px 1px rgba(0, 0, 0, 0.316);
            }

            .tooltip:after {
              content: "";
              position: absolute;

              /* position tooltip correctly */
              left: 2rem;

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

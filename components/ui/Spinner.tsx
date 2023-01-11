import React from "react"

type Props = {
  size?: React.CSSProperties["width"]
  color?: React.CSSProperties["color"]
}

const Spinner = (props: Props) => {
  const { size = "1.6rem", color = "black" } = props
  return (
    <div className="spinner">
      <style jsx>{`
        @keyframes spinner {
          to {
            transform: rotate(360deg);
          }
        }
        .spinner {
          --size: ${size};

          display: inline-block;
          width: ${size};
          height: ${size};
          border-radius: 50%;
          border: calc(var(--size) * 0.1) solid #ccc;
          border-top-color: ${color};
          animation: spinner 0.6s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default Spinner

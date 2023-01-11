import React, { ReactNode } from "react"

type ModalBodyProps = {
  children: ReactNode
}

const ModalBody = (props: ModalBodyProps) => {
  const { children } = props
  return (
    <div className="modal-body">
      {children}
      <style jsx>{`
        .modal-body {
          padding-inline: 1.5rem;
        }
      `}</style>
    </div>
  )
}

export default ModalBody

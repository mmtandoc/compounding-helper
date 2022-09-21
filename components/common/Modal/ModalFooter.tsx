import React, { ReactNode } from "react"

type ModalFooterProps = {
  children: ReactNode
}

const ModalFooter = (props: ModalFooterProps) => {
  const { children } = props
  return (
    <div className="modal-footer">
      {children}
      <style jsx>{`
        .modal-footer {
          display: flex;
          column-gap: 1rem;
          justify-content: space-around;
        }
      `}</style>
    </div>
  )
}

export default ModalFooter

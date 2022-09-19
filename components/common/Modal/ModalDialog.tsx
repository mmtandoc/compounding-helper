import React, { ReactNode } from "react"

type ModalDialogProps = {
  children: ReactNode
}

const ModalDialog = (props: ModalDialogProps) => {
  const { children } = props
  return (
    <div className="modal-dialog">
      {children}
      <style jsx>{`
        .modal-dialog {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          background-color: whitesmoke;
          border: 1px black ridge;
          padding: 0.8rem;
          z-index: 3;
        }
      `}</style>
    </div>
  )
}

export default ModalDialog

import React, { ReactNode } from "react"

import ModalDialog from "./ModalDialog"

type ModalProps = {
  isOpen?: boolean
  children: ReactNode
  darkenBackground?: boolean
}

const Modal = (props: ModalProps) => {
  const { isOpen = false, children, darkenBackground = true } = props

  if (!isOpen) {
    return null
  }

  return (
    <>
      {darkenBackground && <div className="overlay" />}
      <ModalDialog>{children}</ModalDialog>
      <style jsx>{`
        .overlay {
          background-color: #8080809e;
          position: fixed;
          top: 0%;
          left: 0%;
          right: 0%;
          bottom: 0%;
          z-index: 2;
        }
      `}</style>
    </>
  )
}

export default Modal

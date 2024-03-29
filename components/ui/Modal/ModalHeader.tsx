import React, { ReactNode } from "react"
import { MdClose } from "react-icons/md"

import { IconButton } from "components/ui"

type ModalHeaderProps = {
  children: ReactNode
  closeButton?: boolean
  onClose?: () => void
}

const ModalHeader = (props: ModalHeaderProps) => {
  const { children, closeButton = true, onClose } = props
  return (
    <div className="modal-header">
      <div className="modal-title">{children}</div>
      {closeButton && (
        <IconButton
          icon={MdClose}
          className="modal-close-button"
          onClick={() => onClose?.()}
          size="small"
        />
      )}
      <style jsx>{`
        .modal-header {
          display: flex;
          border-bottom: solid darkgray 1px;
          padding-block: 0.3rem;
        }
        .modal-close-button {
          margin-right: 0;
        }
        .modal-title {
          flex-grow: 1;
          text-align: center;
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}

export default ModalHeader

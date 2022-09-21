import Modal from "./Modal"
import ModalBody from "./ModalBody"
import ModalDialog from "./ModalDialog"
import ModalFooter from "./ModalFooter"
import ModalHeader from "./ModalHeader"

/* export { default } from "./Modal"
export { default as ModalBody } from "./ModalBody"
export { default as ModalHeader } from "./ModalHeader"
export { default as ModalFooter } from "./ModalFooter" */
export default Object.assign(Modal, {
  Body: ModalBody,
  Header: ModalHeader,
  Footer: ModalFooter,
  Dialog: ModalDialog,
})

import { createPortal } from "react-dom";

const ModalPortal = ({ children }) => {
  return createPortal(
    children,
    document.getElementById("modal-root")
  );
};

export default ModalPortal;

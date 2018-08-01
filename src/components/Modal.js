import React from "react";
import PropTypes from "prop-types";

const Modal = ({ open, children, onClose }) =>
  open && (
    <div>
      <div onClick={onClose}>close</div>
      {children}
    </div>
  );

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default Modal;

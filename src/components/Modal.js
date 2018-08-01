import React, { Component } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import { StrongText } from "./typeComponents";

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  padding: 15px 20px;
  background-color: #fff;
  border-radius: 2px;
  z-index: 1000;
`;

const CloseButton = styled.div`
  position: absolute;
  font-size: 24px;
  line-height: 12px;
  color: #fff;
  top: 0;
  right: 0;
  padding: 15px;
  cursor: pointer;
`;

class Modal extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string
  };

  constructor() {
    super();
    this.el = document.createElement("div");
  }

  componentDidMount() {
    document.body.appendChild(this.el);
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
  }

  render() {
    const { onClose, open, children, title } = this.props;

    return createPortal(
      open && (
        <Container>
          <Overlay onClick={onClose}>
            <CloseButton>&times;</CloseButton>
          </Overlay>
          <ModalContent>
            {title && (
              <StrongText style={{ marginBottom: 10 }}>{title}</StrongText>
            )}
            {children}
          </ModalContent>
        </Container>
      ),
      this.el
    );
  }
}

export default Modal;

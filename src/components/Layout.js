import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid #bbb;
  white-space: pre;
`;

const Content = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

class Layout extends Component {
  static Header = Header;
  static Content = Content;
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    return <Container>{this.props.children}</Container>;
  }
}

export default Layout;

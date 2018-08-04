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
  padding-left: ${props => (props.flushLeft ? 0 : 20)}px;
  padding-right: ${props => (props.flushRight ? 0 : 20)}px;
  background-color: #fff;
  // border-bottom: 1px solid #bbb;
  white-space: pre;
`;
Header.propTypes = { flushLeft: PropTypes.bool, flushRight: PropTypes.bool };
Header.defaultProps = { flushLeft: false, flushRight: false };

const Body = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

class Layout extends Component {
  static Header = Header;
  static Body = Body;
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    return <Container>{this.props.children}</Container>;
  }
}

export default Layout;

import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import AnimateHeight from "react-animate-height-auto";
import { StrongText } from "./typeComponents";
import Icon from "./Icon";

const Container = styled.div`
  margin: 3px;
  padding: ${props => (props.noPadding ? "0" : "15px 20px")};
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 2px;
`;

class Section extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    noPadding: PropTypes.bool,
    title: PropTypes.string
  };

  state = { isExpanded: true };

  handleClickTitle = () => {
    this.setState(state => ({ ...state, isExpanded: !state.isExpanded }));
  };

  render() {
    const { children, noPadding, title } = this.props;
    const { isExpanded } = this.state;

    return (
      <Container noPadding={noPadding}>
        {title && (
          <StrongText
            onClick={this.handleClickTitle}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              userSelect: "none"
            }}
          >
            {title}
            <div
              style={{
                fontWeight: 400,
                color: "#888",
                fontSize: 10
              }}
            >
              <Icon
                icon="chevron-right"
                transform={{ rotate: isExpanded ? 90 : 0 }}
              />
            </div>
          </StrongText>
        )}
        <AnimateHeight isExpanded={isExpanded}>
          <div style={{ marginTop: title ? 5 : null }}>{children}</div>
        </AnimateHeight>
      </Container>
    );
  }
}

export const Subsection = styled.div`
  & + & {
    margin-top: 15px;
  }
`;

export default Section;

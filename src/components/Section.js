import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import AnimateHeight from "react-animate-height-auto";
import { StrongText } from "./typeComponents";
import Icon from "./Icon";

const Container = styled.div`
  margin: ${props => (props.top ? "0" : "3px")};
  padding: ${props =>
    props.noPadding ? "0" : props.top ? "15px 23px" : "15px 20px"};
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-width: ${props => (props.top ? "0 0 1px" : "1px")};
  border-radius: 2px;
`;

export const TopSection = styled(Container)`
  margin: 0;
  border-width: 0 0 1px;
`;

class Section extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    hasSettings: PropTypes.bool,
    noPadding: PropTypes.bool,
    style: PropTypes.object,
    title: PropTypes.string,
    onClickSettings: PropTypes.func,
    top: PropTypes.bool
  };

  state = { isExpanded: true };

  handleClickTitle = () => {
    this.setState(state => ({ ...state, isExpanded: !state.isExpanded }));
  };

  render() {
    const {
      children,
      hasSettings,
      noPadding,
      style,
      title,
      top,
      onClickSettings
    } = this.props;
    const { isExpanded } = this.state;

    return (
      <Container noPadding={noPadding} top={top} style={style}>
        {title && (
          <div style={{ padding: noPadding && "15px 20px" }}>
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
                fontSize: 10,
                display: "flex",
                alignItems: "center"
              }}
            >
              {hasSettings &&
                isExpanded && (
                  <div
                    style={{ padding: "0 12px" }}
                    onClick={evt => {
                      evt.stopPropagation();
                      onClickSettings();
                    }}
                  >
                    <Icon icon="cog" />
                  </div>
                )}
              <Icon
                icon="chevron-right"
                transform={{ rotate: isExpanded ? 90 : 0 }}
              />
            </div>
          </StrongText>
          </div>
        )}
        <AnimateHeight isExpanded={isExpanded}>
          <div
            style={{ marginTop: title && !noPadding ? 10 : null }}
            className={isExpanded ? "" : "collapsed"}
          >
            {children}
          </div>
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

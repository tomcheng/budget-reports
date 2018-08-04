import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import AnimateHeight from "react-animate-height-auto";
import { StrongText } from "./typeComponents";
import Icon from "./Icon";

const Container = styled.div`
  margin: 2px;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 2px;
`;

const Header = styled(StrongText)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  user-select: none;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  font-weight: 400;
  color: #888;
  font-size: 10px;
`;

const Body = styled.div`
  padding: 0 20px 15px;
`;

class CollapsibleSection extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    hasSettings: PropTypes.bool,
    noPadding: PropTypes.bool,
    onClickSettings: PropTypes.func
  };

  state = { expanded: true };

  handleClickTitle = () => {
    this.setState(state => ({ ...state, expanded: !state.expanded }));
  };

  render() {
    const {
      children,
      hasSettings,
      noPadding,
      title,
      onClickSettings
    } = this.props;

    const { expanded } = this.state;

    return (
      <Container>
        <Header onClick={this.handleClickTitle}>
          {title}
          <Actions>
            {hasSettings &&
              expanded && (
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
              transform={{ rotate: expanded ? 90 : 0 }}
            />
          </Actions>
        </Header>
        <AnimateHeight isExpanded={expanded}>
          <Body style={{ padding: noPadding && 0 }}>{children}</Body>
        </AnimateHeight>
      </Container>
    );
  }
}

export default CollapsibleSection;

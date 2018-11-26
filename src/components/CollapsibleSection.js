import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import AnimateHeight from "react-animate-height-auto";
import { StrongText } from "./typeComponents";
import Icon from "./Icon";

const Container = styled.div`
  margin: ${props => (props.fullWidth ? "0" : "2px")};
  background-color: #fff;
  border: ${props => (props.fullWidth ? "0" : "1px")} solid #e5e5e5;
  border-bottom-width: 1px;
  border-radius: 2px;
`;

const Header = styled(StrongText)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  user-select: none;
`;

const SettingsContainer = styled.div`
  padding: 0 10px;
  margin-right: -10px;
  align-self: stretch;
  display: flex;
  align-items: center;
  margin-left: 5px;
`;

const Body = styled.div`
  padding: 0 ${props => (props.fullWidth ? "22px" : "20px")} 15px;
`;

const CollapsibleSection = ({
  actions,
  children,
  fullWidth,
  hasSettings,
  noPadding,
  title,
  onClickSettings
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <Container fullWidth={fullWidth}>
      <Header>
        <div
          style={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          {title}
          <Icon
            icon="chevron-right"
            transform={{ rotate: expanded ? 90 : 0 }}
            style={{ marginLeft: 10 }}
            faded
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {expanded && actions}
          {hasSettings &&
            expanded && (
              <SettingsContainer onClick={onClickSettings}>
                <Icon icon="cog" faded />
              </SettingsContainer>
            )}
        </div>
      </Header>
      <AnimateHeight isExpanded={expanded}>
        <Body style={{ padding: noPadding && 0 }}>{children}</Body>
      </AnimateHeight>
    </Container>
  );
};

CollapsibleSection.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  actions: PropTypes.node,
  fullWidth: PropTypes.bool,
  hasSettings: PropTypes.bool,
  noPadding: PropTypes.bool,
  onClickSettings: PropTypes.func
};

export default CollapsibleSection;

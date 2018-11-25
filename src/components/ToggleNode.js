import React from "react";
import { SecondaryText } from "./typeComponents";
import Icon from "./Icon";
import Amount from "./Amount";
import styled from "styled-components";
import ListItem from "./ListItem";

const INDENTATION = 18;

const NodeWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => (props.isCompact ? "0" : "8px 0")};
  user-select: none;

  ${ListItem}:first-child > & {
    padding-top: 0;
  }
`;

const IconWrapper = styled.div`
  box-sizing: border-box;
  padding-left: 3px;
  width: ${INDENTATION}px;
  font-weight: 400;
  color: #888;
  font-size: 10px;
`;

const ToggleNode = ({
  expanded,
  name,
  id,
  amount,
  valueRenderer,
  onToggle,
  isCompact
}) => (
  <NodeWrapper onClick={onToggle} isCompact={isCompact}>
    <SecondaryText
      style={{ whiteSpace: "pre", display: "flex", alignItems: "center" }}
    >
      <IconWrapper>
        <Icon icon="chevron-right" transform={{ rotate: expanded ? 90 : 0 }} />
      </IconWrapper>
      {typeof name === "function" ? name({ expanded }) : name}
    </SecondaryText>
    {valueRenderer ? (
      valueRenderer({ amount, id, faded: expanded })
    ) : (
      <SecondaryText style={{ opacity: expanded ? 0.3 : 1 }}>
        <Amount amount={amount} />
      </SecondaryText>
    )}
  </NodeWrapper>
);

export default ToggleNode;

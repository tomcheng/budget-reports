import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import AnimateHeight from "react-animate-height-auto";
import { selectedPlotBandColor } from "../styleVariables";
import { MinorText } from "./typeComponents";

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.selected && selectedPlotBandColor};
  padding: 8px 10px;
  border-radius: 2px;
  user-select: none;
`;

const HeaderMenu = ({
  expanded,
  expandedLabel,
  collapsedLabel,
  options,
  renderer,
  selected,
  onSelect,
  onToggle
}) => (
  <Fragment>
    <AnimateHeight isExpanded={expanded}>
      <div
        style={{
          padding: "10px 13px",
          backgroundColor: "#fafafa",
          borderTop: "1px solid #eee"
        }}
      >
        {options.map(option => (
          <ListItem
            key={option.id}
            selected={option.id === selected}
            onClick={() => {
              onSelect(option.id);
            }}
          >
            {renderer(option)}
          </ListItem>
        ))}
      </div>
    </AnimateHeight>
    <MinorText
      style={{
        textAlign: "center",
        padding: "5px 0",
        userSelect: "none",
        borderTop: "1px solid #eee"
      }}
      onClick={onToggle}
    >
      {expanded ? expandedLabel : collapsedLabel}
    </MinorText>
  </Fragment>
);

HeaderMenu.propTypes = {
  expanded: PropTypes.bool,
  expandedLabel: PropTypes.string.isRequired,
  collapsedLabel: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  ).isRequired,
  renderer: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  selected: PropTypes.string
};

export default HeaderMenu;

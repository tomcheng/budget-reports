import React, { Component, Fragment } from "react";
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
`;

class HeaderMenu extends Component {
  static propTypes = {
    optionRenderer: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ).isRequired,
    onSelectOption: PropTypes.func.isRequired,
    selectedOption: PropTypes.string
  };

  state = { expanded: false };

  handleClickToggle = () => {
    this.setState(state => ({ ...state, expanded: !state.expanded }));
  };

  render() {
    const {
      options,
      optionRenderer,
      selectedOption,
      onSelectOption
    } = this.props;
    const { expanded } = this.state;
    return (
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
                selected={option.id === selectedOption}
                onClick={() => {
                  onSelectOption(option.id);
                }}
              >
                {optionRenderer(option)}
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
          onClick={this.handleClickToggle}
        >
          {expanded ? "hide" : "show"} categories
        </MinorText>
      </Fragment>
    );
  }
}

export default HeaderMenu;

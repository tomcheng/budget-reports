import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import styled from "styled-components";

const TOP_SPACE = 2;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1;
`;

const DropdownContent = styled.div`
  position: fixed;
  z-index: 1;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.1), 0 5px 30px rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 22px;
`;

const DropdownOption = styled.div`
  padding: 16px 20px;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const StyledLink = styled(Link)`
  font-family: Roboto, Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: #444;
  font-size: 14px;
  line-height: 22px;
  color: inherit;
  text-decoration: none;
`;

class Dropdown extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    links: PropTypes.arrayOf(
      PropTypes.shape({
        to: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
      })
    ).isRequired
  };

  constructor() {
    super();

    this.dropdownEl = document.createElement("div");
    this.trigger = null;
    document.getElementsByTagName("body")[0].appendChild(this.dropdownEl);

    this.state = {
      isOpen: false,
      top: 0,
      left: 0
    };
  }

  handleClickTrigger = () => {
    const { x, y, height } = this.trigger.getBoundingClientRect();
    this.setState({ isOpen: true, top: y + height + TOP_SPACE, left: x });
  };

  handleClickOverlay = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { links, children } = this.props;
    const { isOpen, top, left } = this.state;

    return (
      <Fragment>
        <span style={{ cursor: "pointer", userSelect: "none" }}>
          {children({
            onClick: this.handleClickTrigger,
            ref: el => {
              this.trigger = el;
            }
          })}
        </span>
        {isOpen &&
          createPortal(
            <Fragment>
              <Overlay onClick={this.handleClickOverlay} />
              <DropdownContent style={{ top, left }}>
                {links.map(({ to, label }) => (
                  <StyledLink key={to} to={to}>
                    <DropdownOption>{label}</DropdownOption>
                  </StyledLink>
                ))}
              </DropdownContent>
            </Fragment>,
            this.dropdownEl
          )}
      </Fragment>
    );
  }
}

export default Dropdown;

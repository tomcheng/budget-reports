import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import Icon from "./Icon";
import { plotBandColor, iconWidth } from "../styleVariables";

const StyledLink = styled(NavLink)`
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  border-top: 1px solid #eee;
  &:last-of-type {
    border-bottom: 1px solid #eee;
  }
`;

const SidebarMenuContent = ({ budgetId, onCloseSidebar }) => (
  <Fragment>
    <div
      style={{
        height: 60,
        width: iconWidth,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onClick={onCloseSidebar}
    >
      <Icon icon="times" />
    </div>
    <MenuItem to={`/budgets/${budgetId}`}>Current Month Budget</MenuItem>
    <MenuItem to={`/budgets/${budgetId}/income-vs-expenses`}>
      Income vs Expenses
    </MenuItem>
  </Fragment>
);

SidebarMenuContent.propTypes = {
  budgetId: PropTypes.string.isRequired,
  onCloseSidebar: PropTypes.func.isRequired
};

const MenuItem = ({ to, children }) => (
  <StyledLink
    to={to}
    activeStyle={{
      backgroundColor: plotBandColor
    }}
    exact
  >
    {children}
  </StyledLink>
);

export default SidebarMenuContent;

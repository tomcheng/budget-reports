import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";
import { getLastUpdated } from "../uiRepo";
import { MinorText } from "./typeComponents";
import Icon from "./Icon";
import { plotBandColor } from "../styleVariables";

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

const SidebarMenuContent = ({ budgetId, onRefreshBudget, onCloseSidebar }) => (
  <Fragment>
    <div
      style={{
        height: 60,
        width: 50,
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
    <div style={{ padding: 20 }}>
      <button
        onClick={() => {
          onRefreshBudget(budgetId);
        }}
      >
        Refresh
      </button>
      <MinorText>
        Updated {moment(getLastUpdated(budgetId) || undefined).fromNow()}
      </MinorText>
    </div>
  </Fragment>
);

SidebarMenuContent.propTypes = {
  budgetId: PropTypes.string.isRequired,
  onCloseSidebar: PropTypes.func.isRequired,
  onRefreshBudget: PropTypes.func.isRequired
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

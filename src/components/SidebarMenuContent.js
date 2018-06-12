import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";
import { getLastUpdated } from "../uiRepo";
import { MinorText } from "./typeComponents";

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid #eee;
`;

const SidebarMenuContent = ({ budgetId, onRefreshBudget }) => (
  <Fragment>
    <StyledLink to={`/budgets/${budgetId}`}>Current Month Budget</StyledLink>
    <StyledLink to={`/budgets/${budgetId}/income-vs-expenses`}>
      Income vs Expenses
    </StyledLink>
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
  </Fragment>
);

SidebarMenuContent.propTypes = {
  budgetId: PropTypes.string.isRequired,
  onRefreshBudget: PropTypes.func.isRequired
};

export default SidebarMenuContent;

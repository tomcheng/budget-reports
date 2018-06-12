import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid #eee;
`;

const SidebarMenuContent = ({ budgetId }) => (
  <Fragment>
    <StyledLink to={`/budgets/${budgetId}`}>Current Month Budget</StyledLink>
    <StyledLink to={`/budgets/${budgetId}/income-vs-expenses`}>
      Income vs Expenses
    </StyledLink>
  </Fragment>
);

SidebarMenuContent.propTypes = {
  budgetId: PropTypes.string.isRequired
};

export default SidebarMenuContent;

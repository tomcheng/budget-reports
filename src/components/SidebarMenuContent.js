import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const SidebarMenuContent = ({ budgetId }) => (
  <div>
    <Link to={`/budgets/${budgetId}/income-vs-expenses`}>
      Income vs Expenses
    </Link>
    <Link to={`/budgets/${budgetId}`}>
      Budget
    </Link>
  </div>
);

SidebarMenuContent.propTypes = {
  budgetId: PropTypes.string.isRequired
};

export default SidebarMenuContent;

import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";

const MainLayout = ({ title, onRefreshBudget, budgetId, children }) => (
  <div>
    <Header
      title={title}
      onRefreshBudget={onRefreshBudget}
      budgetId={budgetId}
    />
    {children}
  </div>
);

MainLayout.propTypes = {
  budgetId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  onRefreshBudget: PropTypes.func.isRequired
};

export default MainLayout;

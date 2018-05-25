import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";

const MainLayout = ({ title, onRefreshData, budgetId, children }) => (
  <div>
    <Header title={title} onRefreshData={onRefreshData} budgetId={budgetId} />
    {children}
  </div>
);

MainLayout.propTypes = {
  budgetId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  onRefreshData: PropTypes.func.isRequired
};

export default MainLayout;

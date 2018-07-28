import React from "react";
import PropTypes from "prop-types";
import PageWrapper from "./PageWrapper";
import DashboardBody from "./DashboardBody";

const Dashboard = ({
  authorized,
  budget,
  budgetId,
  title,
  onAuthorize,
  onRequestBudget
}) => (
  <PageWrapper
    authorized={authorized}
    budgetId={budgetId}
    budgetLoaded={!!budget}
    onAuthorize={onAuthorize}
    onRequestBudget={onRequestBudget}
    title={title}
    content={() => <DashboardBody budget={budget} />}
  />
);

Dashboard.propTypes = {
  authorized: PropTypes.bool.isRequired,
  budgetId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  budget: PropTypes.object
};

export default Dashboard;

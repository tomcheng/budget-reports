import React from "react";
import PropTypes from "prop-types";
import PageWrapper from "./PageWrapper";
import ProjectionsBody from "./ProjectionsBody";

const Projections = ({
  budget,
  investmentAccounts,
  mortgageAccounts,
  ...other
}) => (
  <PageWrapper
    {...other}
    budgetLoaded={!!budget}
    content={() => (
      <ProjectionsBody
        budget={budget}
        investmentAccounts={investmentAccounts}
        mortgageAccounts={mortgageAccounts}
      />
    )}
  />
);

Projections.propTypes = {
  authorized: PropTypes.bool.isRequired,
  budgetId: PropTypes.string.isRequired,
  investmentAccounts: PropTypes.object.isRequired,
  mortgageAccounts: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  budget: PropTypes.object
};

export default Projections;

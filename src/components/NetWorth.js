import React from "react";
import PropTypes from "prop-types";
import PageWrapper from "./PageWrapper";
import NetWorthBody from "./NetWorthBody";

const NetWorth = ({
  budget,
  investmentAccounts,
  mortgageAccounts,
  ...other
}) => (
  <PageWrapper
    {...other}
    budgetLoaded={!!budget}
    content={() => (
      <NetWorthBody
        budget={budget}
        investmentAccounts={investmentAccounts}
        mortgageAccounts={mortgageAccounts}
      />
    )}
  />
);

NetWorth.propTypes = {
  authorized: PropTypes.bool.isRequired,
  budgetId: PropTypes.string.isRequired,
  investmentAccounts: PropTypes.object.isRequired,
  mortgageAccounts: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  budget: PropTypes.object
};

export default NetWorth;

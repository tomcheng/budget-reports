import React from "react";
import PropTypes from "prop-types";
import PageWrapper from "./PageWrapper";
import CurrentMonthBody from "./CurrentMonthBody";

const CurrentMonth = ({
  authorized,
  budget,
  budgetId,
  currentMonth,
  investmentAccounts,
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
    content={() => (
      <CurrentMonthBody
        budget={budget}
        currentMonth={currentMonth}
        investmentAccounts={investmentAccounts}
      />
    )}
  />
);

CurrentMonth.propTypes = {
  authorized: PropTypes.bool.isRequired,
  budgetId: PropTypes.string.isRequired,
  currentMonth: PropTypes.string.isRequired,
  investmentAccounts: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  budget: PropTypes.object
};

export default CurrentMonth;

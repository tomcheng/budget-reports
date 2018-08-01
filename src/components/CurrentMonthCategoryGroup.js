import React from "react";
import PropTypes from "prop-types";
import PageWrapper from "./PageWrapper";
import CurrentMonthCategoryGroupBody from "./CurrentMonthCategoryGroupBody";
import find from "lodash/fp/find";
import matchesProperty from "lodash/fp/matchesProperty";

const CurrentMonthCategoryGroup = ({
  authorized,
  budget,
  budgetId,
  categoryGroupId,
  currentMonth,
  onAuthorize,
  onRequestBudget
}) => (
  <PageWrapper
    authorized={authorized}
    budgetId={budgetId}
    budgetLoaded={!!budget}
    backLink
    onAuthorize={onAuthorize}
    onRequestBudget={onRequestBudget}
    title={() =>
      find(matchesProperty("id", categoryGroupId))(budget.categoryGroups).name
    }
    content={() => (
      <CurrentMonthCategoryGroupBody
        budget={budget}
        categoryGroupId={categoryGroupId}
        currentMonth={currentMonth}
      />
    )}
  />
);

CurrentMonthCategoryGroup.propTypes = {
  authorized: PropTypes.bool.isRequired,
  budgetId: PropTypes.string.isRequired,
  categoryGroupId: PropTypes.string.isRequired,
  currentMonth: PropTypes.string.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  budget: PropTypes.shape({
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        activity: PropTypes.number.isRequired,
        balance: PropTypes.number.isRequired,
        budgeted: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
      })
    ).isRequired,
    payeesById: PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ).isRequired,
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        payeeId: PropTypes.string.isRequired
      })
    ).isRequired
  })
};

export default CurrentMonthCategoryGroup;

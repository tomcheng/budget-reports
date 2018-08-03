import React from "react";
import PropTypes from "prop-types";
import get from "lodash/fp/get";
import PageWrapper from "./PageWrapper";
import CurrentMonthCategoryGroupBody from "./CurrentMonthCategoryGroupBody";

const CurrentMonthCategoryGroup = ({
  budget,
  categoryGroupId,
  currentMonth,
  ...other
}) => (
  <PageWrapper
    {...other}
    budgetLoaded={!!budget}
    backLink
    title={get(["categoryGroupsById", categoryGroupId, "name"])(budget) || ""}
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
    categoryGroups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ).isRequired
  })
};

export default CurrentMonthCategoryGroup;

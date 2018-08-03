import React from "react";
import PropTypes from "prop-types";
import PageWrapper from "./PageWrapper";
import CategoryTitle from "./CategoryTitle";
import CurrentMonthCategoryBody from "./CurrentMonthCategoryBody";

const CurrentMonthCategory = ({
  budget,
  categoryId,
  currentMonth,
  ...other
}) => (
  <PageWrapper
    {...other}
    budgetLoaded={!!budget}
    backLink
    title={<CategoryTitle budget={budget} categoryId={categoryId} />}
    content={() => (
      <CurrentMonthCategoryBody
        budget={budget}
        currentMonth={currentMonth}
        categoryId={categoryId}
      />
    )}
  />
);

CurrentMonthCategory.propTypes = {
  authorized: PropTypes.bool.isRequired,
  budgetId: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  currentMonth: PropTypes.string.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  budget: PropTypes.object
};

export default CurrentMonthCategory;

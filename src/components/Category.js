import React from "react";
import PropTypes from "prop-types";
import PageWrapper from "./PageWrapper";
import CategoryTitle from "./CategoryTitle";
import CategoryBody from "./CategoryBody";

const Category = ({
  authorized,
  budget,
  budgetId,
  categoryId,
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
    title={() => <CategoryTitle budget={budget} categoryId={categoryId} />}
    content={() => (
      <CategoryBody
        budget={budget}
        currentMonth={currentMonth}
        categoryId={categoryId}
      />
    )}
  />
);

Category.propTypes = {
  authorized: PropTypes.bool.isRequired,
  budgetId: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
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

export default Category;

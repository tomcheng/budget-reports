import React from "react";
import PropTypes from "prop-types";
import get from "lodash/fp/get";
import PageWrapper from "./PageWrapper";
import CategoryBody from "./CategoryBody";

const Category = ({
  authorized,
  budget,
  budgetId,
  categoryId,
  onAuthorize,
  onRequestBudget
}) => {
  const category = get(["categoriesById", categoryId])(budget);

  return (
    <PageWrapper
      authorized={authorized}
      budgetId={budgetId}
      budgetLoaded={!!budget}
      onAuthorize={onAuthorize}
      onRequestBudget={onRequestBudget}
      title={category ? `Category: ${category.name}` : ""}
      content={() => <CategoryBody budget={budget} category={category} />}
      backLink
    />
  );
};

Category.propTypes = {
  authorized: PropTypes.bool.isRequired,
  budgetId: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  budget: PropTypes.object
};

export default Category;

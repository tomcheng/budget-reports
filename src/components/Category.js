import React from "react";
import PropTypes from "prop-types";
import get from "lodash/fp/get";
import PageWrapper from "./PageWrapper";
import CategoryBody from "./CategoryBody";

const Category = ({ budget, categoryId, ...other }) => {
  const category = get(["categoriesById", categoryId])(budget);

  return (
    <PageWrapper
      {...other}
      budgetLoaded={!!budget}
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

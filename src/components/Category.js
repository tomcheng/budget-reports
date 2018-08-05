import React from "react";
import PropTypes from "prop-types";
import get from "lodash/fp/get";
import { getCategoryGroupsLink, getCategoryGroupLink } from "../linkUtils";
import PageWrapper from "./PageWrapper";
import CategoryBody from "./CategoryBody";

const Category = ({ budget, categoryId, categoryGroupId, ...other }) => {
  const category = get(["categoriesById", categoryId])(budget) || {};
  const group = get(["categoryGroupsById", categoryGroupId])(budget) || {};
  const budgetId = get("id")(budget);

  return (
    <PageWrapper
      {...other}
      budgetLoaded={!!budget}
      breadcrumbs={[
        {
          label: "Categories",
          to: getCategoryGroupsLink({ budgetId })
        },
        {
          label: group.name || "",
          to: getCategoryGroupLink({
            budgetId,
            categoryGroupId: group.id
          })
        }
      ]}
      title={category.name || ""}
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

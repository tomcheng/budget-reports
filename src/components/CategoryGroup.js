import React from "react";
import PropTypes from "prop-types";
import get from "lodash/fp/get";
import PageWrapper from "./PageWrapper";
import CategoryGroupBody from "./CategoryGroupBody";

const CategoryGroup = ({ budget, categoryGroupId, ...other }) => {
  const group = get(["categoryGroupsById", categoryGroupId])(budget);
  return (
    <PageWrapper
      {...other}
      budgetLoaded={!!budget}
      title={group ? group.name : ""}
      content={() => (
        <CategoryGroupBody budget={budget} categoryGroup={group} />
      )}
      backLink
    />
  );
};

CategoryGroup.propTypes = {
  authorized: PropTypes.bool.isRequired,
  budgetId: PropTypes.string.isRequired,
  categoryGroupId: PropTypes.string.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  budget: PropTypes.object
};

export default CategoryGroup;

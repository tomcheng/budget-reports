import React from "react";
import PropTypes from "prop-types";
import CategoryGroup from "./CategoryGroup";

const Budget = ({ budget, currentUrl }) => {
  if (!budget.categoryGroups || !budget.categories) {
    return null;
  }

  return (
    <div>
      {budget.categoryGroups.map(categoryGroup => (
        <CategoryGroup
          key={categoryGroup.id}
          categoryGroup={categoryGroup}
          categories={budget.categories.filter(
            c => c.categoryGroupId === categoryGroup.id
          )}
          currentUrl={currentUrl}
        />
      ))}
    </div>
  );
};

Budget.propTypes = {
  budget: PropTypes.shape({
    categoryGroups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ),
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        categoryGroupId: PropTypes.string.isRequired
      })
    )
  }).isRequired,
  currentUrl: PropTypes.string.isRequired
};

export default Budget;

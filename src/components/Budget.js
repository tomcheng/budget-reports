import React from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import CategoryGroup from "./CategoryGroup";

const Budget = ({ budget, onSelectCategory }) => {
  const selectedCategoryGroups = get(budget, ["details", "categoryGroups"]);
  const selectedCategories = get(budget, ["details", "categories"]);

  return (
    <div>
      {selectedCategoryGroups &&
        selectedCategoryGroups.map(categoryGroup => (
          <CategoryGroup
            key={categoryGroup.id}
            categoryGroup={categoryGroup}
            categories={selectedCategories.filter(
              c => c.categoryGroupId === categoryGroup.id
            )}
            onSelectCategory={onSelectCategory}
          />
        ))}
    </div>
  );
};

Budget.propTypes = {
  budget: PropTypes.shape({
    details: PropTypes.shape({
      categoryGroups: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired
        })
      ).isRequired,
      categories: PropTypes.arrayOf(
        PropTypes.shape({
          categoryGroupId: PropTypes.string.isRequired
        })
      ).isRequired
    })
  }).isRequired,
  onSelectCategory: PropTypes.func.isRequired
};

export default Budget;

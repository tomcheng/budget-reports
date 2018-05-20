import React from "react";
import PropTypes from "prop-types";

const CategoryListItem = ({ category, onSelectCategory }) => (
  <div onClick={() => onSelectCategory(category.id)}>{category.name}</div>
);

CategoryListItem.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onSelectCategory: PropTypes.func.isRequired
};

export default CategoryListItem;

import React from "react";
import PropTypes from "prop-types";

const Category = ({ category, onSelectCategory }) => (
  <div onClick={() => onSelectCategory(category.id)}>{category.name}</div>
);

Category.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onSelectCategory: PropTypes.func.isRequired
};

export default Category;

import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const CategoryListItem = ({ category, currentUrl }) => (
  <div>
    <Link to={`${currentUrl}/categories/${category.id}`}>{category.name}</Link>
  </div>
);

CategoryListItem.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  currentUrl: PropTypes.string.isRequired
};

export default CategoryListItem;

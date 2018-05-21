import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ListItem from "./ListItem";

const CategoryListItem = ({ category, currentUrl }) => (
  <Link to={`${currentUrl}/categories/${category.id}`}>
    <ListItem>{category.name}</ListItem>
  </Link>
);

CategoryListItem.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  currentUrl: PropTypes.string.isRequired
};

export default CategoryListItem;

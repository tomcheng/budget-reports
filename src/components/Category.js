import React from "react";
import PropTypes from "prop-types";

const Category = ({ category }) => <div>{category.name}</div>;

Category.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default Category;

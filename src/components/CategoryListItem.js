import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import ListItem from "./ListItem";
import CategorySummary from "./CategorySummary";

const StyledListItem = styled(ListItem)`
  color: #666;
  font-size: 13px;
  height: 48px;
  border-top: 0;
`;

const CategoryListItem = ({ category, currentUrl, leftSpacing }) => (
  <Link to={`${currentUrl}/categories/${category.id}`}>
    <StyledListItem>
      <div style={{ paddingLeft: leftSpacing }}>{category.name}</div>
      <CategorySummary
        activity={category.activity}
        balance={category.balance}
      />
    </StyledListItem>
  </Link>
);

CategoryListItem.propTypes = {
  category: PropTypes.shape({
    activity: PropTypes.number.isRequired,
    balance: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  currentUrl: PropTypes.string.isRequired,
  leftSpacing: PropTypes.number.isRequired
};

export default CategoryListItem;

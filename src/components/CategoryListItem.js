import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import CategorySummary from "./CategorySummary";

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  padding: 0 20px;
  border-bottom: 0;
  font-size: 13px;
  color: #666;
  user-select: none;
`;

const CategoryListItem = ({ category, currentUrl, leftSpacing, monthProgress }) => (
  <Link to={`${currentUrl}/categories/${category.id}`}>
    <ListItem>
      <div style={{ paddingLeft: leftSpacing }}>{category.name}</div>
      <CategorySummary
        activity={category.activity}
        balance={category.balance}
        monthProgress={monthProgress}
      />
    </ListItem>
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
  leftSpacing: PropTypes.number.isRequired,
  monthProgress: PropTypes.number.isRequired
};

export default CategoryListItem;

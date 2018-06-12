import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import round from "lodash/fp/round";
import { Link } from "react-router-dom";
import { getCategoryLink } from "../utils";
import { SecondaryText } from "./typeComponents";
import SummaryChart from "./SummaryChart";

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  padding: 0 20px 0 0;
  border-bottom: 0;
  user-select: none;
`;

const CategoryListItem = ({
  budgetId,
  category,
  leftSpacing,
  monthProgress
}) => (
  <Link to={getCategoryLink({ budgetId, categoryId: category.id })}>
    <ListItem style={{ paddingLeft: leftSpacing }}>
      <SecondaryText>{category.name}</SecondaryText>
      <div
        style={{
          width: 160,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <SummaryChart
          activity={category.activity}
          balance={category.balance}
          indicator={monthProgress}
        />
        <SecondaryText>{round(category.balance)}</SecondaryText>
      </div>
    </ListItem>
  </Link>
);

CategoryListItem.propTypes = {
  budgetId: PropTypes.string.isRequired,
  category: PropTypes.shape({
    activity: PropTypes.number.isRequired,
    balance: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  leftSpacing: PropTypes.number.isRequired,
  monthProgress: PropTypes.number.isRequired
};

export default CategoryListItem;

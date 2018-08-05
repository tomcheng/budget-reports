import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getCategoryLink, getCategoryGroupLink } from "../linkUtils";
import ListItem from "./ListItem";
import { SecondaryText } from "./typeComponents";
import Separator from "./Separator";

const PayeeCategories = ({ categoryIds, budget }) => {
  const { categoriesById, categoryGroupsById } = budget;

  return categoryIds.map(id => {
    const category = categoriesById[id];
    const categoryGroup = categoryGroupsById[category.categoryGroupId];

    if (!categoryGroup) {
      return null;
    }

    return (
      <ListItem key={id}>
        <SecondaryText
          style={{ display: "flex", alignItems: "center", whiteSpace: "pre" }}
        >
          <Link
            to={getCategoryGroupLink({
              budgetId: budget.id,
              categoryGroupId: categoryGroup.id
            })}
          >
            {categoryGroup.name}
          </Link>{" "}
          <Separator />{" "}
          <Link
            to={getCategoryLink({
              budgetId: budget.id,
              categoryGroupId: categoryGroup.id,
              categoryId: category.id
            })}
          >
            {category.name}
          </Link>
        </SecondaryText>
      </ListItem>
    );
  });
};

PayeeCategories.propTypes = {
  budget: PropTypes.shape({
    categoriesById: PropTypes.object.isRequired,
    categoryGroupsById: PropTypes.object.isRequired
  }).isRequired,
  categoryIds: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default PayeeCategories;

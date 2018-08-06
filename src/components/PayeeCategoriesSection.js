import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import pages, { makeLink } from "../pages";
import CollapsibleSection from "./CollapsibleSection";
import ListItem from "./ListItem";
import { SecondaryText } from "./typeComponents";
import Separator from "./Separator";

const PayeeCategoriesSection = ({ categoryIds, budget }) => {
  const { categoriesById, categoryGroupsById } = budget;

  return (
    <CollapsibleSection title="Categories">
      {categoryIds
        .filter(
          id =>
            !!categoriesById[id] &&
            !!categoryGroupsById[categoriesById[id].categoryGroupId]
        )
        .map(id => {
          const category = categoriesById[id];
          const categoryGroup = categoryGroupsById[category.categoryGroupId];

          return (
            <ListItem key={id}>
              <SecondaryText
                style={{
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "pre"
                }}
              >
                <Link
                  to={makeLink(pages.group.path, {
                    budgetId: budget.id,
                    categoryGroupId: categoryGroup.id
                  })}
                >
                  {categoryGroup.name}
                </Link>{" "}
                <Separator />{" "}
                <Link
                  to={makeLink(pages.category.path, {
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
        })}
    </CollapsibleSection>
  );
};

PayeeCategoriesSection.propTypes = {
  budget: PropTypes.shape({
    categoriesById: PropTypes.object.isRequired,
    categoryGroupsById: PropTypes.object.isRequired
  }).isRequired,
  categoryIds: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default PayeeCategoriesSection;

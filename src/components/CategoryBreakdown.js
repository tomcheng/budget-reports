import React from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import groupBy from "lodash/fp/groupBy";
import map from "lodash/fp/map";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import { selectedPlotBandColor } from "../styleVariables";
import Section from "./Section";
import { SecondaryText } from "./typeComponents";
import ListItem from "./ListItem";
import Amount from "./Amount";
import LabelWithTransactionCount from "./LabelWithTransactionCount";

const mapWithKeys = map.convert({ cap: false });

const CategoryBreakdown = ({
  budgetId,
  categoriesById,
  selectedCategoryId,
  transactions,
  onSelectCategory
}) => {
  const categoriesWithData = compose([
    sortBy("amount"),
    mapWithKeys((transactions, categoryId) => ({
      category: categoriesById[categoryId],
      count: transactions.length,
      amount: sumBy("amount")(transactions)
    })),
    groupBy("categoryId")
  ])(transactions);

  return (
    <Section title="Filter by Category" top>
      {categoriesWithData.map(({ category, count, amount }) => (
        <ListItem
          key={category.id}
          style={{
            borderTop: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor:
              category.id === selectedCategoryId ? selectedPlotBandColor : null,
            userSelect: "none"
          }}
          onClick={() => {
            onSelectCategory(category.id);
          }}
        >
          <SecondaryText>
            <LabelWithTransactionCount label={category.name} count={count} />
          </SecondaryText>
          <SecondaryText>
            <Amount amount={amount} />
          </SecondaryText>
        </ListItem>
      ))}
    </Section>
  );
};

CategoryBreakdown.propTypes = {
  budgetId: PropTypes.string.isRequired,
  categoriesById: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  transactions: PropTypes.array.isRequired,
  onSelectCategory: PropTypes.func.isRequired,
  selectedCategoryId: PropTypes.string
};

export default CategoryBreakdown;

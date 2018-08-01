import React from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import groupBy from "lodash/fp/groupBy";
import map from "lodash/fp/map";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import { Link } from "react-router-dom";
import { getCurrentMonthCategoryLink } from "../linkUtils";
import Section from "./Section";
import { SecondaryText } from "./typeComponents";
import ListItem from "./ListItem";
import Amount from "./Amount";
import LabelWithTransactionCount from "./LabelWithTransactionCount";

const mapWithKeys = map.convert({ cap: false });

const CategoryBreakdown = ({ budgetId, categoriesById, transactions }) => {
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
    <Section title="Categories">
      {categoriesWithData.map(({ category, count, amount }) => (
        <ListItem
          key={category.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Link to={getCurrentMonthCategoryLink({ budgetId, categoryId: category.id })}>
            <SecondaryText>
              <LabelWithTransactionCount label={category.name} count={count} />
            </SecondaryText>
          </Link>
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
  transactions: PropTypes.array.isRequired
};

export default CategoryBreakdown;

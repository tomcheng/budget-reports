import React from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import groupBy from "lodash/fp/groupBy";
import map from "lodash/fp/map";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import { Link } from "react-router-dom";
import { getCategoryLink } from "../linkUtils";
import Section from "./Section";
import { SecondaryText } from "./typeComponents";
import ListItem from "./ListItem";
import Amount from "./Amount";

const CategoryBreakdown = ({ budgetId, categories, transactions }) => {
  const transactionsByCategory = groupBy("categoryId")(transactions);
  const categoriesWithData = compose([
    sortBy("amount"),
    map(category => {
      const transactions = transactionsByCategory[category.id] || [];
      const count = transactions.length;
      const amount = sumBy("amount")(transactions);
      return { ...category, count, amount };
    })
  ])(categories);

  return (
    <Section title="Categories">
      {categoriesWithData.map(({ id, name, count, amount }) => (
        <ListItem
          key={id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Link key={id} to={getCategoryLink({ budgetId, categoryId: id })}>
            <SecondaryText>
              {name}{" "}
              <span style={{ opacity: 0.6 }}>
                &ndash; {count} transaction{count === 1 ? "" : "s"}
              </span>
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
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  transactions: PropTypes.array.isRequired
};

export default CategoryBreakdown;

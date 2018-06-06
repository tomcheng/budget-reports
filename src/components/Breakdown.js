import React from "react";
import PropTypes from "prop-types";
import flatMap from "lodash/flatMap";
import get from "lodash/get";
import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
import sumBy from "lodash/sumBy";
import property from "lodash/property";
import Section from "./Section";

const Breakdown = ({ expenses, categories, categoryGroups }) => {
  const total = sumBy(expenses, "amount");
  const expensesByCategory = groupBy(
    expenses.filter(trans => !!trans.categoryId),
    property("categoryId")
  );
  const categoriesByGroup = groupBy(categories, property("categoryGroupId"));

  const groups = sortBy(
    categoryGroups
      .map(group => {
        const groupTransactions = flatMap(
          get(categoriesByGroup, group.id, []).map(category =>
            get(expensesByCategory, category.id, [])
          )
        );

        return {
          ...group,
          total: sumBy(groupTransactions, "amount")
        };
      })
      .filter(group => !!group.total),
    "total"
  );

  return (
    <Section>
      {groups.map(group => (
        <div key={group.id}>
          {group.name} {group.total} ({Math.round(group.total / total * 100)})
        </div>
      ))}
    </Section>
  );
};

Breakdown.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      categoryGroupId: PropTypes.string.isRequired
    })
  ).isRequired,
  categoryGroups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  ).isRequired,
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      categoryId: PropTypes.string
    })
  ).isRequired,
  payees: PropTypes.objectOf(PropTypes.shape({})).isRequired
};

export default Breakdown;

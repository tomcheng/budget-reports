import React from "react";
import PropTypes from "prop-types";
import flatMap from "lodash/flatMap";
import get from "lodash/get";
import groupBy from "lodash/groupBy";
import keys from "lodash/keys";
import sortBy from "lodash/sortBy";
import sumBy from "lodash/sumBy";
import property from "lodash/property";
import Section from "./Section";
import PayeeListItem from "./PayeeListItem";
import BreakdownGroupListItem from "./BreakdownGroupListItem";

const Breakdown = ({
  expenses,
  categories,
  categoryGroups,
  payees: payeesById
}) => {
  const total = sumBy(expenses, "amount");
  const expensesByCategory = groupBy(
    expenses.filter(trans => !!trans.categoryId),
    property("categoryId")
  );
  const categoriesByGroup = groupBy(categories, property("categoryGroupId"));
  const noCategories = expenses.filter(trans => !trans.categoryId);
  const transactionsByPayee = groupBy(noCategories, "payeeId");
  const payees = keys(payeesById)
    .filter(id => !!transactionsByPayee[id])
    .map(id => ({
      ...payeesById[id],
      amount: sumBy(transactionsByPayee[id], "amount"),
      type: "payee"
    }));

  const groups = categoryGroups
    .map(group => {
      const groupTransactions = flatMap(
        get(categoriesByGroup, group.id, []).map(category =>
          get(expensesByCategory, category.id, [])
        )
      );

      return {
        ...group,
        amount: sumBy(groupTransactions, "amount"),
        type: "group"
      };
    })
    .filter(group => !!group.amount);

  const groupsAndPayees = sortBy(groups.concat(payees), "amount");

  return (
    <Section>
      {groupsAndPayees.map(
        ({ type, id, name, amount }) =>
          type === "payee" ? (
            <PayeeListItem key={id} name={name} amount={amount} total={total} />
          ) : (
            <BreakdownGroupListItem
              key={id}
              name={name}
              amount={amount}
              total={total}
            />
          )
      )}
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

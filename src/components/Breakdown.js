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
import { StrongText } from "./typeComponents";
import PayeeListItem from "./PayeeListItem";
import BreakdownGroupListItem from "./BreakdownGroupListItem";

const Breakdown = ({
  title,
  transactions,
  categories,
  categoryGroups,
  payees: payeesById
}) => {
  const total = sumBy(transactions, "amount");
  const transactionsByCategory = groupBy(
    transactions.filter(trans => !!trans.categoryId),
    property("categoryId")
  );
  const categoriesByGroup = groupBy(categories, property("categoryGroupId"));
  const noCategories = transactions.filter(trans => !trans.categoryId);
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
          get(transactionsByCategory, category.id, [])
        )
      );
      const categories = sortBy(
        get(categoriesByGroup, group.id, [])
          .map(category => {
            return {
              ...category,
              amount: sumBy(
                get(transactionsByCategory, category.id, []),
                "amount"
              )
            };
          })
          .filter(category => !!category.amount),
        "amount"
      );

      return {
        ...group,
        categories,
        amount: sumBy(groupTransactions, "amount"),
        type: "group"
      };
    })
    .filter(group => !!group.amount);

  const groupsAndPayees = sortBy(groups.concat(payees), "amount");

  return (
    <Section>
      <StrongText>{title}</StrongText>
      {groupsAndPayees.map(
        ({ type, id, name, amount, categories }) =>
          type === "payee" ? (
            <PayeeListItem key={id} name={name} amount={amount} total={total} />
          ) : (
            <BreakdownGroupListItem
              key={id}
              name={name}
              amount={amount}
              total={total}
              categories={categories}
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
  payees: PropTypes.objectOf(PropTypes.shape({})).isRequired,
  title: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      categoryId: PropTypes.string
    })
  ).isRequired
};

export default Breakdown;

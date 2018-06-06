import React, { Fragment } from "react";
import PropTypes from "prop-types";
import flatMap from "lodash/flatMap";
import get from "lodash/get";
import groupBy from "lodash/groupBy";
import keys from "lodash/keys";
import property from "lodash/property";
import sortBy from "lodash/sortBy";
import sumBy from "lodash/sumBy";
import map from "lodash/map";
import PayeeListItem from "./PayeeListItem";
import BreakdownGroupListItem from "./BreakdownGroupListItem";

const Breakdown = ({
  transactions,
  categories,
  categoryGroups,
  reverse,
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
      let categories = sortBy(
        get(categoriesByGroup, group.id, [])
          .map(category => {
            const transactions = get(transactionsByCategory, category.id, []);
            const transactionsByPayee = groupBy(transactions, "payeeId");
            const payees = sortBy(
              map(transactionsByPayee, (trans, id) => ({
                ...payeesById[id],
                amount: sumBy(trans, "amount")
              })),
              "amount"
            );

            return {
              ...category,
              payees,
              amount: sumBy(transactions, "amount")
            };
          })
          .filter(category => !!category.amount),
        "amount"
      );

      if (reverse) {
        categories = categories.reverse();
      }

      return {
        ...group,
        categories,
        amount: sumBy(groupTransactions, "amount"),
        type: "group"
      };
    })
    .filter(group => !!group.amount);

  let groupsAndPayees = sortBy(groups.concat(payees), "amount");

  if (reverse) {
    groupsAndPayees.reverse();
  }

  return (
    <Fragment>
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
    </Fragment>
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
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      categoryId: PropTypes.string
    })
  ).isRequired,
  reverse: PropTypes.bool
};

Breakdown.defaultProps = { reverse: false };

export default Breakdown;

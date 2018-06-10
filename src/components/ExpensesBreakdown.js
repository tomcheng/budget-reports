import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import flatMap from "lodash/flatMap";
import get from "lodash/get";
import groupBy from "lodash/groupBy";
import keys from "lodash/keys";
import map from "lodash/map";
import pick from "lodash/pick";
import property from "lodash/property";
import sortBy from "lodash/sortBy";
import sumBy from "lodash/sumBy";
import { StrongText } from "./typeComponents";
import Section from "./Section";
import Breakdown from "./Breakdown";

const ExpensesBreakdown = ({
  categories,
  categoryGroups,
  selectedMonth,
  transactions,
  totalIncome,
  payees: payeesById
}) => {
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
      ...pick(payeesById[id], ["id", "name"]),
      amount: sumBy(transactionsByPayee[id], "amount")
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
            const transactions = get(transactionsByCategory, category.id, []);
            const transactionsByPayee = groupBy(transactions, "payeeId");
            const payees = sortBy(
              map(transactionsByPayee, (trans, id) => ({
                ...pick(payeesById[id], ["id", "name"]),
                amount: sumBy(trans, "amount")
              })),
              "amount"
            );

            return {
              ...pick(category, ["id", "name"]),
              nodes: payees,
              amount: sumBy(transactions, "amount")
            };
          })
          .filter(category => !!category.amount),
        "amount"
      );

      return {
        ...pick(group, ["id", "name"]),
        nodes: categories,
        amount: sumBy(groupTransactions, "amount")
      };
    })
    .filter(category => !!category.amount);

  const nodes = sortBy(groups.concat(payees), "amount").concat([
    {
      id: "net",
      amount: -totalIncome - sumBy(transactions, "amount"),
      name: "Net Income"
    }
  ]);

  return (
    <Section>
      <StrongText>
        Expenses for {moment(selectedMonth, "YYYY-MM").format("MMMM YYYY")}
      </StrongText>
      <Breakdown nodes={nodes} total={-totalIncome} />
    </Section>
  );
};

ExpensesBreakdown.propTypes = {
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
  selectedMonth: PropTypes.string.isRequired,
  totalIncome: PropTypes.number.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      categoryId: PropTypes.string
    })
  ).isRequired
};

export default ExpensesBreakdown;

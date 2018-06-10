import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import flow from "lodash/flow";
import get from "lodash/get";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import pick from "lodash/pick";
import sortBy from "lodash/sortBy";
import sumBy from "lodash/sumBy";
import { StrongText } from "./typeComponents";
import Section from "./Section";
import Breakdown from "./Breakdown";

const getPayeeNodes = ({ payeesById, transactions }) =>
  flow([
    transactions => groupBy(transactions, "payeeId"),
    transactionsByPayee =>
      map(transactionsByPayee, (transactions, payeeId) => ({
        ...pick(payeesById[payeeId], ["id", "name"]),
        amount: sumBy(transactions, "amount")
      }))
  ])(transactions);

const ExpensesBreakdown = ({
  categories,
  categoryGroups,
  selectedMonth,
  transactions,
  totalIncome,
  payeesById
}) => {
  const payeeNodes = getPayeeNodes({
    payeesById,
    transactions: transactions.filter(trans => !trans.categoryId)
  });

  const transactionsByCategory = groupBy(
    transactions.filter(trans => !!trans.categoryId),
    "categoryId"
  );
  const categoriesByGroup = groupBy(categories, "categoryGroupId");

  const groupNodes = categoryGroups
    .map(group => {
      const categoryNodes = sortBy(
        get(categoriesByGroup, group.id, [])
          .map(category => {
            const transactions = get(transactionsByCategory, category.id, []);
            const payeeNodes = sortBy(
              getPayeeNodes({ payeesById, transactions }),
              "amount"
            );

            return {
              ...pick(category, ["id", "name"]),
              nodes: payeeNodes,
              amount: sumBy(transactions, "amount")
            };
          })
          .filter(category => category.nodes.length > 0),
        "amount"
      );

      return {
        ...pick(group, ["id", "name"]),
        nodes: categoryNodes,
        amount: sumBy(categoryNodes, "amount")
      };
    })
    .filter(group => group.nodes.length > 0);

  const nodes = sortBy(groupNodes.concat(payeeNodes), "amount").concat([
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
  payeesById: PropTypes.objectOf(PropTypes.object).isRequired,
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

import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import flatMap from "lodash/flatMap";
import get from "lodash/get";
import groupBy from "lodash/groupBy";
import keyBy from "lodash/keyBy";
import keys from "lodash/keys";
import map from "lodash/map";
import pick from "lodash/pick";
import property from "lodash/property";
import sortBy from "lodash/sortBy";
import sumBy from "lodash/sumBy";
import { StrongText } from "./typeComponents";
import Section from "./Section";
import Breakdown from "./Breakdown";

const IncomeBreakdown = ({
  categories,
  categoryGroups,
  selectedMonth,
  transactions,
  payees: payeesById
}) => {
  const total = sumBy(transactions, "amount");
  const transactionsByCategory = groupBy(
    transactions.filter(trans => !!trans.categoryId),
    property("categoryId")
  );
  const categoriesById = keyBy(categories, "id");
  const groupsById = keyBy(categoryGroups, "id");
  const categoriesByGroup = groupBy(categories, property("categoryGroupId"));
  const noCategories = transactions.filter(
    trans =>
      !trans.categoryId ||
      !groupsById[categoriesById[trans.categoryId].categoryGroupId]
  );
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
      ).reverse();

      return {
        ...pick(group, ["id", "name"]),
        nodes: categories,
        amount: sumBy(groupTransactions, "amount")
      };
    })
    .filter(group => !!group.amount);

  const groupsAndPayees = sortBy(groups.concat(payees), "amount").reverse();

  return (
    <Section>
      <StrongText>
        Income for {moment(selectedMonth, "YYYY-MM").format("MMMM YYYY")}
      </StrongText>
      <Breakdown nodes={groupsAndPayees} total={total} />
    </Section>
  );
};

IncomeBreakdown.propTypes = {
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
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      categoryId: PropTypes.string
    })
  ).isRequired
};

export default IncomeBreakdown;

import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import compose from "lodash/fp/compose";
import concat from "lodash/fp/concat";
import filter from "lodash/fp/filter";
import get from "lodash/fp/get";
import groupBy from "lodash/fp/groupBy";
import mapRaw from "lodash/fp/map";
import omit from "lodash/fp/omit";
import pick from "lodash/fp/pick";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import { getPayeeNodes } from "../utils";
import { StrongText } from "./typeComponents";
import Section from "./Section";
import Breakdown from "./Breakdown";

const map = mapRaw.convert({ cap: false });

const ExpensesBreakdown = ({
  categoriesById,
  categoryGroupsById,
  selectedMonth,
  transactions,
  totalIncome,
  payeesById
}) => {
  const categoryNodes = compose([
    map((transactions, categoryId) => {
      const payeeNodes = getPayeeNodes({ payeesById, transactions });
      return {
        ...pick(["id", "name", "categoryGroupId"])(categoriesById[categoryId]),
        nodes: sortBy("amount")(payeeNodes),
        amount: sumBy("amount")(payeeNodes)
      };
    }),
    groupBy("categoryId"),
    filter(get("categoryId"))
  ])(transactions);

  const groupNodes = compose([
    map((nodes, categoryGroupId) => {
      const categoryNodes = map(omit("categoryGroupId"))(nodes);
      return {
        ...pick(["id", "name"])(categoryGroupsById[categoryGroupId]),
        nodes: sortBy("amount")(categoryNodes),
        amount: sumBy("amount")(categoryNodes)
      };
    }),
    groupBy("categoryGroupId")
  ])(categoryNodes);

  const rootPayeeNodes = getPayeeNodes({
    payeesById,
    transactions: transactions.filter(trans => !trans.categoryId)
  });

  const nodes = compose([
    nodes =>
      concat(nodes)([
        {
          id: "net",
          amount: -totalIncome - sumBy("amount")(nodes),
          name: "Net Income"
        }
      ]),
    sortBy("amount"),
    concat(rootPayeeNodes)
  ])(groupNodes);

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
  categoriesById: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      categoryGroupId: PropTypes.string.isRequired
    })
  ).isRequired,
  categoryGroupsById: PropTypes.objectOf(
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

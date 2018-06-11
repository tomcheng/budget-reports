import React from "react";
import PropTypes from "prop-types";
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
import { getPayeeNodes } from "../../utils";
import { StrongText } from "../common/typeComponents";
import Section from "../common/Section";
import Breakdown from "./Breakdown";

const map = mapRaw.convert({ cap: false });

const ExpensesBreakdown = ({
  categoriesById,
  categoryGroupsById,
  transactions,
  totalIncome,
  payeesById,
  months
}) => {
  const categoryNodes = compose([
    map((transactions, categoryId) => {
      const payeeNodes = getPayeeNodes({ payeesById, transactions }, months);
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

  const rootPayeeNodes = getPayeeNodes(
    {
      payeesById,
      transactions: transactions.filter(trans => !trans.categoryId)
    },
    months
  );

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
      <StrongText>Expenses Breakdown</StrongText>
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
  months: PropTypes.number.isRequired,
  payeesById: PropTypes.objectOf(PropTypes.object).isRequired,
  totalIncome: PropTypes.number.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      categoryId: PropTypes.string
    })
  ).isRequired
};

ExpensesBreakdown.defaultProps = { months: 1 };

export default ExpensesBreakdown;

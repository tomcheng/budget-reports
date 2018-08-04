import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
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
import { getPayeeLink } from "../linkUtils";
import Section from "./Section";
import Breakdown from "./Breakdown";
import AmountWithPercentage from "./AmountWithPercentage";

const map = mapRaw.convert({ cap: false });

const ExpensesBreakdown = ({
  categoriesById,
  categoryGroupsById,
  transactions,
  totalIncome,
  payeesById,
  divideBy,
  budgetId
}) => {
  const categoryNodes = compose([
    map((transactions, categoryId) => {
      const payeeNodes = getPayeeNodes(
        { payeesById, transactions },
        divideBy
      ).map(payee => ({
        ...payee,
        name: (
          <Link to={getPayeeLink({ budgetId, payeeId: payee.id })}>
            {payee.name}
          </Link>
        )
      }));
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
    divideBy
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
    <Section title="Expenses Breakdown">
      <Breakdown
        nodes={nodes}
        valueRenderer={node => (
          <AmountWithPercentage {...node} total={-totalIncome} />
        )}
      />
    </Section>
  );
};

ExpensesBreakdown.propTypes = {
  budgetId: PropTypes.string.isRequired,
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
  divideBy: PropTypes.number.isRequired,
  payeesById: PropTypes.objectOf(PropTypes.object).isRequired,
  totalIncome: PropTypes.number.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      categoryId: PropTypes.string
    })
  ).isRequired
};

ExpensesBreakdown.defaultProps = { divideBy: 1 };

export default ExpensesBreakdown;

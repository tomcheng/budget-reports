import React from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import concat from "lodash/fp/concat";
import mapRaw from "lodash/fp/map";
import omit from "lodash/fp/omit";
import pick from "lodash/fp/pick";
import sortBy from "lodash/fp/sortBy";
import { sumByProp, groupByProp } from "../optimized";
import { getPayeeNodes } from "../budgetUtils";
import CollapsibleSection from "./CollapsibleSection";
import Breakdown from "./Breakdown";
import AmountWithPercentage from "./AmountWithPercentage";

const map = mapRaw.convert({ cap: false });

const ExpensesBreakdown = ({
  categoriesById,
  categoryGroupsById,
  transactions,
  totalIncome,
  payeesById,
  divideBy
}) => {
  const categoryNodes = compose([
    map((transactions, categoryId) => {
      const payeeNodes = getPayeeNodes({ payeesById, transactions }, divideBy);
      return {
        ...pick(["id", "name", "category_group_id"])(
          categoriesById[categoryId]
        ),
        nodes: sortBy("amount")(payeeNodes),
        amount: sumByProp("amount")(payeeNodes)
      };
    }),
    groupByProp("category_id")
  ])(transactions);

  const groupNodes = compose([
    map((nodes, categoryGroupId) => {
      const categoryNodes = map(omit("category_group_id"))(nodes);
      return {
        ...pick(["id", "name"])(categoryGroupsById[categoryGroupId]),
        nodes: sortBy("amount")(categoryNodes),
        amount: sumByProp("amount")(categoryNodes)
      };
    }),
    groupByProp("category_group_id")
  ])(categoryNodes);

  const rootPayeeNodes = getPayeeNodes(
    {
      payeesById,
      transactions: transactions.filter(transaction => !transaction.category_id)
    },
    divideBy
  );

  const nodes = compose([
    nodes =>
      concat(nodes)([
        {
          id: "net",
          amount: -totalIncome - sumByProp("amount")(nodes),
          name: "Net Income"
        }
      ]),
    sortBy("amount"),
    concat(rootPayeeNodes)
  ])(groupNodes);

  return (
    <CollapsibleSection title="Expenses Breakdown">
      <Breakdown
        nodes={nodes}
        valueRenderer={node => (
          <AmountWithPercentage {...node} total={-totalIncome} />
        )}
      />
    </CollapsibleSection>
  );
};

ExpensesBreakdown.propTypes = {
  categoriesById: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      category_group_id: PropTypes.string.isRequired
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
      category_id: PropTypes.string
    })
  ).isRequired
};

ExpensesBreakdown.defaultProps = { divideBy: 1 };

export default ExpensesBreakdown;

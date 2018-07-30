import React from "react";
import PropTypes from "prop-types";
import groupBy from "lodash/fp/groupBy";
import identity from "lodash/fp/identity";
import map from "lodash/fp/map";
import prop from "lodash/fp/prop";
import sumBy from "lodash/fp/sumBy";
import Breakdown from "./Breakdown";

const mapWithKeys = map.convert({ cap: false });

const GroupedTransactions = ({
  transactions,
  groupBy: groupByFunction,
  groupDisplayFunction,
  leafDisplayFunction
}) => {
  const groupedTransactions = groupBy(groupByFunction)(transactions);
  const nodes = mapWithKeys((transactions, key) => ({
    amount: sumBy("amount")(transactions),
    id: key,
    name: ({ expanded }) => (
      <span>
        {groupDisplayFunction(key)}
        {!expanded && (
          <span style={{ opacity: 0.6 }}>
            &nbsp;&ndash; {transactions.length} transaction{transactions.length === 1
              ? ""
              : "s"}
          </span>
        )}
      </span>
    ),
    nodes: transactions.map(transaction => ({
      amount: transaction.amount,
      name: leafDisplayFunction(transaction),
      id: transaction.id
    }))
  }))(groupedTransactions);

  return <Breakdown nodes={nodes} />;
};

GroupedTransactions.propTypes = {
  groupBy: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  transactions: PropTypes.array.isRequired,
  groupDisplayFunction: PropTypes.func,
  leafDisplayFunction: PropTypes.func
};

GroupedTransactions.defaultProps = {
  groupDisplayFunction: identity,
  leafDisplayFunction: prop("id")
};

export default GroupedTransactions;

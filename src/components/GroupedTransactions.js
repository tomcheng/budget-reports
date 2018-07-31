import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import groupBy from "lodash/fp/groupBy";
import identity from "lodash/fp/identity";
import map from "lodash/fp/map";
import prop from "lodash/fp/prop";
import sumBy from "lodash/fp/sumBy";
import Breakdown from "./Breakdown";

const mapWithKeys = map.convert({ cap: false });

class GroupedTransactions extends PureComponent {
  static propTypes = {
    groupBy: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
    transactions: PropTypes.array.isRequired,
    groupDisplayFunction: PropTypes.func,
    leafDisplayFunction: PropTypes.func
  };

  static defaultProps = {
    groupDisplayFunction: identity,
    leafDisplayFunction: prop("id")
  };

  render() {
    const {
      transactions,
      groupBy: groupByFunction,
      groupDisplayFunction,
      leafDisplayFunction
    } = this.props;
    const groupedTransactions = groupBy(groupByFunction)(transactions);
    const nodes = mapWithKeys((transactions, key) => ({
      amount: sumBy("amount")(transactions),
      id: key,
      name: ({ expanded }) => (
        <span>
          {groupDisplayFunction(key)}
          {!expanded && (
            <span style={{ opacity: 0.6 }}>
              &nbsp;&ndash; {transactions.length} transaction{transactions.length ===
              1
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
  }
}

export default GroupedTransactions;

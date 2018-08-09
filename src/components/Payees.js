import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import keys from "lodash/fp/keys";
import sortBy from "lodash/fp/sortBy";
import { groupByProp, sumByProp } from "../optimized";
import { simpleMemoize, rejectTransferTransactions } from "../utils";
import PayeeListItem from "./PayeeListItem";
import Section from "./Section";

export const getPayeesWithMetadata = simpleMemoize(budget => {
  const { payeesById, transactions } = budget;
  const transactionsByPayee = compose([
    groupByProp("payee_id"),
    rejectTransferTransactions({ budget })
  ])(transactions);

  return keys(transactionsByPayee).map(id => {
    const transactions = transactionsByPayee[id];

    return {
      ...payeesById[id],
      transactions: transactions,
      transactionCount: transactions.length,
      amount: sumByProp("amount")(transactions)
    };
  });
});

class Payees extends PureComponent {
  static propTypes = {
    budget: PropTypes.object.isRequired,
    sort: PropTypes.oneOf(["amount", "name", "transactions"]).isRequired
  };

  render() {
    const { budget, sort } = this.props;

    const payeesWithMetadata = getPayeesWithMetadata(budget);

    let sorted = sortBy(sort === "transactions" ? "transactionCount" : sort)(
      payeesWithMetadata
    );

    if (sort === "transactions") {
      sorted.reverse();
    }

    return (
      <Section noPadding>
        {sorted.map(payee => (
          <PayeeListItem
            key={payee.id}
            id={payee.id}
            name={payee.name}
            amount={payee.amount}
            transactions={payee.transactionCount}
            budgetId={budget.id}
          />
        ))}
      </Section>
    );
  }
}

export default Payees;

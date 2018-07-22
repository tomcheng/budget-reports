import React from "react";
import PropTypes from "prop-types";
import sumBy from "lodash/fp/sumBy";
import { getProcessedPayees } from "../utils";
import PayeeListItem from "./PayeeListItem";

const PayeesBody = ({ budget }) => {
  const {
    payeesById,
    // sortedByAmount,
    sortedByTransactions
  } = getProcessedPayees(budget);

  return sortedByTransactions.map(id => {
    const payee = payeesById[id];
    const amount = sumBy("amount")(payee.transactions);
    const transactions = payee.transactions.length;

    return (
      <PayeeListItem
        key={id}
        name={payee.name}
        amount={amount}
        transactions={transactions}
      />
    );
  });
};

PayeesBody.propTypes = {
  budget: PropTypes.object.isRequired
};

export default PayeesBody;

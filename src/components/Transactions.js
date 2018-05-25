import React from "react";
import PropTypes from "prop-types";
import Transaction from "./Transaction";

const Transactions = ({ transactions, payees }) => (
  <div style={{ margin: 20 }}>
    {transactions.map(({ id, payeeId, date, amount }) => (
      <Transaction
        key={id}
        payee={payees[payeeId]}
        date={date}
        amount={amount}
      />
    ))}
  </div>
);

Transactions.propTypes = {
  payees: PropTypes.object,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      payeeId: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Transactions;

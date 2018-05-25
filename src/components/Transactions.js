import React from "react";
import PropTypes from "prop-types";
import Transaction from "./Transaction";
import { StrongText, SecondaryText } from "./typeComponents";

const Transactions = ({ transactions, payees }) => (
  <div style={{ margin: 20 }}>
    <StrongText>Transactions</StrongText>
    {transactions.length ? (
      transactions.map(({ id, payeeId, date, amount }) => (
        <Transaction
          key={id}
          payee={payees[payeeId]}
          date={date}
          amount={amount}
        />
      ))
    ) : (
      <SecondaryText style={{ textAlign: "center", margin: 10 }}>
        No transactions this month
      </SecondaryText>
    )}
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

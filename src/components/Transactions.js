import React from "react";
import PropTypes from "prop-types";
import Transaction from "./Transaction";
import { StrongText, SecondaryText } from "./typeComponents";
import Section from "./Section";

const Transactions = ({ transactions, payeesById }) => (
  <Section>
    <StrongText>Transactions</StrongText>
    {transactions.length ? (
      transactions.map(({ id, payeeId, date, amount }) => (
        <Transaction
          key={id}
          payee={payeesById[payeeId]}
          date={date}
          amount={amount}
        />
      ))
    ) : (
      <SecondaryText style={{ textAlign: "center", margin: 10 }}>
        No transactions this month
      </SecondaryText>
    )}
  </Section>
);

Transactions.propTypes = {
  payeesById: PropTypes.object,
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

import React from "react";
import PropTypes from "prop-types";
import Transaction from "./Transaction";
import { SecondaryText } from "./typeComponents";
import Section from "./Section";

const Transactions = ({ transactions, payeesById, budgetId, linkToPayee }) => (
  <Section title="Transactions">
    {transactions.length ? (
      transactions.map(({ id, payeeId, date, amount }) => (
        <Transaction
          key={id}
          payee={payeesById[payeeId]}
          date={date}
          amount={amount}
          linkToPayee={linkToPayee}
          budgetId={budgetId}
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
  ).isRequired,
  budgetId: PropTypes.string,
  linkToPayee: PropTypes.bool
};

export default Transactions;

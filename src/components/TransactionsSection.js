import React from "react";
import PropTypes from "prop-types";
import CollapsibleSection from "./CollapsibleSection";
import Transaction from "./Transaction";
import NoTransactions from "./NoTransactions";

const TransactionsSection = ({
  transactions,
  title,
  payeesById,
  budgetId,
  linkToPayee
}) => (
  <CollapsibleSection title={title}>
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
      <NoTransactions />
    )}
  </CollapsibleSection>
);

TransactionsSection.propTypes = {
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
  linkToPayee: PropTypes.bool,
  title: PropTypes.string
};

TransactionsSection.defaultProps = { title: "Transactions" };

export default TransactionsSection;

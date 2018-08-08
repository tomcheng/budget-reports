import React from "react";
import PropTypes from "prop-types";
import CollapsibleSection from "./CollapsibleSection";
import Transaction from "./Transaction";
import NoTransactions from "./NoTransactions";

const TransactionsSection = ({
  transactions,
  title,
  categoriesById,
  payeesById
}) => (
  <CollapsibleSection title={title}>
    {transactions.length ? (
      transactions.map(({ id, categoryId, payeeId, date, amount }) => (
        <Transaction
          key={id}
          amount={amount}
          category={categoriesById[categoryId]}
          date={date}
          payee={payeesById[payeeId]}
        />
      ))
    ) : (
      <NoTransactions />
    )}
  </CollapsibleSection>
);

TransactionsSection.propTypes = {
  categoriesById: PropTypes.object.isRequired,
  payeesById: PropTypes.object.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      payeeId: PropTypes.string.isRequired
    })
  ).isRequired,
  title: PropTypes.string
};

TransactionsSection.defaultProps = { title: "Transactions" };

export default TransactionsSection;

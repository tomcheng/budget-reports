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
      transactions.map(
        ({
          id,
          category_id: categoryId,
          payee_id: payeeId,
          date,
          memo,
          amount
        }) => (
          <Transaction
            key={id}
            amount={amount}
            category={categoriesById[categoryId]}
            date={date}
            memo={memo}
            payee={payeesById[payeeId]}
          />
        )
      )
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
      category_id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      payee_id: PropTypes.string
    })
  ).isRequired,
  title: PropTypes.string
};

TransactionsSection.defaultProps = { title: "Transactions" };

export default TransactionsSection;

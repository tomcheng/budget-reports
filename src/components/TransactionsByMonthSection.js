import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import compose from "lodash/fp/compose";
import sortBy from "lodash/fp/sortBy";
import { getTransactionMonth } from "../utils";
import CollapsibleSection from "./CollapsibleSection";
import Transaction from "./Transaction";
import NoTransactions from "./NoTransactions";

const TransactionsByMonthSection = ({
  firstMonth,
  payeesById,
  selectedMonth,
  transactions
}) => {
  const transactionsForMonth = compose([
    sortBy("amount"),
    transactions =>
      transactions.filter(
        transaction => getTransactionMonth(transaction) === selectedMonth
      )
  ])(transactions);

  return (
    <CollapsibleSection
      title={`Transactions for ${moment(selectedMonth).format("MMMM")}`}
    >
      {transactionsForMonth.length ? (
        transactionsForMonth.map(({ id, date, amount, payeeId }) => (
          <Transaction
            key={id}
            amount={amount}
            payee={payeesById[payeeId]}
            date={date}
          />
        ))
      ) : (
        <NoTransactions />
      )}
    </CollapsibleSection>
  );
};

TransactionsByMonthSection.propTypes = {
  firstMonth: PropTypes.string.isRequired,
  payeesById: PropTypes.object.isRequired,
  selectedMonth: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default TransactionsByMonthSection;

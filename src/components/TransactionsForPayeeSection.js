import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getTransactionMonth } from "../utils";
import PayeeTransactionsSection from "./PayeeTransactionsSection";
import GroupedTransactionsSection from "./GroupedTransactionsSection";

const TransactionsForPayeeSection = ({ payeeName, selectedMonth, transactions }) =>
  selectedMonth ? (
    <PayeeTransactionsSection
      payeeName={payeeName}
      transactions={transactions.filter(
        transaction => getTransactionMonth(transaction) === selectedMonth
      )}
    />
  ) : (
    <GroupedTransactionsSection
      transactions={transactions}
      groupBy={getTransactionMonth}
      groupDisplayFunction={month => moment(month).format("MMMM YYYY")}
      leafDisplayFunction={transaction =>
        moment(transaction.date).format("dddd, MMMM D")
      }
    />
  );

TransactionsForPayeeSection.propTypes = {
  payeeName: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedMonth: PropTypes.string
};

export default TransactionsForPayeeSection;

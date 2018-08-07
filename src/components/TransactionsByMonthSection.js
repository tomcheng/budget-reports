import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { groupBy, sumByProp } from "../optimized";
import { getTransactionMonth, getMonthsToNow } from "../utils";
import CollapsibleSection from "./CollapsibleSection";
import ListItem from "./ListItem";
import Transaction from "./Transaction";
import { SecondaryText } from "./typeComponents";
import LabelWithTransactionCount from "./LabelWithTransactionCount";
import Amount from "./Amount";
import NoTransactions from "./NoTransactions";

const TransactionsByMonthSection = ({
  firstMonth,
  payeesById,
  selectedMonth,
  transactions,
  onSelectMonth
}) => (
  <CollapsibleSection
    title={
      selectedMonth
        ? `Transactions for ${moment(selectedMonth).format("MMMM YYYY")}`
        : "Transactions by Month"
    }
  >
    {selectedMonth ? (
      <WithSelectedMonth
        transactions={transactions}
        selectedMonth={selectedMonth}
        payeesById={payeesById}
      />
    ) : (
      <NoSelectedMonth
        onSelectMonth={onSelectMonth}
        firstMonth={firstMonth}
        transactions={transactions}
      />
    )}
  </CollapsibleSection>
);

TransactionsByMonthSection.propTypes = {
  firstMonth: PropTypes.string.isRequired,
  payeesById: PropTypes.object.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectMonth: PropTypes.func.isRequired,
  selectedMonth: PropTypes.string
};

const WithSelectedMonth = ({ transactions, selectedMonth, payeesById }) => {
  const transactionsForMonth = transactions.filter(
    transaction => getTransactionMonth(transaction) === selectedMonth
  );

  return transactionsForMonth.length ? (
    transactionsForMonth
      .reverse()
      .map(({ id, date, amount, payeeId }) => (
        <Transaction key={id} amount={amount} payee={payeesById[payeeId]} date={date} />
      ))
  ) : (
    <NoTransactions />
  );
};

const NoSelectedMonth = ({ firstMonth, transactions, onSelectMonth }) => {
  const months = getMonthsToNow(firstMonth);
  const transactionsByMonth = groupBy(getTransactionMonth)(transactions);

  return months.filter(month => !!transactionsByMonth[month]).map(month => (
    <ListItem
      key={month}
      onClick={() => {
        onSelectMonth(month);
      }}
    >
      <SecondaryText>
        <LabelWithTransactionCount
          label={moment(month).format("MMMM YYYY")}
          count={transactionsByMonth[month].length}
        />
      </SecondaryText>
      <SecondaryText>
        <Amount
          amount={sumByProp("amount")(transactionsByMonth[month])}
        />
      </SecondaryText>
    </ListItem>
  ));
};

export default TransactionsByMonthSection;

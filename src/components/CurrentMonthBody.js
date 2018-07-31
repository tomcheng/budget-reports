import React, { Fragment } from "react";
import PropTypes from "prop-types";
import takeWhile from "lodash/fp/takeWhile";
import {
  filterTransactions,
  splitTransactions,
  getTransactionMonth
} from "../utils";
import Section from "./Section";
import SpendingChart from "./SpendingChart";
import CurrentMonthTransactions from "./CurrentMonthTransactions";

const CurrentMonthBody = ({ budget, currentMonth, investmentAccounts }) => {
  const { expenseTransactions } = splitTransactions(budget);
  const transactions = filterTransactions({ budget, investmentAccounts })(
    expenseTransactions
  );
  const transactionsThisMonth = takeWhile(
    transaction => getTransactionMonth(transaction) === currentMonth
  )(transactions);

  return (
    <Fragment>
      <Section title="Overview">
        <SpendingChart
          transactions={transactions}
          budgetId={budget.id}
          currentMonth={currentMonth}
        />
      </Section>
      <Section title="Transactions">
        <CurrentMonthTransactions
          budget={budget}
          transactions={transactionsThisMonth}
        />
      </Section>
    </Fragment>
  );
};

CurrentMonthBody.propTypes = {
  budget: PropTypes.object.isRequired,
  currentMonth: PropTypes.string.isRequired,
  investmentAccounts: PropTypes.object.isRequired
};

export default CurrentMonthBody;

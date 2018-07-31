import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { filterTransactions, splitTransactions } from "../utils";
import Section from "./Section";
import SpendingChart from "./SpendingChart";
import CurrentMonthTransactions from "./CurrentMonthTransactions";

const CurrentMonthBody = ({ budget, currentMonth, investmentAccounts }) => {
  const { expenseTransactions } = splitTransactions(budget);
  const transactions = filterTransactions({ budget, investmentAccounts })(
    expenseTransactions
  );

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
          currentMonth={currentMonth}
          transactions={transactions}
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

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import takeWhile from "lodash/fp/takeWhile";
import {
  filterTransactions,
  splitTransactions,
  getTransactionMonth
} from "../utils";
import CurrentMonthOverview from "./CurrentMonthOverview";
import CurrentMonthCategoryGroups from "./CurrentMonthCategoryGroups";

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
      <CurrentMonthOverview
        budgetId={budget.id}
        currentMonth={currentMonth}
        transactions={transactions}
      />
      <CurrentMonthCategoryGroups
        budget={budget}
        transactions={transactionsThisMonth}
      />
    </Fragment>
  );
};

CurrentMonthBody.propTypes = {
  budget: PropTypes.object.isRequired,
  currentMonth: PropTypes.string.isRequired,
  investmentAccounts: PropTypes.object.isRequired
};

export default CurrentMonthBody;

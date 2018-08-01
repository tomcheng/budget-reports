import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import takeWhile from "lodash/fp/takeWhile";
import {
  filterTransactions,
  splitTransactions,
  getTransactionMonth
} from "../utils";
import CurrentMonthProgress from "./CurrentMonthProgress";
import CurrentMonthSpendingBreakdown from "./CurrentMonthSpendingBreakdown";

class CurrentMonthBody extends PureComponent {
  static propTypes = {
    budget: PropTypes.object.isRequired,
    currentMonth: PropTypes.string.isRequired,
    investmentAccounts: PropTypes.object.isRequired
  };

  render() {
    const { budget, currentMonth, investmentAccounts } = this.props;
    const { expenseTransactions } = splitTransactions(budget);
    const transactions = filterTransactions({ budget, investmentAccounts })(
      expenseTransactions
    );
    const transactionsThisMonth = takeWhile(
      transaction => getTransactionMonth(transaction) === currentMonth
    )(transactions);

    return (
      <Fragment>
        <CurrentMonthProgress
          budgetId={budget.id}
          currentMonth={currentMonth}
          transactions={transactions}
        />
        <CurrentMonthSpendingBreakdown
          budget={budget}
          transactions={transactionsThisMonth}
        />
      </Fragment>
    );
  }
}

export default CurrentMonthBody;

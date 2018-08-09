import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import takeWhile from "lodash/fp/takeWhile";
import {
  rejectTransferTransactions,
  splitTransactions,
  getTransactionMonth
} from "../utils";
import DayByDaySection from "./DayByDaySection";
import CurrentMonthGroupsSection from "./CurrentMonthGroupsSection";

class CurrentMonth extends PureComponent {
  static propTypes = {
    budget: PropTypes.object.isRequired,
    currentMonth: PropTypes.string.isRequired,
    investmentAccounts: PropTypes.object.isRequired
  };

  render() {
    const { budget, currentMonth, investmentAccounts } = this.props;
    const { expenseTransactions } = splitTransactions(budget);
    const transactions = rejectTransferTransactions({ budget, investmentAccounts })(
      expenseTransactions
    );
    const transactionsThisMonth = takeWhile(
      transaction => getTransactionMonth(transaction) === currentMonth
    )(transactions);

    return (
      <Fragment>
        <DayByDaySection
          budgetId={budget.id}
          currentMonth={currentMonth}
          transactions={transactions}
        />
        <CurrentMonthGroupsSection
          budget={budget}
          transactions={transactionsThisMonth}
        />
      </Fragment>
    );
  }
}

export default CurrentMonth;

import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import takeWhile from "lodash/fp/takeWhile";
import {
  getTransactionMonth,
  isTransfer,
  isStartingBalanceOrReconciliation,
  isIncome
} from "../budgetUtils";
import { notAny } from "../optimized";
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
    const { categoryGroupsById, categoriesById } = budget;

    const transactions = budget.transactions
      .filter(
        notAny([
          isIncome(budget),
          isTransfer(investmentAccounts),
          isStartingBalanceOrReconciliation(budget)
        ])
      )
      .filter(transaction => {
        const groupName =
          categoryGroupsById[
            categoriesById[transaction.category_id].category_group_id
          ].name;
        if (groupName.indexOf("Housing") > -1) {
          return false;
        }
        if (groupName.indexOf("Utilities") > -1) {
          return false;
        }
        if (groupName.indexOf("Subscriptions") > -1) {
          return false;
        }
        return true;
      });

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

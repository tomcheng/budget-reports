import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import maxBy from "lodash/maxBy";
import meanBy from "lodash/meanBy";
import minBy from "lodash/minBy";
import sortBy from "lodash/sortBy";
import sumBy from "lodash/sumBy";
import GetBudget from "./GetBudget";
import ExpensesVsIncomeChart from "./ExpensesVsIncomeChart";

class ExpensesVsIncome extends Component {
  static propTypes = {
    budgetId: PropTypes.string.isRequired,
    onRequestBudget: PropTypes.func.isRequired,
    budget: PropTypes.shape({
      id: PropTypes.string.isRequired,
      months: PropTypes.arrayOf(
        PropTypes.shape({
          month: PropTypes.string.isRequired
        })
      ).isRequired,
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          amount: PropTypes.number.isRequired,
          date: PropTypes.string.isRequired,
          transferAccountId: PropTypes.string
        })
      ).isRequired
    })
  };

  render() {
    const { budget, budgetId, onRequestBudget } = this.props;

    return (
      <GetBudget
        budgetId={budgetId}
        budgetLoaded={!!budget}
        onRequestBudget={onRequestBudget}
      >
        {() => {
          const transactionsByMonth = groupBy(
            budget.transactions,
            transaction => transaction.date.slice(0, 7)
          );
          const monthStats = sortBy(
            map(transactionsByMonth, (transactions, month) => ({
              month,
              income: sumBy(
                transactions.filter(
                  transaction =>
                    !transaction.transferAccountId && transaction.amount > 0
                ),
                "amount"
              ),
              expenses: sumBy(
                transactions.filter(
                  transaction =>
                    !transaction.transferAccountId && transaction.amount < 0
                ),
                "amount"
              )
            })),
            "month"
          ).slice(1);
          const max = maxBy(monthStats, s => s.income + s.expenses);
          const min = minBy(monthStats, s => s.income + s.expenses);
          const monthsToExclude = [max.month, min.month];
          const truncatedMonthStats = monthStats.filter(
            s => !monthsToExclude.includes(s.month)
          );

          return (
            <Fragment>
              <ExpensesVsIncomeChart data={monthStats} />
              <div>
                Average Income: {meanBy(truncatedMonthStats, s => s.income)}
              </div>
              <div>
                Average Expenses:{" "}
                {-meanBy(truncatedMonthStats, s => s.expenses)}
              </div>
              <div>
                Average Net Income:{" "}
                {meanBy(truncatedMonthStats, s => s.income + s.expenses)}
              </div>
            </Fragment>
          );
        }}
      </GetBudget>
    );
  }
}

export default ExpensesVsIncome;

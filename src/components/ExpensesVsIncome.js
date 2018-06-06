import React, { Component } from "react";
import PropTypes from "prop-types";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import mean from "lodash/mean";
import meanBy from "lodash/meanBy";
import sortBy from "lodash/sortBy";
import sumBy from "lodash/sumBy";
import GetBudget from "./GetBudget";
import Layout from "./Layout";
import BackToBudget from "./BackToBudget";
import { PageTitle } from "./typeComponents";
import TopNumbers from "./TopNumbers";
import ExpensesVsIncomeChart from "./ExpensesVsIncomeChart";
import PageActions from "./PageActions";
import Exclusions from "./Exclusions";
import Breakdown from "./Breakdown";

const standardDeviation = arr => {
  const avg = mean(arr);
  return Math.sqrt(sumBy(arr, num => Math.pow(num - avg, 2)) / arr.length);
};

const isIncome = transaction => transaction.amount > 0;
const isExpense = transaction => transaction.amount < 0;
const getMonth = transaction => transaction.date.slice(0, 7);

class ExpensesVsIncome extends Component {
  static propTypes = {
    budgetId: PropTypes.string.isRequired,
    onRefreshBudget: PropTypes.func.isRequired,
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

  state = {
    excludeOutliers: true,
    excludeFirstMonth: true,
    excludeCurrentMonth: true,
    selectedMonth: null
  };

  handleToggleExclusion = key => {
    this.setState(state => ({
      ...state,
      [key]: !state[key]
    }));
  };

  handleSelectMonth = month => {
    this.setState(state => ({
      ...state,
      selectedMonth: month === state.selectedMonth ? null : month
    }));
  };

  render() {
    const { budget, budgetId, onRefreshBudget, onRequestBudget } = this.props;
    const {
      excludeOutliers,
      excludeFirstMonth,
      excludeCurrentMonth,
      selectedMonth
    } = this.state;

    return (
      <GetBudget
        budgetId={budgetId}
        budgetLoaded={!!budget}
        onRequestBudget={onRequestBudget}
      >
        {() => {
          const transactionsByMonth = groupBy(
            budget.transactions.filter(
              transaction => !transaction.transferAccountId
            ),
            getMonth
          );

          let monthStats = sortBy(
            map(transactionsByMonth, (transactions, month) => ({
              month,
              income: sumBy(transactions.filter(isIncome), "amount"),
              expenses: sumBy(transactions.filter(isExpense), "amount")
            })),
            "month"
          );
          const selectedMonthStat = monthStats.find(
            s => s.month === selectedMonth
          );

          if (excludeFirstMonth) {
            monthStats = monthStats.slice(1);
          }

          if (excludeCurrentMonth) {
            monthStats = monthStats.slice(0, monthStats.length - 1);
          }

          let excludedMonths = [];

          if (excludeOutliers) {
            const nets = monthStats.map(s => s.income + s.expenses);
            const sd = standardDeviation(nets);
            const avg = mean(nets);
            excludedMonths = monthStats
              .filter(s => Math.abs(s.income + s.expenses - avg) > sd)
              .map(s => s.month);
          }

          const truncatedMonthStats = monthStats.filter(
            s => !excludedMonths.includes(s.month)
          );

          return (
            <Layout>
              <Layout.Header flushLeft flushRight>
                <BackToBudget budgetId={budgetId} />
                <PageTitle style={{ flexGrow: 1 }}>
                  Expenses vs Income
                </PageTitle>
                <PageActions
                  budgetId={budgetId}
                  onRefreshBudget={onRefreshBudget}
                />
              </Layout.Header>
              <Layout.Body>
                {selectedMonth ? (
                  <TopNumbers
                    numbers={[
                      {
                        label: "income",
                        value: selectedMonthStat.income
                      },
                      {
                        label: "expenses",
                        value: -selectedMonthStat.expenses
                      },
                      {
                        label: "net income",
                        value:
                          selectedMonthStat.income + selectedMonthStat.expenses
                      }
                    ]}
                    roundToDollar
                  />
                ) : (
                  <TopNumbers
                    numbers={[
                      {
                        label: "avg. income",
                        value: meanBy(truncatedMonthStats, s => s.income)
                      },
                      {
                        label: "avg. expenses",
                        value: -meanBy(truncatedMonthStats, s => s.expenses)
                      },
                      {
                        label: "avg. net income",
                        value: meanBy(
                          truncatedMonthStats,
                          s => s.income + s.expenses
                        )
                      }
                    ]}
                    roundToDollar
                  />
                )}
                <ExpensesVsIncomeChart
                  data={monthStats}
                  excludedMonths={excludedMonths}
                  selectedMonth={selectedMonth}
                  onSelectMonth={this.handleSelectMonth}
                />
                {!selectedMonth && (
                  <Exclusions
                    toggles={[
                      {
                        label: "first month",
                        key: "excludeFirstMonth",
                        value: excludeFirstMonth
                      },
                      {
                        label: "current month",
                        key: "excludeCurrentMonth",
                        value: excludeCurrentMonth
                      },
                      {
                        label: "outliers",
                        key: "excludeOutliers",
                        value: excludeOutliers
                      }
                    ]}
                    onToggle={this.handleToggleExclusion}
                  />
                )}
                {selectedMonth && (
                  <Breakdown
                    title="Expenses"
                    categories={budget.categories}
                    categoryGroups={budget.categoryGroups}
                    payees={budget.payees}
                    transactions={transactionsByMonth[selectedMonth].filter(
                      isExpense
                    )}
                  />
                )}
                {selectedMonth && (
                  <Breakdown
                    title="Income"
                    categories={budget.categories}
                    categoryGroups={budget.categoryGroups}
                    payees={budget.payees}
                    transactions={transactionsByMonth[selectedMonth]
                      .filter(isIncome)
                      .map(transaction => ({
                        ...transaction,
                        categoryId: null // don't bother grouping by category for income
                      }))}
                    reverse
                  />
                )}
              </Layout.Body>
            </Layout>
          );
        }}
      </GetBudget>
    );
  }
}

export default ExpensesVsIncome;

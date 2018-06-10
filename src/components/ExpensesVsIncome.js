import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import difference from "lodash/fp/difference";
import filter from "lodash/fp/filter";
import groupBy from "lodash/fp/groupBy";
import mapRaw from "lodash/fp/map";
import mean from "lodash/fp/mean";
import meanBy from "lodash/fp/meanBy";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import GetBudget from "./GetBudget";
import Layout from "./Layout";
import BackToBudget from "./BackToBudget";
import { PageTitle } from "./typeComponents";
import TopNumbers from "./TopNumbers";
import ExpensesVsIncomeChart from "./ExpensesVsIncomeChart";
import PageActions from "./PageActions";
import Exclusions from "./Exclusions";
import ExpensesBreakdown from "./ExpensesBreakdown";
import IncomeBreakdown from "./IncomeBreakdown";

const map = mapRaw.convert({ cap: false });

const standardDeviation = arr => {
  const avg = mean(arr);
  return Math.sqrt(sumBy(num => Math.pow(num - avg, 2))(arr) / arr.length);
};

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
          date: PropTypes.string.isRequired
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
          const {
            transactions,
            categoriesById,
            categoryGroupsById,
            payeesById
          } = budget;

          let monthStats = compose([
            sortBy("month"),
            map((transactions, month) => {
              const incomeTransactions = filter(
                transaction =>
                  transaction.amount > 0 &&
                  (!transaction.categoryId ||
                    !categoryGroupsById[
                      categoriesById[transaction.categoryId].categoryGroupId
                    ])
              )(transactions);
              const expenseTransactions = difference(
                transactions,
                incomeTransactions
              );

              return {
                month,
                incomeTransactions,
                expenseTransactions,
                income: sumBy("amount")(incomeTransactions),
                expenses: sumBy("amount")(expenseTransactions)
              };
            }),
            groupBy(getMonth)
          ])(transactions);

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
            const nets = map(s => s.income + s.expenses)(monthStats);
            const sd = standardDeviation(nets);
            const avg = mean(nets);
            excludedMonths = compose([
              map("month"),
              filter(s => Math.abs(s.income + s.expenses - avg) > sd)
            ])(monthStats);
          }

          const truncatedMonthStats = filter(
            s => !excludedMonths.includes(s.month)
          )(monthStats);

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
                        value: meanBy("income", truncatedMonthStats)
                      },
                      {
                        label: "avg. expenses",
                        value: -meanBy("expenses", truncatedMonthStats)
                      },
                      {
                        label: "avg. net income",
                        value: meanBy(
                          s => s.income + s.expenses,
                          truncatedMonthStats
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
                  <Fragment key={selectedMonth}>
                    <ExpensesBreakdown
                      categoriesById={categoriesById}
                      categoryGroupsById={categoryGroupsById}
                      payeesById={payeesById}
                      selectedMonth={selectedMonth}
                      transactions={selectedMonthStat.expenseTransactions}
                      totalIncome={selectedMonthStat.income}
                    />
                    <IncomeBreakdown
                      payeesById={payeesById}
                      selectedMonth={selectedMonth}
                      transactions={selectedMonthStat.incomeTransactions}
                    />
                  </Fragment>
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

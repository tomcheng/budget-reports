import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import difference from "lodash/fp/difference";
import filter from "lodash/fp/filter";
import find from "lodash/fp/find";
import flatMap from "lodash/fp/flatMap";
import groupBy from "lodash/fp/groupBy";
import includes from "lodash/fp/includes";
import mapRaw from "lodash/fp/map";
import matchesProperty from "lodash/fp/matchesProperty";
import mean from "lodash/fp/mean";
import meanBy from "lodash/fp/meanBy";
import prop from "lodash/fp/prop";
import reject from "lodash/fp/reject";
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

const propertyIncludedIn = (property, arr) => obj =>
  includes(obj[property], arr);

const standardDeviation = arr => {
  const avg = mean(arr);
  return Math.sqrt(sumBy(num => Math.pow(num - avg, 2))(arr) / arr.length);
};

const getMonth = transaction => transaction.date.slice(0, 7);

const isIncome = ({
  categoryGroupsById,
  categoriesById,
  transactions
}) => transaction => {
  const { categoryId, payeeId } = transaction;

  if (
    categoryId &&
    categoryGroupsById[categoriesById[categoryId].categoryGroupId]
  ) {
    return false;
  }

  return (
    compose([sumBy("amount"), filter(matchesProperty("payeeId", payeeId))])(
      transactions
    ) > 0
  );
};

const splitTransactions = ({
  categoryGroupsById,
  categoriesById,
  transactions
}) => {
  const incomeTransactions = filter(
    isIncome({ categoryGroupsById, categoriesById, transactions })
  )(transactions);
  const expenseTransactions = difference(transactions, incomeTransactions);

  return { incomeTransactions, expenseTransactions };
};

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

          let monthSummaries = compose([
            sortBy("month"),
            map((transactions, month) => {
              const {
                incomeTransactions,
                expenseTransactions
              } = splitTransactions({
                categoryGroupsById,
                categoriesById,
                transactions
              });

              return {
                month,
                transactions,
                incomeTransactions,
                expenseTransactions,
                income: sumBy("amount")(incomeTransactions),
                expenses: sumBy("amount")(expenseTransactions)
              };
            }),
            groupBy(getMonth)
          ])(transactions);

          const selectedMonthSummary = find(
            matchesProperty("month", selectedMonth)
          )(monthSummaries);

          if (excludeFirstMonth) {
            monthSummaries = monthSummaries.slice(1);
          }

          if (excludeCurrentMonth) {
            monthSummaries = monthSummaries.slice(0, monthSummaries.length - 1);
          }

          let excludedMonths = [];

          if (excludeOutliers) {
            const nets = map(s => s.income + s.expenses)(monthSummaries);
            const sd = standardDeviation(nets);
            const avg = mean(nets);
            excludedMonths = compose([
              map("month"),
              filter(s => Math.abs(s.income + s.expenses - avg) > sd)
            ])(monthSummaries);
          }

          const truncatedMonthSummaries = reject(
            propertyIncludedIn("month", excludedMonths)
          )(monthSummaries);

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
                        value: selectedMonthSummary.income
                      },
                      {
                        label: "expenses",
                        value: -selectedMonthSummary.expenses
                      },
                      {
                        label: "net income",
                        value:
                          selectedMonthSummary.income +
                          selectedMonthSummary.expenses
                      }
                    ]}
                    roundToDollar
                  />
                ) : (
                  <TopNumbers
                    numbers={[
                      {
                        label: "avg. income",
                        value: meanBy("income", truncatedMonthSummaries)
                      },
                      {
                        label: "avg. expenses",
                        value: -meanBy("expenses", truncatedMonthSummaries)
                      },
                      {
                        label: "avg. net income",
                        value: meanBy(
                          s => s.income + s.expenses,
                          truncatedMonthSummaries
                        )
                      }
                    ]}
                    roundToDollar
                  />
                )}
                <ExpensesVsIncomeChart
                  data={monthSummaries}
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
                {selectedMonth ? (
                  <Fragment key={selectedMonth}>
                    <ExpensesBreakdown
                      categoriesById={categoriesById}
                      categoryGroupsById={categoryGroupsById}
                      payeesById={payeesById}
                      selectedMonth={selectedMonth}
                      transactions={selectedMonthSummary.expenseTransactions}
                      totalIncome={selectedMonthSummary.income}
                    />
                    <IncomeBreakdown
                      payeesById={payeesById}
                      selectedMonth={selectedMonth}
                      transactions={selectedMonthSummary.incomeTransactions}
                    />
                  </Fragment>
                ) : (
                  <Fragment>
                    <ExpensesBreakdown
                      categoriesById={categoriesById}
                      categoryGroupsById={categoryGroupsById}
                      payeesById={payeesById}
                      transactions={flatMap(prop("expenseTransactions"))(
                        truncatedMonthSummaries
                      )}
                      totalIncome={meanBy("income")(truncatedMonthSummaries)}
                      months={truncatedMonthSummaries.length}
                    />
                    <IncomeBreakdown
                      payeesById={payeesById}
                      transactions={flatMap(prop("incomeTransactions"))(
                        truncatedMonthSummaries
                      )}
                      months={truncatedMonthSummaries.length}
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

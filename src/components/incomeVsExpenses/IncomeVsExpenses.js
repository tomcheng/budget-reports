import React, { Component } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import filter from "lodash/fp/filter";
import find from "lodash/fp/find";
import flatMap from "lodash/fp/flatMap";
import groupBy from "lodash/fp/groupBy";
import includes from "lodash/fp/includes";
import last from "lodash/fp/last";
import mapRaw from "lodash/fp/map";
import matchesProperty from "lodash/fp/matchesProperty";
import mean from "lodash/fp/mean";
import meanBy from "lodash/fp/meanBy";
import prop from "lodash/fp/prop";
import reject from "lodash/fp/reject";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import { splitTransactions } from "../../utils";
import EnsureBudgetLoaded from "../EnsureBudgetLoaded";
import Layout from "../common/Layout";
import BackToBudget from "../header/BackToBudget";
import { PageTitle } from "../common/typeComponents";
import IncomeVsExpensesSummaryForSingleMonth from "./IncomeVsExpensesSummaryForSingleMonth";
import IncomeVsExpensesSummaryForMultipleMonths from "./IncomeVsExpensesSummaryForMultipleMonths";
import ExpensesVsIncomeChart from "./ExpensesVsIncomeChart";
import PageActions from "../header/PageActions";
import Exclusions from "./Exclusions";
import BreakdownForSingleMonth from "./BreakdownForSingleMonth";
import BreakdownForMultipleMonths from "./BreakdownForMultipleMonths";

const map = mapRaw.convert({ cap: false });

const propertyIncludedIn = (property, arr) => obj =>
  includes(obj[property], arr);

const standardDeviation = arr => {
  const avg = mean(arr);
  return Math.sqrt(sumBy(num => Math.pow(num - avg, 2))(arr) / arr.length);
};

const getMonth = transaction => transaction.date.slice(0, 7);

class IncomeVsExpenses extends Component {
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

  getSummaries = ({ categoryGroupsById, categoriesById, transactions }) =>
    compose([
      sortBy("month"),
      map((transactions, month) => {
        const { incomeTransactions, expenseTransactions } = splitTransactions({
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

  getExcludedMonths = summaries => {
    const {
      excludeOutliers,
      excludeFirstMonth,
      excludeCurrentMonth,
      selectedMonth
    } = this.state;

    if (selectedMonth) {
      return [];
    }

    const excludedMonths = [];

    if (excludeFirstMonth) {
      excludedMonths.push(summaries[0].month);
    }

    if (excludeCurrentMonth) {
      excludedMonths.push(last(summaries).month);
    }

    if (excludeOutliers) {
      const remainingSummaries = reject(
        propertyIncludedIn("month", excludedMonths)
      )(summaries);
      const nets = map(s => s.income + s.expenses)(remainingSummaries);
      const sd = standardDeviation(nets);
      const avg = mean(nets);
      excludedMonths.push(
        ...compose([
          map("month"),
          filter(s => Math.abs(s.income + s.expenses - avg) > sd)
        ])(remainingSummaries)
      );
    }

    return excludedMonths;
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
      <EnsureBudgetLoaded
        budgetId={budgetId}
        budgetLoaded={!!budget}
        onRequestBudget={onRequestBudget}
      >
        {() => {
          const { categoriesById, categoryGroupsById, payeesById } = budget;

          const allSummaries = this.getSummaries(budget);
          const excludedMonths = this.getExcludedMonths(allSummaries);
          const summaries = reject(propertyIncludedIn("month", excludedMonths))(
            allSummaries
          );
          const selectedSummary = find(matchesProperty("month", selectedMonth))(
            allSummaries
          );

          return (
            <Layout>
              <Layout.Header flushLeft flushRight>
                <BackToBudget budgetId={budgetId} />
                <PageTitle style={{ flexGrow: 1 }}>
                  Income vs Expenses
                </PageTitle>
                <PageActions
                  budgetId={budgetId}
                  onRefreshBudget={onRefreshBudget}
                />
              </Layout.Header>
              <Layout.Body>
                {selectedMonth ? (
                  <IncomeVsExpensesSummaryForSingleMonth
                    income={selectedSummary.income}
                    expenses={selectedSummary.expenses}
                  />
                ) : (
                  <IncomeVsExpensesSummaryForMultipleMonths
                    averageExpenses={meanBy("expenses", summaries)}
                    averageIncome={meanBy("income", summaries)}
                  />
                )}
                <ExpensesVsIncomeChart
                  data={allSummaries}
                  excludedMonths={excludedMonths}
                  selectedMonth={selectedMonth}
                  onSelectMonth={this.handleSelectMonth}
                />
                {!selectedMonth && (
                  <Exclusions
                    toggles={[
                      {
                        label: "first",
                        key: "excludeFirstMonth",
                        value: excludeFirstMonth
                      },
                      {
                        label: "current",
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
                  <BreakdownForSingleMonth
                    key={selectedMonth}
                    categoriesById={categoriesById}
                    categoryGroupsById={categoryGroupsById}
                    payeesById={payeesById}
                    selectedMonth={selectedMonth}
                    expenseTransactions={selectedSummary.expenseTransactions}
                    incomeTransactions={selectedSummary.incomeTransactions}
                  />
                ) : (
                  <BreakdownForMultipleMonths
                    categoriesById={categoriesById}
                    categoryGroupsById={categoryGroupsById}
                    payeesById={payeesById}
                    transactions={flatMap(prop("transactions"))(summaries)}
                    months={summaries.length}
                  />
                )}
              </Layout.Body>
            </Layout>
          );
        }}
      </EnsureBudgetLoaded>
    );
  }
}

export default IncomeVsExpenses;

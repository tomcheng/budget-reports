import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import maxBy from "lodash/maxBy";
import meanBy from "lodash/meanBy";
import minBy from "lodash/minBy";
import sortBy from "lodash/sortBy";
import sumBy from "lodash/sumBy";
import GetBudget from "./GetBudget";
import Layout from "./Layout";
import BackToBudget from "./BackToBudget";
import { PageTitle } from "./typeComponents";
import Section from "./Section";
import Toggle from "./Toggle";
import TopNumbers from "./TopNumbers";
import { StrongText } from "./typeComponents";
import ExpensesVsIncomeChart from "./ExpensesVsIncomeChart";
import PageActions from "./PageActions";

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
    excludeCurrentMonth: true
  };

  handleToggleExcludedOutliers = () => {
    this.setState(state => ({
      ...state,
      excludeOutliers: !state.excludeOutliers
    }));
  };

  handleToggleExcludeFirstMonth = () => {
    this.setState(state => ({
      ...state,
      excludeFirstMonth: !state.excludeFirstMonth
    }));
  };

  handleExcludeCurrentMonth = () => {
    this.setState(state => ({
      ...state,
      excludeCurrentMonth: !state.excludeCurrentMonth
    }));
  };

  render() {
    const { budget, budgetId, onRefreshBudget, onRequestBudget } = this.props;
    const {
      excludeOutliers,
      excludeFirstMonth,
      excludeCurrentMonth
    } = this.state;

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

          let monthStats = sortBy(
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
          );

          if (excludeFirstMonth) {
            monthStats = monthStats.slice(1);
          }

          if (excludeCurrentMonth) {
            monthStats = monthStats.slice(0, monthStats.length - 1);
          }

          const excludedMonths = [];

          if (excludeOutliers) {
            excludedMonths.push(
              get(maxBy(monthStats, s => s.income + s.expenses), "month")
            );
            excludedMonths.push(
              get(minBy(monthStats, s => s.income + s.expenses), "month")
            );
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
                <ExpensesVsIncomeChart
                  data={monthStats}
                  excludedMonths={excludedMonths}
                />
                <Section>
                  <StrongText>Exclude:</StrongText>
                  <Toggle
                    label="first month"
                    value={excludeFirstMonth}
                    onToggle={this.handleToggleExcludeFirstMonth}
                  />
                  <Toggle
                    label="current month"
                    value={excludeCurrentMonth}
                    onToggle={this.handleExcludeCurrentMonth}
                  />
                  <Toggle
                    label="outliers"
                    value={excludeOutliers}
                    onToggle={this.handleToggleExcludedOutliers}
                  />
                </Section>
              </Layout.Body>
            </Layout>
          );
        }}
      </GetBudget>
    );
  }
}

export default ExpensesVsIncome;

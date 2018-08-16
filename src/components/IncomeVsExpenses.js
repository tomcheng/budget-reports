import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import find from "lodash/fp/find";
import flatMap from "lodash/fp/flatMap";
import mapRaw from "lodash/fp/map";
import matchesProperty from "lodash/fp/matchesProperty";
import sortBy from "lodash/fp/sortBy";
import { sumByProp, groupBy, simpleMemoize, notAny } from "../optimized";
import {
  getTransactionMonth,
  isTransfer,
  isIncome,
  isStartingBalanceOrReconciliation
} from "../budgetUtils";
import IncomeVsExpensesChart from "./IncomeVsExpensesChart";
import Breakdowns from "./Breakdowns";
import CollapsibleSection from "./CollapsibleSection";
import ChartNumbers from "./ChartNumbers";

const map = mapRaw.convert({ cap: false });

class IncomeVsExpenses extends PureComponent {
  static propTypes = {
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
    }).isRequired,
    investmentAccounts: PropTypes.object.isRequired,
    showing: PropTypes.oneOf(["average", "total"]).isRequired
  };

  state = { selectedMonth: null };

  handleToggleExclusion = key => {
    this.setState(state => ({
      ...state,
      [key]: !state[key]
    }));
  };

  handleSelectMonth = month => {
    this.setState(state => ({
      ...state,
      selectedMonth: state.selectedMonth === month ? null : month
    }));
  };

  getSummaries = simpleMemoize((budget, investmentAccounts) =>
    compose([
      sortBy("month"),
      map((transactions, month) => {
        const grouped = groupBy(isIncome(budget))(transactions);

        return {
          month,
          expenseTransactions: grouped.false || [],
          incomeTransactions: grouped.true || [],
          income: sumByProp("amount")(grouped.true || []),
          expenses: sumByProp("amount")(grouped.false || [])
        };
      }),
      groupBy(getTransactionMonth),
      transactions =>
        transactions.filter(
          notAny([
            isTransfer(investmentAccounts),
            isStartingBalanceOrReconciliation(budget)
          ])
        )
    ])(budget.transactions)
  );

  render() {
    const { budget, investmentAccounts, showing } = this.props;
    const { selectedMonth } = this.state;
    const { categoriesById, categoryGroupsById, payeesById } = budget;

    const showTotals = showing === "total";
    const allSummaries = this.getSummaries(budget, investmentAccounts);
    const summaries = selectedMonth
      ? [find(matchesProperty("month", selectedMonth))(allSummaries)]
      : allSummaries;

    const incomeTransactions = flatMap(summary => summary.incomeTransactions)(
      summaries
    );
    const expenseTransactions = flatMap(summary => summary.expenseTransactions)(
      summaries
    );

    const totalExpenses = sumByProp("amount")(expenseTransactions);
    const totalIncome = sumByProp("amount")(incomeTransactions);
    const denominator = showTotals ? 1 : summaries.length;

    return (
      <Fragment>
        <CollapsibleSection title="Monthly Trend">
          <ChartNumbers
            numbers={[
              {
                label: "net income",
                amount: -(totalExpenses + totalIncome) / denominator
              },
              {
                label: "expenses",
                amount: totalExpenses / denominator
              },
              {
                label: "income",
                amount: -totalIncome / denominator
              }
            ]}
          />
          <IncomeVsExpensesChart
            data={allSummaries}
            selectedMonth={selectedMonth}
            onSelectMonth={this.handleSelectMonth}
          />
        </CollapsibleSection>
        <Breakdowns
          categoriesById={categoriesById}
          categoryGroupsById={categoryGroupsById}
          payeesById={payeesById}
          expenseTransactions={expenseTransactions}
          incomeTransactions={incomeTransactions}
          divideBy={showTotals ? 1 : summaries.length}
        />
      </Fragment>
    );
  }
}

export default IncomeVsExpenses;

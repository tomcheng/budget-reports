import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import filter from "lodash/fp/filter";
import find from "lodash/fp/find";
import flatMap from "lodash/fp/flatMap";
import groupBy from "lodash/fp/groupBy";
import identity from "lodash/fp/identity";
import includes from "lodash/fp/includes";
import keys from "lodash/fp/keys";
import last from "lodash/fp/last";
import mapRaw from "lodash/fp/map";
import matchesProperty from "lodash/fp/matchesProperty";
import mean from "lodash/fp/mean";
import omit from "lodash/fp/omit";
import prop from "lodash/fp/prop";
import reject from "lodash/fp/reject";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import { splitTransactions, simpleMemoize } from "../utils";
import IncomeVsExpensesSummary from "./IncomeVsExpensesSummary";
import IncomeVsExpensesChart from "./IncomeVsExpensesChart";
import IncomeVsExpensesChartControls from "./IncomeVsExpensesChartControls";
import Breakdowns from "./Breakdowns";

const PAYEES_TO_EXCLUDE = [
  "Starting Balance",
  "Reconciliation Balance Adjustment"
];

const map = mapRaw.convert({ cap: false });

const propertyIncludedIn = (property, arr) => obj =>
  includes(obj[property], arr);

const standardDeviation = arr => {
  const avg = mean(arr);
  return Math.sqrt(sumBy(num => Math.pow(num - avg, 2))(arr) / arr.length);
};

const getMonth = transaction => transaction.date.slice(0, 7);

class IncomeVsExpensesBody extends PureComponent {
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
    }).isRequired
  };

  state = {
    showTotals: false,
    excludeOutliers: true,
    excludeFirstMonth: true,
    excludeCurrentMonth: true,
    selectedMonths: {}
  };

  handleToggleTotals = () => {
    this.setState(state => ({
      ...state,
      showTotals: !state.showTotals
    }));
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
      selectedMonths: state.selectedMonths[month]
        ? omit(month)(state.selectedMonths)
        : { ...state.selectedMonths, [month]: true }
    }));
  };

  handleClearSelectedMonths = () => {
    this.setState({ selectedMonths: {} });
  };

  getSelectedMonths = () =>
    compose([sortBy(identity), keys])(this.state.selectedMonths);

  getSummaries = simpleMemoize(
    ({ categoryGroupsById, categoriesById, transactions, payeesById }) =>
      compose([
        sortBy("month"),
        map((transactions, month) => {
          const { incomeTransactions, expenseTransactions } = splitTransactions(
            {
              categoryGroupsById,
              categoriesById,
              transactions
            }
          );

          return {
            month,
            transactions,
            income: sumBy("amount")(incomeTransactions),
            expenses: sumBy("amount")(expenseTransactions)
          };
        }),
        groupBy(getMonth),
        reject(transaction =>
          PAYEES_TO_EXCLUDE.includes(payeesById[transaction.payeeId].name)
        )
      ])(transactions)
  );

  getExcludedMonths = summaries => {
    const {
      excludeOutliers,
      excludeFirstMonth,
      excludeCurrentMonth
    } = this.state;
    const selectedMonths = this.getSelectedMonths();

    if (selectedMonths.length) {
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
    const { budget } = this.props;
    const {
      showTotals,
      excludeOutliers,
      excludeFirstMonth,
      excludeCurrentMonth
    } = this.state;
    const { categoriesById, categoryGroupsById, payeesById } = budget;

    const selectedMonths = this.getSelectedMonths();

    const allSummaries = this.getSummaries(budget);
    const excludedMonths = this.getExcludedMonths(allSummaries);
    const summaries = selectedMonths.length
      ? selectedMonths.map(month =>
          find(matchesProperty("month", month))(allSummaries)
        )
      : reject(propertyIncludedIn("month", excludedMonths))(allSummaries);

    const { incomeTransactions, expenseTransactions } = splitTransactions({
      categoryGroupsById,
      categoriesById,
      transactions: flatMap(prop("transactions"))(summaries)
    });

    return (
      <Fragment>
        <IncomeVsExpensesSummary
          incomeTransactions={incomeTransactions}
          expenseTransactions={expenseTransactions}
          divideBy={showTotals ? 1 : summaries.length}
          onToggleTotals={this.handleToggleTotals}
        />
        <IncomeVsExpensesChart
          data={allSummaries}
          excludedMonths={excludedMonths}
          selectedMonths={selectedMonths}
          onSelectMonth={this.handleSelectMonth}
        />
        <IncomeVsExpensesChartControls
          toggles={[
            {
              label: "exclude first",
              key: "excludeFirstMonth",
              value: excludeFirstMonth
            },
            {
              label: "exclude last",
              key: "excludeCurrentMonth",
              value: excludeCurrentMonth
            },
            {
              label: "exclude outliers",
              key: "excludeOutliers",
              value: excludeOutliers
            }
          ]}
          onToggle={this.handleToggleExclusion}
          onClearSelected={this.handleClearSelectedMonths}
          hasSelection={selectedMonths.length > 0}
        />
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

export default IncomeVsExpensesBody;

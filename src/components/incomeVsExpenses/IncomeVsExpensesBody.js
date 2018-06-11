import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import every from "lodash/fp/every";
import filter from "lodash/fp/filter";
import flatMap from "lodash/fp/flatMap";
import groupBy from "lodash/fp/groupBy";
import identity from "lodash/fp/identity";
import includes from "lodash/fp/includes";
import keys from "lodash/fp/keys";
import last from "lodash/fp/last";
import mapRaw from "lodash/fp/map";
import mean from "lodash/fp/mean";
import meanBy from "lodash/fp/meanBy";
import omit from "lodash/fp/omit";
import prop from "lodash/fp/prop";
import reject from "lodash/fp/reject";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import { splitTransactions, simpleMemoize } from "../../utils";
import IncomeVsExpensesSummary from "./IncomeVsExpensesSummary";
import IncomeVsExpensesChart from "./IncomeVsExpensesChart";
import Exclusions from "./Exclusions";
import Breakdowns from "./Breakdowns";

const map = mapRaw.convert({ cap: false });

const propertyIncludedIn = (property, arr) => obj =>
  includes(obj[property], arr);

const standardDeviation = arr => {
  const avg = mean(arr);
  return Math.sqrt(sumBy(num => Math.pow(num - avg, 2))(arr) / arr.length);
};

const getMonth = transaction => transaction.date.slice(0, 7);

class IncomeVsExpensesBody extends Component {
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

  constructor(props) {
    super();

    const { budget } = props;

    const summaries = this.getSummaries(budget);
    const outliers = this.getOutliers(budget);

    const excludedMonths = {};
    excludedMonths[summaries[0].month] = true;
    excludedMonths[last(summaries).month] = true;
    outliers.forEach(month => {
      excludedMonths[month] = true;
    });

    this.state = { excludedMonths };
  }

  getSummaries = simpleMemoize(
    ({ categoryGroupsById, categoriesById, transactions }) =>
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
        groupBy(getMonth)
      ])(transactions)
  );

  getOutliers = simpleMemoize(budget => {
    const summaries = this.getSummaries(budget);

    const nets = map(s => s.income + s.expenses)(summaries);
    const sd = standardDeviation(nets);
    const avg = mean(nets);

    return compose([
      map("month"),
      filter(s => Math.abs(s.income + s.expenses - avg) > sd)
    ])(summaries);
  });

  getExcludedMonths = () =>
    compose([sortBy(identity), keys])(this.state.excludedMonths);

  handleToggleExclusion = (key, next) => {
    const { budget } = this.props;
    const summaries = this.getSummaries(budget);
    const firstMonth = summaries[0].month;
    const lastMonth = last(summaries).month;
    const outliers = this.getOutliers(budget);

    switch (key) {
      case "first":
        this.setState(state => ({
          ...state,
          excludedMonths: next
            ? { ...state.excludedMonths, [firstMonth]: true }
            : omit(firstMonth)(state.excludedMonths)
        }));
        break;

      case "last":
        this.setState(state => ({
          ...state,
          excludedMonths: next
            ? { ...state.excludedMonths, [lastMonth]: true }
            : omit(lastMonth)(state.excludedMonths)
        }));
        break;

      case "outliers":
        this.setState(state => ({
          ...state,
          excludedMonths: next
            ? outliers.reduce(
                (ex, month) => ({ ...ex, [month]: true }),
                state.excludedMonths
              )
            : omit(outliers)(state.excludedMonths)
        }));
        break;

      default:
        break;
    }
    this.setState(state => ({
      ...state,
      [key]: !state[key]
    }));
  };

  handleToggleMonth = month => {
    this.setState(state => ({
      ...state,
      excludedMonths: state.excludedMonths[month]
        ? omit(month)(state.excludedMonths)
        : { ...state.excludedMonths, [month]: true }
    }));
  };

  render() {
    const { budget } = this.props;
    const { categoriesById, categoryGroupsById, payeesById } = budget;

    const allSummaries = this.getSummaries(budget);
    const excludedMonths = this.getExcludedMonths();
    const summaries = reject(propertyIncludedIn("month", excludedMonths))(
      allSummaries
    );

    const firstMonthExcluded = includes(allSummaries[0].month)(excludedMonths);
    const lastMonthExcluded = includes(last(allSummaries).month)(
      excludedMonths
    );
    const outliersExcluded = every(month => includes(month)(excludedMonths))(
      this.getOutliers(budget)
    );

    return (
      <Fragment>
        <IncomeVsExpensesSummary
          averageExpenses={meanBy("expenses", summaries)}
          averageIncome={meanBy("income", summaries)}
        />
        <IncomeVsExpensesChart
          data={allSummaries}
          excludedMonths={excludedMonths}
          onToggleMonth={this.handleToggleMonth}
        />
        <Exclusions
          toggles={[
            {
              label: "first",
              key: "first",
              value: firstMonthExcluded
            },
            {
              label: "last",
              key: "last",
              value: lastMonthExcluded
            },
            {
              label: "outliers",
              key: "outliers",
              value: outliersExcluded
            }
          ]}
          onToggle={this.handleToggleExclusion}
        />
        <Breakdowns
          categoriesById={categoriesById}
          categoryGroupsById={categoryGroupsById}
          payeesById={payeesById}
          transactions={flatMap(prop("transactions"))(summaries)}
          months={summaries.length}
        />
      </Fragment>
    );
  }
}

export default IncomeVsExpensesBody;

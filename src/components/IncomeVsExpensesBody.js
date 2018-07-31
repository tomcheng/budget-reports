import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import find from "lodash/fp/find";
import flatMap from "lodash/fp/flatMap";
import groupBy from "lodash/fp/groupBy";
import identity from "lodash/fp/identity";
import includes from "lodash/fp/includes";
import keys from "lodash/fp/keys";
import last from "lodash/fp/last";
import mapRaw from "lodash/fp/map";
import matchesProperty from "lodash/fp/matchesProperty";
import omit from "lodash/fp/omit";
import prop from "lodash/fp/prop";
import reject from "lodash/fp/reject";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import {
  filterTransactions,
  splitTransactions,
  simpleMemoize,
  getOutliersBy,
  getTransactionMonth
} from "../utils";
import IncomeVsExpensesSummary from "./IncomeVsExpensesSummary";
import IncomeVsExpensesChart from "./IncomeVsExpensesChart";
import IncomeVsExpensesChartControls from "./IncomeVsExpensesChartControls";
import Breakdowns from "./Breakdowns";
import Section, { Subsection, TopSection } from "./Section";

const map = mapRaw.convert({ cap: false });

const propertyIncludedIn = (property, arr) => obj =>
  includes(obj[property], arr);

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
    }).isRequired,
    investmentAccounts: PropTypes.object.isRequired,
    showing: PropTypes.oneOf(["average", "total"]).isRequired
  };

  state = {
    excludeOutliers: true,
    excludeFirstMonth: true,
    excludeCurrentMonth: true,
    selectedMonths: {}
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

  getSummaries = simpleMemoize((budget, investmentAccounts) =>
    compose([
      sortBy("month"),
      map((transactions, month) => {
        const { incomeTransactions, expenseTransactions } = splitTransactions({
          ...budget,
          transactions
        });

        return {
          month,
          transactions,
          income: sumBy("amount")(incomeTransactions),
          expenses: sumBy("amount")(expenseTransactions)
        };
      }),
      groupBy(getTransactionMonth),
      filterTransactions({ budget, investmentAccounts })
    ])(budget.transactions)
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
      const outliers = getOutliersBy(s => s.income + s.expenses)(
        remainingSummaries
      );
      excludedMonths.push(...map("month")(outliers));
    }

    return excludedMonths;
  };

  render() {
    const { budget, investmentAccounts, showing } = this.props;
    const {
      excludeOutliers,
      excludeFirstMonth,
      excludeCurrentMonth
    } = this.state;
    const { categoriesById, categoryGroupsById, payeesById } = budget;

    const showTotals = showing === "total";
    const selectedMonths = this.getSelectedMonths();
    const allSummaries = this.getSummaries(budget, investmentAccounts);
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
        <TopSection>
          <IncomeVsExpensesSummary
            incomeTransactions={incomeTransactions}
            expenseTransactions={expenseTransactions}
            divideBy={showTotals ? 1 : summaries.length}
          />
        </TopSection>
        <Section title="Monthly Trend">
          <Subsection>
            <IncomeVsExpensesChart
              data={allSummaries}
              excludedMonths={excludedMonths}
              selectedMonths={selectedMonths}
              onSelectMonth={this.handleSelectMonth}
            />
          </Subsection>
          <Subsection>
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
          </Subsection>
        </Section>
        <Breakdowns
          budgetId={budget.id}
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

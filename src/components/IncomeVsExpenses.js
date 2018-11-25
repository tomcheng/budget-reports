import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import find from "lodash/fp/find";
import flatMap from "lodash/fp/flatMap";
import mapRaw from "lodash/fp/map";
import matchesProperty from "lodash/fp/matchesProperty";
import sortBy from "lodash/fp/sortBy";
import { sumByProp, groupBy, simpleMemoize } from "../dataUtils";
import { getTransactionMonth, isIncome } from "../budgetUtils";
import IncomeVsExpensesChart from "./IncomeVsExpensesChart";
import Breakdowns from "./Breakdowns";
import CollapsibleSection from "./CollapsibleSection";
import ChartNumbers from "./ChartNumbers";
import MonthByMonthSettingsModal from "./MonthByMonthSettingsModal";
import { useSelectedMonth } from "../commonHooks";

const map = mapRaw.convert({ cap: false });

const getSummaries = simpleMemoize((transactions, investmentAccounts, budget) =>
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
    groupBy(getTransactionMonth)
  ])(transactions)
);

const IncomeVsExpenses = ({
  budget,
  excludeFirstMonth,
  excludeLastMonth,
  investmentAccounts,
  showing,
  transactions,
  onSetExclusion
}) => {
  const [selectedMonth, onSelectMonth] = useSelectedMonth();
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const { categoriesById, categoryGroupsById, payeesById } = budget;

  const showTotals = showing === "total";
  const allSummaries = getSummaries(transactions, investmentAccounts, budget);
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
      <CollapsibleSection
        title="Monthly Trend"
        hasSettings
        onClickSettings={() => {
          setSettingsModalOpen(true);
        }}
      >
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
          onSelectMonth={onSelectMonth}
        />
        <MonthByMonthSettingsModal
          excludeFirstMonth={excludeFirstMonth}
          excludeLastMonth={excludeLastMonth}
          open={settingsModalOpen}
          onClose={() => {
            setSettingsModalOpen(false);
          }}
          onSetExclusion={onSetExclusion}
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
};

IncomeVsExpenses.propTypes = {
  budget: PropTypes.shape({
    id: PropTypes.string.isRequired,
    months: PropTypes.arrayOf(
      PropTypes.shape({
        month: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired,
  excludeFirstMonth: PropTypes.bool.isRequired,
  excludeLastMonth: PropTypes.bool.isRequired,
  investmentAccounts: PropTypes.object.isRequired,
  showing: PropTypes.oneOf(["average", "total"]).isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired
    })
  ).isRequired,
  onSetExclusion: PropTypes.func.isRequired
};

export default IncomeVsExpenses;

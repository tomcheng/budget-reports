import React from "react";
import PropTypes from "prop-types";
import TopNumbers from "../common/TopNumbers";

const IncomeVsExpensesSummary = ({
  expenses,
  income,
  showTotals,
  onToggleTotals
}) => (
  <TopNumbers
    onClick={onToggleTotals}
    numbers={[
      {
        label: showTotals ? "total income" : "avg. income",
        value: income
      },
      {
        label: showTotals ? "total expenses" : "avg. expenses",
        value: -expenses
      },
      {
        label: showTotals ? "total net income" : "avg. net income",
        value: income + expenses
      }
    ]}
    roundToDollar
  />
);

IncomeVsExpensesSummary.propTypes = {
  expenses: PropTypes.number.isRequired,
  income: PropTypes.number.isRequired,
  showTotals: PropTypes.bool.isRequired,
  onToggleTotals: PropTypes.func.isRequired
};

export default IncomeVsExpensesSummary;

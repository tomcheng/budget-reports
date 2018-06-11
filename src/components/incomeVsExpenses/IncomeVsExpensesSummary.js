import React from "react";
import PropTypes from "prop-types";
import sumBy from "lodash/fp/sumBy";
import TopNumbers from "../common/TopNumbers";

const IncomeVsExpensesSummary = ({
  expenseTransactions,
  incomeTransactions,
  months,
  showTotals,
  onToggleTotals
}) => {
  const totalIncome = sumBy("amount")(incomeTransactions);
  const totalExpenses = sumBy("amount")(expenseTransactions);
  const denominator = showTotals ? 1 : months;

  return (
    <TopNumbers
      onClick={onToggleTotals}
      numbers={[
        {
          label: showTotals ? "total income" : "avg. income",
          value: totalIncome / denominator
        },
        {
          label: showTotals ? "total expenses" : "avg. expenses",
          value: -totalExpenses / denominator
        },
        {
          label: showTotals ? "total net income" : "avg. net income",
          value: (totalIncome + totalExpenses) / denominator
        }
      ]}
      roundToDollar
    />
  );
};

IncomeVsExpensesSummary.propTypes = {
  expenseTransactions: PropTypes.arrayOf(
    PropTypes.shape({ amount: PropTypes.number.isRequired })
  ).isRequired,
  incomeTransactions: PropTypes.arrayOf(
    PropTypes.shape({ amount: PropTypes.number.isRequired })
  ).isRequired,
  months: PropTypes.number.isRequired,
  showTotals: PropTypes.bool.isRequired,
  onToggleTotals: PropTypes.func.isRequired
};

export default IncomeVsExpensesSummary;

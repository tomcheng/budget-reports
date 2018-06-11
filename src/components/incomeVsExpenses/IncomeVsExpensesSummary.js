import React from "react";
import PropTypes from "prop-types";
import sumBy from "lodash/fp/sumBy";
import TopNumbers from "../common/TopNumbers";

const IncomeVsExpensesSummary = ({
  expenseTransactions,
  incomeTransactions,
  divideBy,
  showTotals,
  onToggleTotals
}) => {
  const totalIncome = sumBy("amount")(incomeTransactions);
  const totalExpenses = sumBy("amount")(expenseTransactions);
  const isAverage = divideBy !== 1;

  return (
    <TopNumbers
      onClick={onToggleTotals}
      numbers={[
        {
          label: isAverage ? "avg. income" : "total income",
          value: totalIncome / divideBy
        },
        {
          label: isAverage ? "avg. expenses" : "total expenses",
          value: -totalExpenses / divideBy
        },
        {
          label: isAverage ? "avg. net income" : "total net income",
          value: (totalIncome + totalExpenses) / divideBy
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
  divideBy: PropTypes.number.isRequired,
  onToggleTotals: PropTypes.func.isRequired
};

export default IncomeVsExpensesSummary;

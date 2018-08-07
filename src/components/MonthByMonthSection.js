import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getTransactionMonth, getMonthsToNow } from "../utils";
import { groupBy, sumByProp } from "../optimized";
import { lightPrimaryColor } from "../styleVariables";
import CollapsibleSection from "./CollapsibleSection";
import ChartNumbers from "./ChartNumbers";
import MonthlyChart from "./MonthlyChart";

const MonthByMonthSection = ({
  transactions,
  firstMonth,
  selectedMonth,
  onSelectMonth
}) => {
  const months = getMonthsToNow(firstMonth);
  let total = 0;
  let selectedMonthTotal = 0;

  const transactionsByMonth = groupBy(getTransactionMonth)(transactions);
  const data = months.map(month => {
    const amount = sumByProp("amount")(transactionsByMonth[month] || []);
    total += amount;
    if (month === selectedMonth) {
      selectedMonthTotal = amount;
    }

    return { month, amount: -amount };
  });

  const chartNumbers = selectedMonth
    ? [
        { amount: total / months.length, label: "avg. spent" },
        {
          amount: selectedMonthTotal,
          label: moment(selectedMonth).format("MMM YYYY")
        }
      ]
    : [
        { amount: total / months.length, label: "avg. spent" },
        {
          amount: total,
          label: "total spent"
        }
      ];

  return (
    <CollapsibleSection title="Month by Month">
      <ChartNumbers numbers={chartNumbers} />
      <MonthlyChart
        data={data}
        average={total / months.length}
        series={[{ color: lightPrimaryColor, valueFunction: d => d.amount }]}
        selectedMonths={selectedMonth && [selectedMonth]}
        onSelectMonth={onSelectMonth}
      />
    </CollapsibleSection>
  );
};

MonthByMonthSection.propTypes = {
  firstMonth: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectMonth: PropTypes.func.isRequired,
  selectedMonth: PropTypes.string
};

export default MonthByMonthSection;

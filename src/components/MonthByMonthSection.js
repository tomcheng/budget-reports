import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getTransactionMonth } from "../utils";
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
  const currentMonth = moment().format("YYYY-MM");
  const months = [firstMonth];
  let m = firstMonth;
  let total = 0;
  let selectedMonthTotal = 0;

  while (m !== currentMonth) {
    m = moment(m)
      .add(1, "months")
      .format("YYYY-MM");
    months.push(m);
  }

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
        {
          amount: selectedMonthTotal,
          label: moment(selectedMonth).format("MMM YYYY")
        }
      ]
    : [
        { amount: total / months.length, label: "spent/month" },
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
        series={[{ color: lightPrimaryColor, valueFunction: d => d.amount }]}
        selectedMonths={selectedMonth && [selectedMonth]}
        onSelectMonth={onSelectMonth}
      />
    </CollapsibleSection>
  );
};

MonthByMonthSection.propTypes = {
  firstMonth: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onSelectMonth: PropTypes.func.isRequired,
  selectedMonth: PropTypes.string
};

export default MonthByMonthSection;

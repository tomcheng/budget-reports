import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getMonthsToNow } from "../utils";
import { getTransactionMonth } from "../budgetUtils";
import { groupBy, sumByProp } from "../optimized";
import { lightPrimaryColor, lighterPrimaryColor } from "../styleVariables";
import CollapsibleSection from "./CollapsibleSection";
import ChartNumbers from "./ChartNumbers";
import MonthlyChart from "./MonthlyChart";

const MonthByMonthSection = ({
  transactions,
  firstMonth,
  selectedMonths,
  highlightFunction,
  onSelectMonth
}) => {
  const months = getMonthsToNow(firstMonth);
  let total = 0;
  let selectedMonthTotal = 0;

  const transactionsByMonth = groupBy(getTransactionMonth)(transactions);
  const data = months.map(month => {
    const grouped = groupBy(highlightFunction || (() => false))(
      transactionsByMonth[month] || []
    );
    const amount = sumByProp("amount")(grouped.false || []);
    const highlighted = sumByProp("amount")(grouped.true || []);
    total += highlightFunction ? highlighted : amount;
    if (selectedMonths.includes(month)) {
      selectedMonthTotal += highlightFunction ? highlighted : amount;
    }

    return { month, amount: -amount, highlighted: -highlighted };
  });

  const chartNumbers =
    selectedMonths.length > 0
      ? [
          { amount: total / months.length, label: "avg. spent" },
          {
            amount: selectedMonthTotal,
            label:
              selectedMonths.length === 1
                ? moment(selectedMonths[0]).format("MMM YYYY")
                : `${selectedMonths.length} months`
          }
        ]
      : [
          { amount: total / months.length, label: "avg. spent" },
          {
            amount: total,
            label: "total spent"
          }
        ];
  const series = [
    {
      color: highlightFunction ? lightPrimaryColor : lighterPrimaryColor,
      valueFunction: d => d.amount
    }
  ];

  if (highlightFunction) {
    series.push({
      color: lighterPrimaryColor,
      valueFunction: d => d.highlighted
    });
  }

  return (
    <CollapsibleSection title="Month by Month">
      <ChartNumbers numbers={chartNumbers} />
      <MonthlyChart
        data={data}
        average={total / months.length}
        series={series}
        selectedMonths={selectedMonths}
        onSelectMonth={onSelectMonth}
      />
    </CollapsibleSection>
  );
};

MonthByMonthSection.propTypes = {
  firstMonth: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectMonth: PropTypes.func.isRequired,
  highlightFunction: PropTypes.func,
  selectedMonth: PropTypes.string
};

export default MonthByMonthSection;

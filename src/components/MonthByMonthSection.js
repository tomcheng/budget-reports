import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getTransactionMonth } from "../budgetUtils";
import { groupBy, sumByProp } from "../dataUtils";
import { lightPrimaryColor, lighterPrimaryColor } from "../styleVariables";
import CollapsibleSection from "./CollapsibleSection";
import ChartNumbers from "./ChartNumbers";
import MonthlyChart from "./MonthlyChart";
import MonthByMonthSettingsModal from "./MonthByMonthSettingsModal";

const MonthByMonthSection = ({
  excludeFirstMonth,
  excludeLastMonth,
  highlightFunction,
  months,
  selectedMonth,
  title,
  transactions,
  onSelectMonth,
  onSetExclusion
}) => {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

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
    if (month === selectedMonth) {
      selectedMonthTotal = highlightFunction ? highlighted : amount;
    }

    return { month, amount: -amount, highlighted: -highlighted };
  });

  const chartNumbers = selectedMonth
    ? [
        { amount: total / months.length, label: "average" },
        {
          amount: selectedMonthTotal,
          label: moment(selectedMonth).format("MMM YYYY")
        }
      ]
    : [
        { amount: total / months.length, label: "average" },
        {
          amount: total,
          label: "total"
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
    <CollapsibleSection
      title={title}
      hasSettings
      onClickSettings={() => {
        setSettingsModalOpen(true);
      }}
      fullWidth
    >
      <ChartNumbers numbers={chartNumbers} />
      <MonthlyChart
        data={data}
        average={total / months.length}
        series={series}
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
  );
};

MonthByMonthSection.propTypes = {
  excludeFirstMonth: PropTypes.bool.isRequired,
  excludeLastMonth: PropTypes.bool.isRequired,
  months: PropTypes.arrayOf(PropTypes.string).isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectMonth: PropTypes.func.isRequired,
  onSetExclusion: PropTypes.func.isRequired,
  highlightFunction: PropTypes.func,
  selectedMonth: PropTypes.string,
  title: PropTypes.string
};

MonthByMonthSection.defaultProps = { title: "Month by Month" };

export default MonthByMonthSection;

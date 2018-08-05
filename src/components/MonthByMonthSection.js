import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getTransactionMonth } from "../utils";
import { groupBy, sumByProp } from "../optimized";
import { lightPrimaryColor } from "../styleVariables";
import CollapsibleSection from "./CollapsibleSection";
import MonthlyChart from "./MonthlyChart";

const MonthByMonthSection = ({ transactions, firstMonth, selectedMonth, onSelectMonth }) => {
  const currentMonth = moment().format("YYYY-MM");
  const months = [firstMonth];
  let m = firstMonth;

  while (m !== currentMonth) {
    m = moment(m)
      .add(1, "months")
      .format("YYYY-MM");
    months.push(m);
  }

  const transactionsByMonth = groupBy(getTransactionMonth)(transactions);
  const data = months.map(month => ({
    month,
    amount: -sumByProp("amount")(transactionsByMonth[month] || [])
  }));

  return (
    <CollapsibleSection title="Month by Month">
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

import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getTransactionMonth } from "../utils";
import { groupBy, sumByProp } from "../optimized";
import { lightPrimaryColor } from "../styleVariables";
import MonthlyChart from "./MonthlyChart";
import Section from "./Section";

const CategoryGroupMonthByMonthChart = ({ transactions, firstMonth }) => {
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
    <Section title="Month by Month">
      <div style={{ paddingTop: 10 }}>
        <MonthlyChart
          data={data}
          series={[{ color: lightPrimaryColor, valueFunction: d => d.amount }]}
        />
      </div>
    </Section>
  );
};

CategoryGroupMonthByMonthChart.propTypes = {
  firstMonth: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default CategoryGroupMonthByMonthChart;

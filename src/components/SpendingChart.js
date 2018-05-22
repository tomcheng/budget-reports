import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import groupBy from "lodash/groupBy";
import padStart from "lodash/padStart";
import range from "lodash/range";
import sumBy from "lodash/sumBy";
import head from "lodash/head";
import last from "lodash/last";
import moment from "moment";
import { primaryColor } from "../styleVariables";
import Chart from "./Chart";

const Label = styled.div`
  font-size: 11px;
  line-height: 14px;
  color: #888;
`;

const BudgetedLine = styled(Label)`
  text-align: right;
`;

const DateLabels = styled(Label)`
  border-top: 1px solid #ddd;
  padding-top: 5px;
  display: flex;
  justify-content: space-between;
`;

const SpendingChart = ({ budgeted, transactions, currentMonth }) => {
  const daysInMonth = moment(currentMonth).daysInMonth();
  const today = moment();
  const dates = range(1, daysInMonth + 1).map(day =>
    moment(`${currentMonth}-${padStart(day, 2, "0")}`)
  );
  const transactionsByDate = groupBy(transactions, "date");
  let cumulative = 0;
  const data = dates.map(date => {
    if (date.isAfter(today)) {
      return null;
    }

    const transactionsForDate =
      transactionsByDate[date.format("YYYY-MM-DD")] || [];
    cumulative += -sumBy(transactionsForDate, "amount");
    return cumulative;
  });
  const lineData = dates.map(
    (_, index) => index / (dates.length - 1) * budgeted
  );

  return (
    <div>
      <BudgetedLine>Budgeted: ${budgeted}</BudgetedLine>
      <Chart
        options={{
          chart: {
            spacing: [0, 0, 0, 0],
            height: 180
          },
          credits: { enabled: false },
          legend: { enabled: false },
          title: { text: "" },
          subtitle: { text: "" },
          xAxis: { visible: false },
          yAxis: { visible: false, endOnTick: false },
          tooltip: { enabled: false },
          series: [
            {
              type: "line",
              color: "#aaa",
              dashStyle: "Dot",
              lineWidth: 1,
              data: lineData,
              enableMouseTracking: false,
              marker: { enabled: false }
            },
            {
              type: "spline",
              data,
              enableMouseTracking: false,
              color: primaryColor,
              marker: { enabled: false }
            }
          ]
        }}
      />
      <DateLabels>
        <div>{head(dates).format("MMM D")}</div>
        <div>{last(dates).format("MMM D")}</div>
      </DateLabels>
    </div>
  );
};

SpendingChart.propTypes = {
  budgeted: PropTypes.number.isRequired,
  currentMonth: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired
    })
  ).isRequired
};

export default SpendingChart;

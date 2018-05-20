import React from "react";
import PropTypes from "prop-types";
import groupBy from "lodash/groupBy";
import padStart from "lodash/padStart";
import range from "lodash/range";
import sumBy from "lodash/sumBy";
import moment from "moment";
import Chart from "./Chart";

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
  const xAxisLabels = dates.map((m, index) => {
    if (index === 0 || index === dates.length - 1 || m.isSame(today, "day")) {
      return m.format("D");
    }
    return "";
  });
  const lineData = dates.map(
    (_, index) => index / (dates.length - 1) * budgeted
  );

  return (
    <div>
      <Chart
        options={{
          credits: {
            enabled: false
          },
          legend: {
            enabled: false
          },
          title: {
            text: null
          },
          xAxis: {
            categories: xAxisLabels,
            labels: {
              autoRotation: false,
              padding: 0
            },
            tickLength: 0,
            title: {
              text: null
            }
          },
          yAxis: {
            title: {
              text: null
            },
            showFirstLabel: false,
            min: 0,
            max: budgeted,
            tickInterval: budgeted,
            tickLength: 0
          },
          tooltip: {
            enabled: false
          },
          plotOptions: {
            spline: {
              marker: {
                enabled: false
              }
            }
          },
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
            { type: "spline", data, enableMouseTracking: false, color: "#6CF" }
          ]
        }}
      />
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

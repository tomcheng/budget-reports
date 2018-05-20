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
  const currentDay = parseInt(moment().format("D"), 10);
  const dates = range(1, currentDay + 1).map(day =>
    moment(`${currentMonth}-${padStart(day, 2, "0")}`)
  );
  const transactionsByDate = groupBy(transactions, "date");
  let cumulative = 0;
  const data = dates.map(date => {
    const transactionsForDate =
      transactionsByDate[date.format("YYYY-MM-DD")] || [];
    cumulative += -sumBy(transactionsForDate, "amount");
    return [date.valueOf(), cumulative];
  });
  const firstDay = moment(`${currentMonth}-01`).valueOf();
  const lastDay = moment(`${currentMonth}-${daysInMonth}`).valueOf();

  return (
    <div>
      <Chart
        options={{
          chart: {
            type: "spline"
          },
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
            type: "datetime",
            dateTimeLabelFormats: {
              day: "%b %e",
            },
            min: firstDay,
            max: lastDay,
            title: {
              text: null
            }
          },
          yAxis: {
            title: {
              text: null
            },
            min: 0,
            max: budgeted,
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
              data: [[firstDay, 0], [lastDay, budgeted]],
              enableMouseTracking: false,
              marker: { enabled: false }
            },
            { data, enableMouseTracking: false, color: "#6CF" }
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

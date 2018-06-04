import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import groupBy from "lodash/groupBy";
import range from "lodash/range";
import sumBy from "lodash/sumBy";
import head from "lodash/head";
import last from "lodash/last";
import moment from "moment";
import { primaryColor } from "../styleVariables";
import { MinorText } from "./typeComponents";
import Chart from "./Chart";

const DateLabels = styled.div`
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
`;

const SpendingChart = ({ total, transactions, currentMonth }) => {
  const daysInMonth = moment(currentMonth).daysInMonth();
  const today = moment();
  const dates = range(-1, daysInMonth).map(day =>
    moment(currentMonth).add(day, "days")
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
  const lineData = dates.map((_, index) => index / (dates.length - 1) * total);
  const firstDayOfWeek = parseInt(dates[0].format("d"), 10);
  const plotBands = range(6).map(num => ({
    color: "#fafafa",
    from: num * 7 - 1.5 - firstDayOfWeek,
    to: num * 7 + 0.5 - firstDayOfWeek
  }));

  return (
    <div style={{ margin: 20 }}>
      <Chart
        options={{
          chart: {
            spacing: [0, 0, 0, 0],
            height: 180
          },
          xAxis: {
            labels: { enabled: false },
            plotBands,
            tickLength: 0
          },
          yAxis: { visible: false, endOnTick: false },
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
        <MinorText>{head(dates).format("MMM D")}</MinorText>
        <MinorText>{last(dates).format("MMM D")}</MinorText>
      </DateLabels>
    </div>
  );
};

SpendingChart.propTypes = {
  currentMonth: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired
    })
  ).isRequired
};

export default SpendingChart;

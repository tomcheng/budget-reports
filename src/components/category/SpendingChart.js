import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import groupBy from "lodash/fp/groupBy";
import head from "lodash/fp/head";
import last from "lodash/fp/last";
import range from "lodash/fp/range";
import sumBy from "lodash/fp/sumBy";
import moment from "moment";
import { primaryColor, plotBandColor } from "../../styleVariables";
import { MinorText } from "../common/typeComponents";
import Section from "../common/Section";
import Chart from "../common/Chart";

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
  const transactionsByDate = groupBy("date")(transactions);
  let cumulative = 0;
  const data = dates.map(date => {
    if (date.isAfter(today)) {
      return null;
    }

    const transactionsForDate =
      transactionsByDate[date.format("YYYY-MM-DD")] || [];
    cumulative += -sumBy("amount")(transactionsForDate);
    return cumulative;
  });
  const lineData = dates.map((_, index) => index / (dates.length - 1) * total);
  const firstDayOfWeek = parseInt(dates[0].format("d"), 10);
  const plotBands = range(0, 6).map(num => ({
    color: plotBandColor,
    from: num * 7 - 1.5 - firstDayOfWeek,
    to: num * 7 + 0.5 - firstDayOfWeek
  }));

  return (
    <Section>
      <Chart
        options={{
          chart: { spacing: [0, 0, 0, 0], height: 180 },
          xAxis: {
            labels: { enabled: false },
            plotBands
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
    </Section>
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

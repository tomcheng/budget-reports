import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import groupBy from "lodash/fp/groupBy";
import head from "lodash/fp/head";
import last from "lodash/fp/last";
import range from "lodash/fp/range";
import sumBy from "lodash/fp/sumBy";
import moment from "moment";
import tinyColor from "tinycolor2";
import { primaryColor, plotBandColor } from "../styleVariables";
import { MinorText } from "./typeComponents";
import Section from "./Section";
import Chart from "./Chart";

const DateLabels = styled.div`
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
`;

const getData = ({ month, transactions }) => {
  const today = moment();
  const transactionsByDate = groupBy("date")(
    transactions.filter(transaction => transaction.date.slice(0, 7) === month)
  );
  let cumulative = 0;
  return range(-1, moment(month).daysInMonth()).map(numDays => {
    const date = moment(month).add(numDays, "days");
    if (date.isAfter(today)) {
      return null;
    }

    cumulative += -sumBy("amount")(
      transactionsByDate[date.format("YYYY-MM-DD")] || []
    );

    return cumulative;
  });
};

const SpendingChart = ({ total, transactions, currentMonth }) => {
  const monthsToCompare = 6;
  const dates = range(-1, moment(currentMonth).daysInMonth()).map(day =>
    moment(currentMonth).add(day, "days")
  );
  const data = getData({ month: currentMonth, transactions });
  const lineData = dates.map((_, index) => index / (dates.length - 1) * total);
  const firstDayOfWeek = parseInt(dates[0].format("d"), 10);
  const plotBands = range(0, 6).map(num => ({
    color: plotBandColor,
    from: num * 7 - 1.5 - firstDayOfWeek,
    to: num * 7 + 0.5 - firstDayOfWeek
  }));
  const comparisonSeries = range(1, monthsToCompare + 1).map(
    numMonths =>
      console.log(
        tinyColor
          .mix("#ccc", "#f5f5f5", numMonths / (monthsToCompare + 1) * 100)
          .toHex()
      ) || {
        type: "spline",
        data: getData({
          month: moment(currentMonth)
            .subtract(numMonths, "months")
            .format("YYYY-MM"),
          transactions
        }),
        enableMouseTracking: false,
        color:
          "#" +
          tinyColor
            .mix(
              primaryColor,
              "#f2f2f2",
              30 + numMonths * 70 / (monthsToCompare + 1)
            )
            .toHex(),
        lineWidth: 1,
        marker: { enabled: false }
      }
  );

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
            ...comparisonSeries,
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

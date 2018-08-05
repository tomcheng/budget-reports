import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import moment from "moment";
import tinyColor from "tinycolor2";
import compose from "lodash/fp/compose";
import groupBy from "lodash/fp/groupBy";
import head from "lodash/fp/head";
import isNumber from "lodash/fp/isNumber";
import last from "lodash/fp/last";
import range from "lodash/fp/range";
import sumBy from "lodash/fp/sumBy";
import takeWhile from "lodash/fp/takeWhile";
import { sumByProp } from "../optimized";
import { getTransactionMonth } from "../utils";
import { primaryColor, plotBandColor } from "../styleVariables";
import { MinorText, LargeNumber } from "./typeComponents";
import Chart from "./Chart";
import Amount from "./Amount";

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

class SpendingChart extends PureComponent {
  static propTypes = {
    budgetId: PropTypes.string.isRequired,
    currentMonth: PropTypes.string.isRequired,
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired
      })
    ).isRequired,
    total: PropTypes.number
  };

  render() {
    const { total, transactions, currentMonth, monthsToCompare } = this.props;

    const dates = range(-1, moment(currentMonth).daysInMonth()).map(day =>
      moment(currentMonth).add(day, "days")
    );
    const data = getData({ month: currentMonth, transactions });
    const lineData = dates.map(
      (_, index) => (index / (dates.length - 1)) * total
    );
    const firstDayOfWeek = parseInt(dates[0].format("d"), 10);
    const plotBands = range(0, 6).map(num => ({
      color: plotBandColor,
      from: num * 7 - 1.5 - firstDayOfWeek,
      to: num * 7 + 0.5 - firstDayOfWeek
    }));
    const comparisonSeries = range(monthsToCompare, 0).map(numMonths => ({
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
            30 + ((numMonths - 1) * 70) / monthsToCompare
          )
          .toHex(),
      lineWidth: 1,
      marker: { enabled: false }
    }));
    const spent = compose([
      sumByProp("amount"),
      takeWhile(
        transaction => getTransactionMonth(transaction) === currentMonth
      )
    ])(transactions);
    const available = isNumber(total) && total + spent;

    return (
      <Fragment>
        <div style={{ position: "relative" }}>
          <div
            style={{
              textAlign: "right",
              lineHeight: "16px",
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 8
            }}
          >
            {isNumber(available) && (
              <div style={{ marginRight: 20 }}>
                <LargeNumber style={{ lineHeight: "16px" }}>
                  <Amount amount={-available} />
                </LargeNumber>
                <MinorText>available</MinorText>
              </div>
            )}
            <div>
              <LargeNumber style={{ lineHeight: "16px" }}>
                <Amount amount={spent} />
              </LargeNumber>
              <MinorText>spent</MinorText>
            </div>
          </div>
          <Chart
            key={monthsToCompare}
            options={{
              chart: { spacing: [0, 0, 0, 0], height: 140 },
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
        </div>
        <DateLabels>
          <MinorText>{head(dates).format("MMM D")}</MinorText>
          <MinorText>{last(dates).format("MMM D")}</MinorText>
        </DateLabels>
      </Fragment>
    );
  }
}

export default SpendingChart;

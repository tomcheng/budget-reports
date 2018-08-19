import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import moment from "moment";
import tinyColor from "tinycolor2";
import compose from "lodash/fp/compose";
import isNumber from "lodash/fp/isNumber";
import padCharsStart from "lodash/fp/padCharsStart";
import range from "lodash/fp/range";
import sumBy from "lodash/fp/sumBy";
import takeWhile from "lodash/fp/takeWhile";
import { groupByProp, sumByProp } from "../dataUtils";
import { getTransactionMonth } from "../budgetUtils";
import { primaryColor, plotBandColor } from "../styleVariables";
import { MinorText } from "./typeComponents";
import Chart from "./Chart";
import ChartNumbers from "./ChartNumbers";

const DateLabels = styled.div`
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
`;

const getData = ({ month, transactionsByDate }) => {
  const today = moment().format("YYYY-MM-DD");
  let cumulative = 0;
  return range(-1, moment(month).daysInMonth()).map(numDays => {
    const date =
      numDays === -1
        ? moment(month).add(-1, "days")
        : `${month}-${padCharsStart("0")(2)(numDays + 1)}`;

    if (date > today) {
      return null;
    }

    cumulative += -sumBy("amount")(transactionsByDate[date] || []);

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
    const {
      total,
      transactions,
      highlightFunction,
      currentMonth,
      monthsToCompare
    } = this.props;

    const highlightedTransactions =
      highlightFunction && transactions.filter(highlightFunction);
    const highlightData =
      highlightedTransactions &&
      getData({
        month: currentMonth,
        transactionsByDate: groupByProp("date")(highlightedTransactions)
      });
    const highlightSeries = {
      type: "areaspline",
      data: highlightData,
      enableMouseTracking: false,
      marker: { enabled: false },
      animation: false,
      color: primaryColor,
      lineWidth: 0,
      fillOpacity: 0.8
    };
    const daysInMonth = moment(currentMonth).daysInMonth();
    const firstDate = moment(currentMonth).add(-1, "days");
    const lastDate = moment(currentMonth).add(daysInMonth - 1, "days");

    const transactionsByDate = groupByProp("date")(transactions);
    const data = getData({ month: currentMonth, transactionsByDate });
    const lineData = range(0, daysInMonth + 1).map(
      day => (day / daysInMonth) * total
    );
    const firstDayOfWeek = parseInt(firstDate.format("d"), 10);
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
        transactionsByDate
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
      marker: { enabled: false },
      animation: false
    }));

    const spent = compose([
      sumByProp("amount"),
      takeWhile(
        transaction => getTransactionMonth(transaction) === currentMonth
      )
    ])(transactions);
    const chartNumbers = [{ amount: spent, label: "spent" }];
    if (isNumber(total)) {
      chartNumbers.push({ amount: -(total + spent), label: "available" });
    }

    return (
      <Fragment>
        <ChartNumbers numbers={chartNumbers} />
        <Chart
          key={`${monthsToCompare}-${
            highlightFunction ? "highlight" : "no-highlight"
          }`}
          options={{
            chart: { spacing: [0, 0, 0, 0], height: 140, animation: false },
            xAxis: {
              labels: { enabled: false },
              plotBands
            },
            yAxis: { visible: false, endOnTick: false, startOnTick: false },
            series: [
              {
                type: "line",
                color: "#aaa",
                dashStyle: "Dot",
                lineWidth: 1,
                data: lineData,
                enableMouseTracking: false,
                marker: { enabled: false },
                animation: false
              },
              ...comparisonSeries,
              {
                type: "spline",
                data,
                enableMouseTracking: false,
                color: primaryColor,
                marker: { enabled: false },
                animation: false,
                ...(highlightFunction && {
                  type: "areaspline",
                  fillOpacity: 0.2
                })
              },
              highlightSeries
            ]
          }}
        />
        <DateLabels>
          <MinorText>{firstDate.format("MMM D")}</MinorText>
          <MinorText>{lastDate.format("MMM D")}</MinorText>
        </DateLabels>
      </Fragment>
    );
  }
}

export default SpendingChart;

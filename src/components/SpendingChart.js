import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import groupBy from "lodash/fp/groupBy";
import head from "lodash/fp/head";
import last from "lodash/fp/last";
import range from "lodash/fp/range";
import sumBy from "lodash/fp/sumBy";
import moment from "moment";
import tinyColor from "tinycolor2";
import AnimateHeight from "react-animate-height-auto";
import { getSetting, setSetting, SPENDING_MONTHS_TO_COMPARE } from "../uiRepo";
import { primaryColor, plotBandColor } from "../styleVariables";
import { MinorText, SecondaryText } from "./typeComponents";
import { GhostButton, PrimaryButton } from "./Button";
import Icon from "./Icon";
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

class SpendingChart extends Component {
  static propTypes = {
    budgetId: PropTypes.string.isRequired,
    currentMonth: PropTypes.string.isRequired,
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired
      })
    ).isRequired,
    total: PropTypes.number,
  };

  constructor(props) {
    super();
    this.state = {
      isEditingMonthsToCompare: false,
      monthsToCompare: getSetting(SPENDING_MONTHS_TO_COMPARE, props.budgetId),
      previousMonths: null
    };
  }

  handleClickEdit = () => {
    this.setState(state => ({
      ...state,
      isEditingMonthsToCompare: !state.isEditingMonthsToCompare,
      previousMonths: state.monthsToCompare
    }));
  };

  handleChangeMonths = evt => {
    const monthsToCompare = parseInt(evt.target.value, 10);
    this.setState({ monthsToCompare });
    setSetting(SPENDING_MONTHS_TO_COMPARE, this.props.budgetId, monthsToCompare);
  };

  handleClickSave = () => {
    this.setState({
      isEditingMonthsToCompare: false,
      previousMonths: null
    });
  };

  handleClickCancel = () => {
    setSetting(
      SPENDING_MONTHS_TO_COMPARE,
      this.props.budgetId,
      this.state.previousMonths
    );
    this.setState(state => ({
      ...state,
      monthsToCompare: state.previousMonths,
      isEditingMonthsToCompare: false,
      previousMonths: null
    }));
  };

  render() {
    const { total, transactions, currentMonth } = this.props;
    const { monthsToCompare, isEditingMonthsToCompare } = this.state;

    const dates = range(-1, moment(currentMonth).daysInMonth()).map(day =>
      moment(currentMonth).add(day, "days")
    );
    const data = getData({ month: currentMonth, transactions });
    const lineData = dates.map(
      (_, index) => index / (dates.length - 1) * total
    );
    const firstDayOfWeek = parseInt(dates[0].format("d"), 10);
    const plotBands = range(0, 6).map(num => ({
      color: plotBandColor,
      from: num * 7 - 1.5 - firstDayOfWeek,
      to: num * 7 + 0.5 - firstDayOfWeek
    }));
    const comparisonSeries = range(1, monthsToCompare + 1).map(numMonths => ({
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
    }));

    return (
      <Fragment>
        <div style={{ marginBottom: 5 }}>
          <MinorText
            style={{
              userSelect: "none",
              textAlign: "right",
              opacity: isEditingMonthsToCompare ? 0.4 : null
            }}
            onClick={this.handleClickEdit}
          >
            Showing last {monthsToCompare} month{monthsToCompare === 1
              ? ""
              : "s"}&nbsp;&nbsp;
            <Icon icon="pencil" />
          </MinorText>
          <AnimateHeight isExpanded={isEditingMonthsToCompare}>
            <Fragment>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 5
                }}
              >
                <SecondaryText>Number of months to show:</SecondaryText>
                <input
                  type="range"
                  value={monthsToCompare}
                  onChange={this.handleChangeMonths}
                  min={0}
                  max={12}
                  step={1}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "5px 0"
                }}
              >
                <GhostButton onClick={this.handleClickCancel}>
                  cancel
                </GhostButton>
                <PrimaryButton onClick={this.handleClickSave}>
                  Save
                </PrimaryButton>
              </div>
            </Fragment>
          </AnimateHeight>
        </div>
        <Chart
          key={monthsToCompare}
          options={{
            chart: { spacing: [0, 0, 0, 0], height: 180 },
            plotOptions: { series: { animation: false } },
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
      </Fragment>
    );
  }
}

export default SpendingChart;

import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import findIndex from "lodash/fp/findIndex";
import map from "lodash/fp/map";
import matchesProperty from "lodash/fp/matchesProperty";
import {
  plotBandColor,
  selectedPlotBandColor,
  primaryColor,
  lightPrimaryColor,
  negativeChartColor
} from "../../styleVariables";
import Section from "../common/Section";
import Chart from "../common/Chart";

const ExpensesVsIncomeChart = ({
  data,
  excludedMonths,
  onSelectMonth,
  selectedMonths
}) => {
  const excludedBands = map(month => {
    const index = findIndex(matchesProperty("month", month))(data);
    return { color: plotBandColor, from: index - 0.5, to: index + 0.5 };
  })(excludedMonths);
  const selectedBands = [];
  selectedMonths.forEach(month => {
    const index = findIndex(matchesProperty("month", month))(data);
    selectedBands.push({
      color: selectedPlotBandColor,
      from: index - 0.5,
      to: index + 0.5
    });
  });

  const categories = map(d => moment(d.month).format("MMM YY"))(data);

  return (
    <Section>
      <Chart
        options={{
          chart: {
            type: "column",
            events: {
              click: event => {
                onSelectMonth(data[Math.round(event.xAxis[0].value)].month);
              }
            }
          },
          xAxis: {
            categories,
            plotBands: selectedMonths.length ? selectedBands : excludedBands
          },
          yAxis: { title: { text: null } },
          plotOptions: { series: { stacking: "normal" } },
          series: [
            {
              borderWidth: 0,
              color: lightPrimaryColor,
              data: map("income")(data),
              enableMouseTracking: false,
              name: "Income",
              states: { hover: { brightness: 0 } }
            },
            {
              borderWidth: 0,
              color: negativeChartColor,
              data: map("expenses")(data),
              enableMouseTracking: false,
              name: "Expenses",
              states: { hover: { brightness: 0 } }
            },
            {
              color: primaryColor,
              data: map(d => d.income + d.expenses)(data),
              enableMouseTracking: false,
              name: "Net Income",
              type: "line"
            }
          ]
        }}
      />
    </Section>
  );
};

ExpensesVsIncomeChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      expenses: PropTypes.number.isRequired,
      income: PropTypes.number.isRequired,
      month: PropTypes.string.isRequired
    })
  ).isRequired,
  excludedMonths: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedMonths: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectMonth: PropTypes.func.isRequired
};

export default ExpensesVsIncomeChart;

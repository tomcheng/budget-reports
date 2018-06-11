import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import findIndex from "lodash/fp/findIndex";
import map from "lodash/fp/map";
import matchesProperty from "lodash/fp/matchesProperty";
import {
  plotBandColor,
  primaryColor,
  lightPrimaryColor,
  negativeChartColor
} from "../../styleVariables";
import Section from "../common/Section";
import Chart from "../common/Chart";

const IncomeVsExpensesChart = ({ data, excludedMonths, onToggleMonth }) => {
  const excludedBands = map(month => {
    const index = findIndex(matchesProperty("month", month))(data);
    return { color: plotBandColor, from: index - 0.5, to: index + 0.5 };
  })(excludedMonths);

  const yearLines = [];
  data.forEach(({ month }, index) => {
    if (moment(month).format("MMM") === "Jan") {
      yearLines.push({
        color: "#ccc",
        width: 1,
        value: index - 0.5,
        zIndex: 3
      });
    }
  });

  const categories = map(d => moment(d.month).format("MMM"))(data);

  return (
    <Section>
      <Chart
        options={{
          chart: {
            type: "column",
            events: {
              click: event => {
                onToggleMonth(data[Math.round(event.xAxis[0].value)].month);
              }
            }
          },
          xAxis: {
            categories,
            plotBands: excludedBands,
            plotLines: yearLines
          },
          yAxis: { labels: { enabled: false }, title: { text: null } },
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

IncomeVsExpensesChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      expenses: PropTypes.number.isRequired,
      income: PropTypes.number.isRequired,
      month: PropTypes.string.isRequired
    })
  ).isRequired,
  excludedMonths: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggleMonth: PropTypes.func.isRequired
};

export default IncomeVsExpensesChart;

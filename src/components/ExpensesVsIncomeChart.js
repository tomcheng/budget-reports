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
} from "../styleVariables";
import Section from "./Section";
import Chart from "./Chart";

const ExpensesVsIncomeChart = ({
  data,
  excludedMonths,
  onSelectMonth,
  selectedMonth
}) => {
  let plotBands = map(month => {
    const index = findIndex(matchesProperty("month", month))(data);
    return { color: plotBandColor, from: index - 0.5, to: index + 0.5 };
  })(excludedMonths);

  if (selectedMonth) {
    const index = findIndex(matchesProperty("month", selectedMonth))(data);
    plotBands = [
      {
        color: selectedPlotBandColor,
        from: index - 0.5,
        to: index + 0.5
      }
    ];
  }

  return (
    <Section>
      <Chart
        options={{
          chart: { type: "column" },
          xAxis: {
            categories: map(d => moment(d.month).format("MMM YY"))(data),
            plotBands
          },
          yAxis: {
            title: {
              text: null
            }
          },
          plotOptions: {
            series: {
              stacking: "normal",
              events: {
                click: ({ point }) => {
                  onSelectMonth(
                    moment(point.category, "MMM YY").format("YYYY-MM")
                  );
                }
              }
            }
          },
          series: [
            {
              borderWidth: 0,
              color: lightPrimaryColor,
              data: map("income")(data),
              name: "Income",
              states: { hover: { brightness: 0 } }
            },
            {
              borderWidth: 0,
              color: negativeChartColor,
              data: map("expenses")(data),
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
  onSelectMonth: PropTypes.func.isRequired,
  selectedMonth: PropTypes.string
};

export default ExpensesVsIncomeChart;

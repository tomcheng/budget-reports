import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import findIndex from "lodash/findIndex";
import property from "lodash/property";
import {
  plotBandColor,
  primaryColor,
  lightPrimaryColor,
  negativeChartColor
} from "../styleVariables";
import Section from "./Section";
import Chart from "./Chart";

const ExpensesVsIncomeChart = ({ data, excludedMonths, onSelectMonth }) => {
  const plotBands = excludedMonths.map(month => {
    const index = findIndex(data, d => d.month === month);
    return { color: plotBandColor, from: index - 0.5, to: index + 0.5 };
  });

  return (
    <Section>
      <Chart
        options={{
          chart: { type: "column" },
          xAxis: {
            categories: data.map(d => moment(d.month).format("MMM YY")),
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
              data: data.map(property("income")),
              name: "Income",
              states: { hover: { brightness: 0 } }
            },
            {
              borderWidth: 0,
              color: negativeChartColor,
              data: data.map(property("expenses")),
              name: "Expenses",
              states: { hover: { brightness: 0 } }
            },
            {
              color: primaryColor,
              data: data.map(d => d.income + d.expenses),
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
  onSelectMonth: PropTypes.func.isRequired
};

export default ExpensesVsIncomeChart;

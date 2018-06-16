import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import compose from "lodash/fp/compose";
import eq from "lodash/fp/eq";
import findIndex from "lodash/fp/findIndex";
import identity from "lodash/fp/identity";
import includes from "lodash/fp/includes";
import map from "lodash/fp/map";
import sortBy from "lodash/fp/sortBy";
import { selectedPlotBandColor } from "../styleVariables";
import Section from "./Section";
import Chart from "./Chart";

const FIRST_STACK = "liability";
const CREDIT_ACCOUNTS = ["mortgage", "creditCard"];
const getStack = type =>
  includes(type)(CREDIT_ACCOUNTS) ? "liability" : "asset";

const NetWorthChart = ({ data, months, selectedMonth, onSelectMonth }) => {
  const categories = map(month => moment(month).format("MMM"))(months);
  const selectedIndex = findIndex(eq(selectedMonth))(months);
  const plotBands = selectedMonth
    ? [
        {
          color: selectedPlotBandColor,
          from: selectedIndex - 0.5,
          to: selectedIndex + 0.5
        }
      ]
    : [];

  return (
    <Section>
      <Chart
        options={{
          chart: {
            type: "column",
            height: 220,
            events: {
              click: event => {
                onSelectMonth(months[Math.round(event.xAxis[0].value)]);
              }
            }
          },
          yAxis: { title: { text: null } },
          xAxis: { categories, plotBands },
          plotOptions: {
            column: { stacking: "normal" }
          },
          series: compose([
            sortBy(({ stack }) => (stack === FIRST_STACK ? 0 : 1)),
            map(({ data, name, type }) => ({
              name,
              data: map(
                compose([
                  n => Math.max(n, 0),
                  getStack(type) === "liability" ? n => -n : identity
                ])
              )(data),
              enableMouseTracking: false,
              stack: getStack(type)
            }))
          ])(data)
        }}
      />
    </Section>
  );
};

NetWorthChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })
  ).isRequired,
  months: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectMonth: PropTypes.func.isRequired,
  selectedMonth: PropTypes.string
};

export default NetWorthChart;

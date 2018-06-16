import React from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import identity from "lodash/fp/identity";
import includes from "lodash/fp/includes";
import map from "lodash/fp/map";
import sortBy from "lodash/fp/sortBy";
import Section from "./Section";
import Chart from "./Chart";

const FIRST_STACK = "liability";
const CREDIT_ACCOUNTS = ["mortgage", "creditCard"];
const getStack = type =>
  includes(type)(CREDIT_ACCOUNTS) ? "liability" : "asset";

const NetWorthChart = ({ data, categories }) => (
  <Section>
    <Chart
      options={{
        chart: {
          type: "column",
          height: 220
        },
        yAxis: { title: { text: null } },
        xAxis: {
          categories
        },
        plotOptions: {
          column: { stacking: "normal" }
        },
        series: compose([
          sortBy(({ stack }) => (stack === FIRST_STACK ? 0 : 1)),
          map(({ data, name, type }) => ({
            name,
            stack: getStack(type),
            data: map(
              compose([
                n => Math.max(n, 0),
                getStack(type) === "liability" ? n => -n : identity
              ])
            )(data)
          }))
        ])(data)
      }}
    />
  </Section>
);

NetWorthChart.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })
  ).isRequired
};

export default NetWorthChart;

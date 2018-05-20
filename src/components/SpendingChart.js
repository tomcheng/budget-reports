import React from "react";
import PropTypes from "prop-types";
import Chart from "./Chart";

const SpendingChart = () => (
  <div>
    <Chart
      options={{
        title: {
          text: "My chart"
        },
        series: [
          {
            data: [1, 2, 3]
          }
        ]
      }}
    />
  </div>
);

SpendingChart.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired
    })
  ).isRequired
};

export default SpendingChart;

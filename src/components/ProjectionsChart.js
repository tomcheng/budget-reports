import React from "react";
import PropTypes from "prop-types";
import {
  primaryColor,
  negativeColor,
  selectedPlotBandColor
} from "../styleVariables";
import Chart from "./Chart";

const ProjectionsChart = ({
  investmentsProjection,
  mortgageProjection,
  amountNeededToRetire,
  yearsUntilRetirement
}) => (
  <Chart
    options={{
      chart: {
        type: "column"
      },
      xAxis: {
        type: "category",
        plotBands: [
          {
            color: selectedPlotBandColor,
            from: Math.floor(yearsUntilRetirement) - 0.5,
            to: Math.floor(yearsUntilRetirement) + 0.5
          }
        ]
      },
      yAxis: {
        title: { text: null },
        endOnTick: false,
        plotLines: [
          {
            value: amountNeededToRetire,
            color: "#ccc",
            width: 1
          }
        ]
      },
      legend: {
        enabled: false
      },
      series: [
        { data: investmentsProjection, color: primaryColor, borderWidth: 0 },
        { data: mortgageProjection, color: negativeColor, borderWidth: 0 }
      ]
    }}
  />
);

ProjectionsChart.propTypes = {
  amountNeededToRetire: PropTypes.number.isRequired,
  investmentsProjection: PropTypes.arrayOf(PropTypes.number).isRequired,
  mortgageProjection: PropTypes.arrayOf(PropTypes.number).isRequired,
  yearsUntilRetirement: PropTypes.number.isRequired
};

export default ProjectionsChart;

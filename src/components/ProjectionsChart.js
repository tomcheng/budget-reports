import React from "react";
import PropTypes from "prop-types";
import { primaryColor, negativeColor } from "../styleVariables";
import Chart from "./Chart";
import Section from "./Section";

const ProjectionsChart = ({
  investmentsProjection,
  mortgageProjection,
  amountNeededToRetire
}) => (
  <Section>
    <Chart
      options={{
        chart: {
          type: "column"
        },
        xAxis: {
          type: "category"
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
  </Section>
);

ProjectionsChart.propTypes = {
  amountNeededToRetire: PropTypes.number.isRequired,
  investmentsProjection: PropTypes.arrayOf(PropTypes.number).isRequired,
  mortgageProjection: PropTypes.arrayOf(PropTypes.number).isRequired
};

export default ProjectionsChart;

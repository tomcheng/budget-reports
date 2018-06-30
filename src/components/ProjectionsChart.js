import React from "react";
import PropTypes from "prop-types";
import { primaryColor, negativeColor } from "../styleVariables";
import Chart from "./Chart";
import Section from "./Section";

const ProjectionsChart = ({ investmentsProjection, mortgageProjection }) => (
  <Section>
    <Chart
      options={{
        chart: {
          type: "column"
        },
        xAxis: {
          type: "category"
        },
        yAxis: { title: { text: null }, endOnTick: false },
        legend: {
          enabled: false
        },
        series: [
          { data: investmentsProjection, color: primaryColor },
          { data: mortgageProjection, color: negativeColor }
        ]
      }}
    />
  </Section>
);

ProjectionsChart.propTypes = {
  investmentsProjection: PropTypes.arrayOf(PropTypes.number).isRequired,
  mortgageProjection: PropTypes.arrayOf(PropTypes.number).isRequired
};

export default ProjectionsChart;

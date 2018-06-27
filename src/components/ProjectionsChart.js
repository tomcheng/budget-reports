import React from "react";
import PropTypes from "prop-types";
import Chart from "./Chart";
import Section from "./Section";

const ProjectionsChart = ({ projection }) => (
  <Section>
    <Chart
      options={{
        chart: {
          type: "column"
        },
        xAxis: {
          type: "category"
        },
        yAxis: { title: { text: null } },
        legend: {
          enabled: false
        },
        series: [
          {
            data: projection
          }
        ]
      }}
    />
  </Section>
);

ProjectionsChart.propTypes = {
  projection: PropTypes.arrayOf(PropTypes.number).isRequired
};

export default ProjectionsChart;

import React from "react";
import PropTypes from "prop-types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const CHART_DEFAULTS = {
  credits: { enabled: false },
  legend: { enabled: false },
  title: { text: "" },
  subtitle: { text: "" },
  tooltip: { enabled: false },
};

const Chart = ({ options }) => (
  <HighchartsReact
    highcharts={Highcharts}
    options={{ ...CHART_DEFAULTS, ...options }}
  />
);

Chart.propTypes = {
  options: PropTypes.object
};

export default Chart;

import React from "react";
import PropTypes from "prop-types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const CHART_DEFAULTS = {
  chart: { height: 240, spacing: [5, 5, 5, 5] },
  credits: { enabled: false },
  legend: { enabled: false },
  title: { text: "" },
  subtitle: { text: "" },
  tooltip: { enabled: false },
  xAxis: { tickLength: 0 }
};

const Chart = ({ options }) => (
  <HighchartsReact
    highcharts={Highcharts}
    options={{
      ...CHART_DEFAULTS,
      ...options,
      chart: { ...CHART_DEFAULTS.chart, ...options.chart },
      xAxis: { ...CHART_DEFAULTS.xAxis, ...options.xAxis }
    }}
  />
);

Chart.propTypes = {
  options: PropTypes.object
};

export default Chart;

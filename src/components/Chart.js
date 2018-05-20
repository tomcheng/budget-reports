import React from "react";
import PropTypes from "prop-types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const Chart = ({ options }) => (
  <HighchartsReact highcharts={Highcharts} options={options} />
);

Chart.propTypes = {
  options: PropTypes.object
};

export default Chart;

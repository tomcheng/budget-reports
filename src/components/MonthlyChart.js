import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import findIndex from "lodash/fp/findIndex";
import { selectedPlotBandColor } from "../styleVariables";
import Chart from "./Chart";

const MonthlyChart = ({
  average,
  data,
  height,
  series,
  selectedMonth,
  onSelectMonth
}) => {
  const yearLines = [];
  const plotBands = [];
  const categories = data.map(d => moment(d.month).format("MMM"));
  let highlights = null;

  if (selectedMonth) {
    highlights = { months: [selectedMonth], color: selectedPlotBandColor };
  }

  data.forEach(({ month }, index) => {
    if (moment(month).format("MMM") === "Jan") {
      yearLines.push({
        color: "#ccc",
        width: 1,
        value: index - 0.5,
        zIndex: 3
      });
    }
  });

  if (highlights) {
    highlights.months.forEach(month => {
      const index = findIndex(d => d.month === month)(data);
      plotBands.push({
        color: highlights.color,
        from: index - 0.5,
        to: index + 0.5
      });
    });
  }

  return (
    <Chart
      options={{
        chart: {
          animation: false,
          height,
          type: "column",
          events: {
            click: event => {
              onSelectMonth &&
                onSelectMonth(data[Math.round(event.xAxis[0].value)].month);
            }
          }
        },
        xAxis: {
          categories,
          plotBands,
          plotLines: yearLines
        },
        yAxis: {
          endOnTick: false,
          startOnTick: false,
          gridLineColor: "transparent",
          labels: { enabled: false },
          title: { text: null },
          plotLines: average && [
            {
              color: "#aaa",
              dashStyle: "Dot",
              width: 1,
              value: -average,
              zIndex: 2
            }
          ]
        },
        plotOptions: { series: { animation: false, stacking: "normal" } },
        series: series.map(s => {
          if (s.type === "line") {
            return {
              color: s.color,
              data: data.map(s.valueFunction),
              enableMouseTracking: false,
              type: "line"
            };
          }

          return {
            borderWidth: 0,
            color: s.color,
            data: data.map(s.valueFunction),
            enableMouseTracking: false,
            states: { hover: { brightness: 0 } }
          };
        })
      }}
    />
  );
};

MonthlyChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired
    })
  ).isRequired,
  series: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      valueFunction: PropTypes.func.isRequired,
      type: PropTypes.oneOf(["line"])
    })
  ).isRequired,
  average: PropTypes.number,
  height: PropTypes.number,
  selectedMonth: PropTypes.string,
  onSelectMonth: PropTypes.func
};

MonthlyChart.defaultProps = { height: 140 };

export default MonthlyChart;

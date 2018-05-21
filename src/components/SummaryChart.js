import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const CHART_HEIGHT = 3;

const Container = styled.div`
  width: 80px;
  height: ${CHART_HEIGHT}px;
  background-color: #ddd;
`;

const Progress = styled.div`
  height: ${CHART_HEIGHT}px;
  width: ${props => props.progress * 100}%;
  background-color: #4399ff;
`;

const SummaryChart = ({ progress }) => (
  <Container>
    <Progress progress={progress} />
  </Container>
);

SummaryChart.propTypes = {
  progress: PropTypes.number.isRequired
};

export default SummaryChart;

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import round from "lodash/round";
import SummaryChart from "./SummaryChart";

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 160px;
  justify-content: space-between;
`;

const CategorySummary = ({ activity, balance, monthProgress }) => (
  <Container>
    <SummaryChart
      progress={-activity / (balance - activity || 1)}
      indicator={monthProgress}
    />
    {round(balance)}
  </Container>
);

CategorySummary.propTypes = {
  activity: PropTypes.number.isRequired,
  balance: PropTypes.number.isRequired,
  monthProgress: PropTypes.number.isRequired
};

export default CategorySummary;

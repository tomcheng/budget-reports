import React from "react";
import PropTypes from "prop-types";
import {
  getMortgageRate,
  getReturnOnInvestments,
  getAverageContribution,
  getCurrentInvestments,
  getProjection
} from "../projectionUtils";
import Section from "./Section";

const ProjectionsBody = ({ budget }) => {
  const { rate, paymentsLeft } = getMortgageRate(budget);
  const returnOnInvestments = getReturnOnInvestments(budget);
  const averageContribution = getAverageContribution(budget);
  const currentInvestments = getCurrentInvestments(budget);
  const projection = getProjection({
    numMonths: 20 * 12,
    returnOnInvestments,
    averageContribution,
    currentInvestments
  });
  console.log("projection:", projection);

  return (
    <Section>
      <div>Mortgage Rate: {(rate * 100).toFixed(2)}</div>
      <div>Years remaining on mortgage: {(paymentsLeft / 12).toFixed(1)}</div>
      <div>Current Investments: {currentInvestments.toFixed(2)}</div>
      <div>
        Average return on investments: {(returnOnInvestments * 100).toFixed(2)}
      </div>
      <div>Average monthly contribution: {averageContribution.toFixed(2)}</div>
    </Section>
  );
};

ProjectionsBody.propTypes = {
  budget: PropTypes.shape({
    transactions: PropTypes.array.isRequired
  }).isRequired
};

export default ProjectionsBody;

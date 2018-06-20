import React from "react";
import PropTypes from "prop-types";
import {
  getMortgageRate,
  getReturnOnInvestments,
  getAverageContribution,
  getCurrentInvestments,
  getAverageExpensesWithoutMortgage,
  getProjection
} from "../projectionUtils";
import Section from "./Section";

const ProjectionsBody = ({ budget }) => {
  const { rate, paymentsLeft, mortgagePayment } = getMortgageRate(budget);
  const returnOnInvestments = getReturnOnInvestments(budget);
  const averageContribution = getAverageContribution(budget);
  const currentInvestments = getCurrentInvestments(budget);
  const averageExpenses = getAverageExpensesWithoutMortgage(budget);
  const projection = getProjection({
    numMonths: 30 * 12,
    returnOnInvestments,
    averageContribution,
    currentInvestments
  });
  const retirementReturns = 0.04;
  const monthlyRetirementReturn = (1 + retirementReturns) ** (1 / 12) - 1;
  let m = 0;

  while (m < projection.length) {
    if (m <= paymentsLeft) {
      const remainingMortgage = mortgagePayment * (paymentsLeft - m);
      if (
        (projection[m] - remainingMortgage) * monthlyRetirementReturn >
        averageExpenses
      ) {
        break;
      }
    } else {
      if (projection[m] * monthlyRetirementReturn > averageExpenses) {
        break;
      }
    }
    m += 1;
  }

  const yearsUntilRetirement = m / 12;

  return (
    <Section>
      <div>Mortgage Rate: {(rate * 100).toFixed(2)}</div>
      <div>Years remaining on mortgage: {(paymentsLeft / 12).toFixed(1)}</div>
      <div>Mortgage payment: {mortgagePayment.toFixed(2)}</div>
      <div>Current Investments: {currentInvestments.toFixed(2)}</div>
      <div>
        Average return on investments: {(returnOnInvestments * 100).toFixed(2)}
      </div>
      <div>Average monthly contribution: {averageContribution.toFixed(2)}</div>
      <div>Average expenses without mortgage: {averageExpenses.toFixed(2)}</div>
      <div>Years until retirement: {yearsUntilRetirement.toFixed(1)}</div>
    </Section>
  );
};

ProjectionsBody.propTypes = {
  budget: PropTypes.shape({
    transactions: PropTypes.array.isRequired
  }).isRequired
};

export default ProjectionsBody;

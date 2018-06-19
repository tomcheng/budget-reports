import React from "react";
import PropTypes from "prop-types";
import { getMortgageRate, getReturnOnInvestments } from "../projectionUtils";
import Section from "./Section";

const ProjectionsBody = ({ budget }) => {
  const { rate, paymentsLeft } = getMortgageRate(budget);
  const returnOnInvestments = getReturnOnInvestments(budget);

  return (
    <Section>
      <div>Mortgage Rate: {(rate * 100).toFixed(2)}</div>
      <div>Years remaining on mortgage: {(paymentsLeft / 12).toFixed(1)}</div>
      <div>
        Average return on investments: {(returnOnInvestments * 100).toFixed(2)}
      </div>
    </Section>
  );
};

ProjectionsBody.propTypes = {
  budget: PropTypes.shape({
    transactions: PropTypes.array.isRequired
  }).isRequired
};

export default ProjectionsBody;

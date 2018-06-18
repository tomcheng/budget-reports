import React from "react";
import PropTypes from "prop-types";
import { getMortgageRate } from "../projectionUtils";

const ProjectionsBody = ({ budget }) => {
  const { rate, paymentsLeft } = getMortgageRate(budget);
  return (
    <div>
      rate: {(rate * 100).toFixed(2)}, years left:{" "}
      {(paymentsLeft / 12).toFixed(1)}
    </div>
  );
};

ProjectionsBody.propTypes = {
  budget: PropTypes.shape({
    transactions: PropTypes.array.isRequired
  }).isRequired
};

export default ProjectionsBody;

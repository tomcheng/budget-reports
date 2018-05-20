import React from "react";
import PropTypes from "prop-types";

const Unauthorized = ({ onAuthorize }) => (
  <div>
    <button onClick={onAuthorize}>Authorize YNAB</button>
  </div>
);

Unauthorized.propTypes = {
  onAuthorize: PropTypes.func.isRequired
};

export default Unauthorized;

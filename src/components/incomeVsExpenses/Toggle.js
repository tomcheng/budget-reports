import React from "react";
import PropTypes from "prop-types";
import Button from "../common/Button";

const Toggle = ({ label, value, onToggle }) => (
  <Button onClick={onToggle} style={{ opacity: value ? 1 : 0.4 }}>
    {label}
  </Button>
);

Toggle.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default Toggle;

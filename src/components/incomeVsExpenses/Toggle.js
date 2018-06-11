import React from "react";
import PropTypes from "prop-types";

const Toggle = ({ label, value, onToggle }) => (
  <label
    style={{
      display: "flex",
      alignItems: "center",
      height: 40,
      marginRight: 20,
      userSelect: "none",
      opacity: value ? 1 : 0.5
    }}
  >
    <input
      type="checkbox"
      checked={value}
      onChange={onToggle}
      style={{ marginRight: 8 }}
    />
    {label}
  </label>
);

Toggle.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default Toggle;

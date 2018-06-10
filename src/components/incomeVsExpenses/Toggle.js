import React from "react";
import PropTypes from "prop-types";

const Toggle = ({ label, value, onToggle }) => (
  <label
    style={{
      display: "flex",
      alignItems: "center",
      height: 40,
      marginLeft: 20,
      userSelect: "none"
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

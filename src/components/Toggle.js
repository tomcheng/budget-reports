import React from "react";
import PropTypes from "prop-types";

const Toggle = ({ label, value, onToggle }) => (
  <div>
    <label>
      <input
        type="checkbox"
        checked={value}
        onChange={onToggle}
        style={{ marginRight: 8 }}
      />
      {label}
    </label>
  </div>
);

Toggle.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default Toggle;

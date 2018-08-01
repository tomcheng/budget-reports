import React from "react";
import PropTypes from "prop-types";

const Field = ({ label, onChange, ...other }) => (
  <div>
    <label>{label}</label>
    <input
      {...other}
      onChange={evt => {
        onChange({
          name: evt.target.name,
          value: parseFloat(evt.target.value)
        });
      }}
    />
  </div>
);

Field.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Field;

import React from "react";
import PropTypes from "prop-types";
import { MinorText, SecondaryText } from "./typeComponents";
import Dropdown from "./Dropdown";

const SortDropdown = ({ options, selected, onChange }) => (
  <Dropdown
    dropdownContent={({ onClose }) =>
      options.map(({ label, value }) => (
        <Dropdown.Option
          key={value}
          onClick={() => {
            onChange(value);
            onClose();
          }}
          isSelected={value === selected}
        >
          {label}
        </Dropdown.Option>
      ))
    }
    align="right"
  >
    {({ triggerStyle, onClick, ref }) => (
      <div
        style={{ ...triggerStyle, textAlign: "right" }}
        onClick={onClick}
        ref={ref}
      >
        <MinorText>Sort by:</MinorText>
        <SecondaryText style={{ lineHeight: "16px" }}>
          {options.find(option => option.value === selected).label}
        </SecondaryText>
      </div>
    )}
  </Dropdown>
);

SortDropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired,
  selected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default SortDropdown;

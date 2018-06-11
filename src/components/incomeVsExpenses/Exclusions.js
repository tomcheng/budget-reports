import React from "react";
import PropTypes from "prop-types";
import Section from "../common/Section";
import Toggle from "./Toggle";
import { StrongText } from "../common/typeComponents";

const Exclusions = ({ toggles, onToggle }) => (
  <Section style={{ display: "flex", alignItems: "center" }}>
    <StrongText>Exclude:</StrongText>
    {toggles.map(({ label, key, value }) => (
      <Toggle
        key={key}
        label={label}
        value={value}
        onToggle={() => {
          onToggle(key, !value);
        }}
      />
    ))}
  </Section>
);

Exclusions.propTypes = {
  toggles: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      value: PropTypes.bool.isRequired
    })
  ).isRequired,
  onToggle: PropTypes.func.isRequired
};

export default Exclusions;

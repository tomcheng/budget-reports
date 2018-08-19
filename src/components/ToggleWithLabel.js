import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Toggle from "./Toggle";

const Container = styled.div`
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
`;

const Label = styled.div``;

const ToggleWithLabel = ({ label, name, checked, onChange }) => (
  <Container
    onClick={() => {
      onChange({ target: { name, checked: !checked } });
    }}
  >
    <Label>{label}</Label>
    <Toggle
      on={checked}
      onClick={() => {
        onChange({ target: { name, checked: !checked } });
      }}
    />
  </Container>
);

ToggleWithLabel.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

export default ToggleWithLabel;

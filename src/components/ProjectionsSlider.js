import React from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import AnimateHeight from "react-animate-height-auto";
import Button from "./Button";

const bodyEl = document.getElementsByTagName("body")[0];

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
`;

const ProjectionsSlider = ({
  name,
  formatter,
  label,
  value,
  onChange,
  onReset,
  rangeOptions
}) =>
  createPortal(
    <Container>
      <AnimateHeight isExpanded={!!name}>
        <div style={{ borderTop: "1px solid #bbb", padding: "15px 20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15
            }}
          >
            {label}: {formatter(value || 0)}
            <Button
              onClick={() => {
                onReset(name);
              }}
            >
              reset
            </Button>
          </div>
          <Range
            {...rangeOptions}
            name={name}
            value={value || 0}
            onChange={onChange}
          />
        </div>
      </AnimateHeight>
    </Container>,
    bodyEl
  );

ProjectionsSlider.propTypes = {
  onChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  formatter: PropTypes.func,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.number
};

ProjectionsSlider.defaultProps = {
  formatter: val => val
};

const Range = ({ name, onReset, ...other }) => (
  <input
    {...other}
    name={name}
    type="range"
    style={{ display: "block", width: "100%" }}
  />
);

export default ProjectionsSlider;

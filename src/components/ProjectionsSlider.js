import React from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import AnimateHeight from "react-animate-height-auto";
import Section from "./Section";

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
  label,
  value,
  onChange,
  onReset,
  rangeOptions
}) =>
  createPortal(
    <Container>
      <AnimateHeight isExpanded={!!name}>
        <div style={{ borderTop: "1px solid #bbb" }}>
          <Section>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {label}
              <button
                onClick={() => {
                  onReset(name);
                }}
              >
                reset
              </button>
            </div>
            <Range
              {...rangeOptions}
              name={name}
              value={value || 0}
              onChange={onChange}
            />
          </Section>
        </div>
      </AnimateHeight>
    </Container>,
    bodyEl
  );

ProjectionsSlider.propTypes = {
  onChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.number
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

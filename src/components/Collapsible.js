import React, { useEffect, useLayoutEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Measure from "react-measure";

const Container = styled.div`
  transition: height 0.15s ease-in-out, opacity 0.15s linear 0.1s;
  overflow: hidden;
`;

const MeasureContainer = styled.div`
  opacity: 0;
  pointer-events: none;
  height: 0;
`;

const Collapsible = ({ open, children }) => {
  const [stage, setStage] = useState(open ? "opened" : "closed");
  const [targetHeight, setTargetHeight] = useState(open ? "auto" : 0);

  useEffect(() => {
    if (open && stage === "closed") {
      setStage("openMeasuring");
      setTimeout(() => {
        setStage("openMeasured");
        setTimeout(() => {
          setStage("opening");
        }, 20);
      }, 20);
    }
    if (!open && stage === "opened") {
      setStage("closeMeasured");
      setTimeout(() => {
        setStage("closing");
      }, 20);
    }
  }, [open, stage]);

  const Wrapper = stage === "openMeasuring" ? MeasureContainer : Container;

  const heights = {
    closed: 0,
    openMeasuring: 0,
    openMeasured: 0,
    opening: targetHeight,
    opened: "auto",
    closeMeasured: targetHeight,
    closing: 0,
  };

  const opacities = {
    closed: 0,
    openMeasuring: 0,
    openMeasured: 0,
    opening: 1,
    opened: 1,
    closeMeasured: 1,
    closing: 0,
  };

  return stage === "closed" ? null : (
    <Wrapper
      style={{
        height: heights[stage],
        opacity: opacities[stage],
      }}
      onTransitionEnd={() => {
        setStage(open ? "opened" : "closed");
      }}
    >
      <Measure
        bounds
        onResize={(contentRect) => {
          setTargetHeight(contentRect.bounds?.height || 0);
        }}
      >
        {({ measureRef }) => <div ref={measureRef}>{children}</div>}
      </Measure>
    </Wrapper>
  );
};

Collapsible.propTypes = {
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default Collapsible;

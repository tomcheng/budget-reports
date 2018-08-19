import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { primaryColor } from "../styleVariables";

const PADDING = 2;
const WIDTH = 32;
const HEIGHT = 18;

const Track = styled.div`
  box-sizing: border-box;
  padding: ${PADDING}px;
  display: inline-block;
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
  border-radius: ${HEIGHT / 2}px;
  background-color: ${props => (props.on ? primaryColor : "#ddd")};
  transition: background-color 0.15s ease-in-out;
`;

const Handle = styled.div`
  box-sizing: border-box;
  height: ${HEIGHT - 2 * PADDING}px;
  width: ${HEIGHT - 2 * PADDING}px;
  border-radius: 50%;
  background-color: #fff;
  transform: translate3d(${props => (props.on ? WIDTH - HEIGHT : 0)}px, 0, 0);
  transition: transform 0.15s ease-in-out;
`;

const Toggle = ({ on, onClick }) => (
  <Track on={on} onClick={onClick}>
    <Handle on={on} />
  </Track>
);

Toggle.propTypes = {
  on: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Toggle;

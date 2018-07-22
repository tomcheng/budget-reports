import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { iconWidth } from "../styleVariables";
import Icon from "./Icon";

const StyledLink = styled(Link)`
  display: flex;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  width: ${iconWidth}px;
`;

const BackLink = ({ link }) => (
  <StyledLink to={link}>
    <Icon icon="arrow-left" />
  </StyledLink>
);

BackLink.propTypes = {
  link: PropTypes.string.isRequired
};

export default BackLink;

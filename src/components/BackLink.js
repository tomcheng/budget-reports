import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router";
import { iconWidth } from "../styleVariables";
import Icon from "./Icon";

const StyledLink = styled.div`
  display: flex;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  width: ${iconWidth}px;
`;

const BackLink = ({ history }) => (
  <StyledLink onClick={history.goBack}>
    <Icon icon="arrow-left" />
  </StyledLink>
);

BackLink.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(BackLink);

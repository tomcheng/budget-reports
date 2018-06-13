import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { getBudgetLink } from "../utils";
import { iconWidth } from "../styleVariables";
import Icon from "./Icon";

const StyledLink = styled(Link)`
  display: flex;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  width: ${iconWidth}px;
`;

const BackToBudget = ({ budgetId }) => (
  <StyledLink to={getBudgetLink({ budgetId })}>
    <Icon icon="arrow-left" />
  </StyledLink>
);

BackToBudget.propTypes = {
  budgetId: PropTypes.string.isRequired
};

export default BackToBudget;

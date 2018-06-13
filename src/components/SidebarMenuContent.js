import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import topLevelPages from "../topLevelPages";
import Icon from "./Icon";
import { plotBandColor, iconWidth } from "../styleVariables";

const StyledLink = styled(NavLink)`
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  border-top: 1px solid #eee;
  &:last-of-type {
    border-bottom: 1px solid #eee;
  }
`;

const SidebarMenuContent = ({ budgetId, onCloseSidebar }) => (
  <Fragment>
    <div
      style={{
        height: 60,
        width: iconWidth,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onClick={onCloseSidebar}
    >
      <Icon icon="times" />
    </div>
    {topLevelPages.map(({ path, title }) => (
      <StyledLink
        key={path}
        to={`/budgets/${budgetId}${path}`}
        activeStyle={{
          backgroundColor: plotBandColor
        }}
        exact
      >
        {title}
      </StyledLink>
    ))}
  </Fragment>
);

SidebarMenuContent.propTypes = {
  budgetId: PropTypes.string.isRequired,
  onCloseSidebar: PropTypes.func.isRequired
};

export default SidebarMenuContent;

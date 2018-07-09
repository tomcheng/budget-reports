import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import topLevelPages from "../topLevelPages";
import Icon from "./Icon";
import { plotBandColor, iconWidth } from "../styleVariables";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  height: 60px;
`;

const IconWrapper = styled.div`
  width: ${iconWidth}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

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
    <Header>
      <IconWrapper onClick={onCloseSidebar}>
        <Icon icon="times" />
      </IconWrapper>
      <Link to={`/budgets/${budgetId}/settings`} style={{ display: "flex" }}>
        <IconWrapper>
          <Icon icon="cog" />
        </IconWrapper>
      </Link>
    </Header>
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

import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-top: 1px dotted #ddd;
  user-select: none;

  &:first-child {
    border-top: ${props => !props.isContinuing && 0};
    padding-top: ${props => !props.isContinuing && 0};
  }
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-top: 1px dotted #ddd;

  &:first-child {
    border-top: ${props => !props.isContinuing && 0};
    padding-top: ${props => !props.isContinuing && 0};
  }
`;

export const ListItemLink = ({ isContinuing, ...other }) => (
  <StyledLink
    {...other}
    style={isContinuing && { paddingTop: 8, borderTop: "1px dotted #ddd" }}
  />
);

export const LargeListItemLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  border-top: 1px solid #eee;
  color: inherit;

  &:first-child {
    border-top: 0;
  }
`;

export default ListItem;

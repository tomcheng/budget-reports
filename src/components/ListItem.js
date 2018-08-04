import styled from "styled-components";
import { Link } from "react-router-dom";

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-top: 1px dotted #ddd;

  &:first-child {
    border-top: 0;
    padding-top: 0;
  }
`;

export const ListItemLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-top: 1px dotted #ddd;

  &:first-child {
    border-top: 0;
    padding-top: 0;
  }
`;

export const LargeListItemLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  border-top: 1px solid #eee;

  &:first-child {
    border-top: 0;
  }
`;

export default ListItem;

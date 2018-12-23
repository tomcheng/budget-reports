import styled from "styled-components";

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  user-select: none;

  &:first-child {
    padding-top: ${props => !props.isContinuing && 0};
  }
`;

export default ListItem;

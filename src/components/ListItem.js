import styled from "styled-components";

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;

  & + & {
    border-top: 1px dotted #ddd;
  }
`;

export default ListItem;

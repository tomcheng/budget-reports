import styled from "styled-components";

export default styled.div`
  margin: 3px;
  padding: ${props => props.noPadding ? "0" : "15px 20px"};
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 2px;
`;

export const Subsection = styled.div`
  & + & {
    margin-top: 15px;
  }
`;

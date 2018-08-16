import styled from "styled-components";

const Section = styled.div`
  margin: ${props => (props.top ? "0" : "3px")};
  padding: ${props =>
    props.noPadding ? "0" : props.top ? "15px 23px" : "15px 20px"};
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-width: ${props => (props.top ? "0 0 1px" : "1px")};
  border-radius: 2px;
`;

export const TopSection = styled(Section)`
  margin: 0;
  border-width: 0 0 1px;
`;

export default Section;

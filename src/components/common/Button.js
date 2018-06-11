import styled from "styled-components";
import { SecondaryText } from "./typeComponents";

const Button = styled(SecondaryText)`
  user-select: none;
  border: 1px solid #ccc;
  padding: 4px 12px;
  border-radius: 2px;

  & + & {
    margin-left: 5px;
  }
`;

export default Button;

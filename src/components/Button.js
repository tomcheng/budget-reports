import styled from "styled-components";
import { SecondaryText } from "./typeComponents";
import { primaryColor } from "../styleVariables";

const Button = styled(SecondaryText)`
  user-select: none;
  border: 1px solid #ccc;
  padding: 4px 12px;
  border-radius: 2px;

  & + & {
    margin-left: 5px;
  }
`;

export const PrimaryButton = styled(Button)`
  background-color: ${primaryColor};
  border-color: ${primaryColor};
  color: #fff;
`;

export const GhostButton = styled(Button)`
  border-color: transparent;
`;

export default Button;

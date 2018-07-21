import React from "react";
import { StrongText, SecondaryText } from "./typeComponents";

const Loading = () => (
  <div
    style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <StrongText>Loading&hellip;</StrongText>
    <SecondaryText>beep, beep, boop</SecondaryText>
  </div>
);

Loading.propTypes = {};

export default Loading;

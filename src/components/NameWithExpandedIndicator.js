import React from "react";
import PropTypes from "prop-types";
import { SecondaryText } from "./typeComponents";
import Icon from "./Icon";

const NameWithExpandedIndicator = ({ name, expanded }) => (
  <SecondaryText
    style={{ whiteSpace: "pre", display: "flex", alignItems: "center" }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 24,
        fontWeight: 400,
        color: "#888",
        fontSize: 10
      }}
    >
      <Icon icon="chevron-right" transform={{ rotate: expanded ? 90 : 0 }} />
    </div>
    {name}
  </SecondaryText>
);

NameWithExpandedIndicator.propTypes = {
  name: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired
};

export default NameWithExpandedIndicator;

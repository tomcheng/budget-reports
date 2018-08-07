import React from "react";
import PropTypes from "prop-types";
import { SecondaryText } from "./typeComponents";

const SeeAll = ({ showAll, onToggle }) => (
  <SecondaryText style={{ textAlign: "center", color: "#999" }} onClick={onToggle}>
    {showAll ? "see less" : "see all"}
  </SecondaryText>
);

SeeAll.propTypes = {
  showAll: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default SeeAll;
import React from "react";
import PropTypes from "prop-types";
import { MinorText } from "./typeComponents";

const SeeAll = ({ count, pluralizedName, showAll, onToggle }) => (
  <MinorText style={{ textAlign: "center", marginTop: 5 }} onClick={onToggle}>
    {showAll ? "see less" : `see all ${count} ${pluralizedName}`}
  </MinorText>
);

SeeAll.propTypes = {
  count: PropTypes.number.isRequired,
  pluralizedName: PropTypes.string.isRequired,
  showAll: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default SeeAll;

import React from "react";
import PropTypes from "prop-types";
import LabelWithMinorText from "./LabelWithMinorText";

const LabelWithTransactionCount = ({
  label,
  count,
  inLink,
  selected,
  showCount,
  to
}) => (
  <LabelWithMinorText
    bold={selected}
    label={label}
    minorText={showCount && `${count} transaction${count === 1 ? "" : "s"}`}
    inLink={inLink}
    to={to}
  />
);

LabelWithTransactionCount.propTypes = {
  count: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  inLink: PropTypes.bool,
  selected: PropTypes.bool,
  showCount: PropTypes.bool,
  to: PropTypes.string
};

LabelWithTransactionCount.defaultProps = { showCount: true };

export default LabelWithTransactionCount;

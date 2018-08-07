import React  from "react";
import PropTypes from "prop-types";
import { SecondaryText, MinorText } from "./typeComponents";

const LabelWithTransactionCount = ({ label, count, showCount, style }) => (
  <SecondaryText style={style}>
    {label}
    {showCount && (
      <MinorText style={{ lineHeight: "inherit", display: "inline" }}>
        &nbsp;&ndash; {count} transaction{count === 1 ? "" : "s"}
      </MinorText>
    )}
  </SecondaryText>
);

LabelWithTransactionCount.propTypes = {
  count: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  showCount: PropTypes.bool,
  style: PropTypes.object
};

LabelWithTransactionCount.defaultProps = { showCount: true };

export default LabelWithTransactionCount;

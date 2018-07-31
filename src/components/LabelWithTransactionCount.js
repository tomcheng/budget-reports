import React, { Fragment } from "react";
import PropTypes from "prop-types";

const LabelWithTransactionCount = ({ label, count, showCount }) => (
  <Fragment>
    {label}
    {showCount && (
      <span style={{ opacity: 0.6 }}>
        &nbsp;&ndash; {count} transaction{count === 1 ? "" : "s"}
      </span>
    )}
  </Fragment>
);

LabelWithTransactionCount.propTypes = {
  count: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  showCount: PropTypes.bool
};

LabelWithTransactionCount.defaultProps = { showCount: true };

export default LabelWithTransactionCount;

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import LabelWithMinorText from "./LabelWithMinorText";

class LabelWithTransactionCount extends PureComponent {
  static propTypes = {
    count: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    inLink: PropTypes.bool,
    showCount: PropTypes.bool,
    to: PropTypes.string
  };

  static defaultProps = { showCount: true };

  render() {
    const { label, count, inLink, showCount, to } = this.props;
    return (
      <LabelWithMinorText
        label={label}
        minorText={showCount && `${count} transaction${count === 1 ? "" : "s"}`}
        inLink={inLink}
        to={to}
      />
    );
  }
}

export default LabelWithTransactionCount;

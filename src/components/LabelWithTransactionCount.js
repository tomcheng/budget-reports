import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import LabelWithMinorText from "./LabelWithMinorText";

class LabelWithTransactionCount extends PureComponent {
  static propTypes = {
    count: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    inLink: PropTypes.bool,
    selected: PropTypes.bool,
    showCount: PropTypes.bool,
    to: PropTypes.string
  };

  static defaultProps = { showCount: true };

  render() {
    const { label, count, inLink, selected, showCount, to } = this.props;
    return (
      <LabelWithMinorText
        bold={selected}
        label={label}
        minorText={showCount && `${count} transaction${count === 1 ? "" : "s"}`}
        inLink={inLink}
        to={to}
      />
    );
  }
}

export default LabelWithTransactionCount;

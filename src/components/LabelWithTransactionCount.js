import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SecondaryText, MinorText } from "./typeComponents";

class LabelWithTransactionCount extends PureComponent {
  static propTypes = {
    count: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    inLink: PropTypes.bool,
    showCount: PropTypes.bool
  };

  static defaultProps = { showCount: true };

  render() {
    const { label, count, inLink, showCount } = this.props;
    return (
      <SecondaryText
        style={{
          whiteSpace: "pre",
          overflow: "hidden",
          textOverflow: "ellipsis",
          color: inLink && "inherit"
        }}
      >
        {label}
        {showCount && (
          <MinorText style={{ lineHeight: "inherit", display: "inline" }}>
            &nbsp;&ndash; {count} transaction{count === 1 ? "" : "s"}
          </MinorText>
        )}
      </SecondaryText>
    );
  }
}

export default LabelWithTransactionCount;

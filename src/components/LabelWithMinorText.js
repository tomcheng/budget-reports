import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SecondaryText, MinorText } from "./typeComponents";

class LabelWithMinorText extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    inLink: PropTypes.bool,
    minorText: PropTypes.string
  };

  render() {
    const { label, minorText, inLink } = this.props;
    return (
      <SecondaryText
        style={{
          display: "flex",
          alignItems: "baseline",
          whiteSpace: "pre",
          overflow: "hidden",
          color: inLink && "inherit"
        }}
      >
        {label}
        {minorText && (
          <MinorText
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            &nbsp;&ndash; {minorText}
          </MinorText>
        )}
      </SecondaryText>
    );
  }
}

export default LabelWithMinorText;

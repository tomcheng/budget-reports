import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import get from "lodash/fp/get";
import { SecondaryText, MinorText } from "./typeComponents";
import ListItem from "./ListItem";
import Amount from "./Amount";
import LabelWithMinorText from "./LabelWithMinorText";

class Transaction extends PureComponent {
  static propTypes = {
    amount: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    payee: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    category: PropTypes.shape({
      name: PropTypes.string.isRequired
    }),
    isContinuing: PropTypes.bool
  };

  render() {
    const { category, payee, date, amount, isContinuing } = this.props;

    return (
      <ListItem isContinuing={isContinuing}>
        <div style={{ overflow: "hidden" }}>
          <LabelWithMinorText
            label={payee.name}
            minorText={get("name")(category) || ""}
          />
          <MinorText>{moment(date).format("dddd, MMM D")}</MinorText>
        </div>
        <SecondaryText>
          <Amount amount={amount} />
        </SecondaryText>
      </ListItem>
    );
  }
}

export default Transaction;

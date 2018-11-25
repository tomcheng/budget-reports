import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import get from "lodash/fp/get";
import { SecondaryText, MinorText } from "./typeComponents";
import ListItem from "./ListItem";
import Amount from "./Amount";
import LabelWithMinorText from "./LabelWithMinorText";

const Transaction = ({ category, payee, memo, date, amount, isContinuing }) => (
  <ListItem isContinuing={isContinuing}>
    <div style={{ overflow: "hidden" }}>
      <LabelWithMinorText
        label={get("name")(payee) || "(no payee)"}
        minorText={(get("name")(category) || "") + (memo ? ` (${memo})` : "")}
      />
      <MinorText>{moment(date).format("dddd, MMM D")}</MinorText>
    </div>
    <SecondaryText>
      <Amount amount={amount} />
    </SecondaryText>
  </ListItem>
);

Transaction.propTypes = {
  amount: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  category: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  isContinuing: PropTypes.bool,
  memo: PropTypes.string,
  payee: PropTypes.shape({
    name: PropTypes.string.isRequired
  })
};

export default Transaction;

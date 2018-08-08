import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import moment from "moment";
import { SecondaryText, MinorText } from "./typeComponents";
import ListItem from "./ListItem";
import Amount from "./Amount";
import LabelWithMinorText from "./LabelWithMinorText";

const Date = styled(MinorText)`
  margin-top: -3px;
`;

class Transaction extends PureComponent {
  static propTypes = {
    amount: PropTypes.number.isRequired,
    category: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    date: PropTypes.string.isRequired,
    payee: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    isContinuing: PropTypes.bool
  };

  render() {
    const { category, payee, date, amount, isContinuing } = this.props;

    return (
      <ListItem isContinuing={isContinuing}>
        <div style={{ overflow: "hidden" }}>
          <LabelWithMinorText label={payee.name} minorText={category.name} />
          <Date>{moment(date).format("dddd, MMM D")}</Date>
        </div>
        <SecondaryText>
          <Amount amount={amount} />
        </SecondaryText>
      </ListItem>
    );
  }
}

export default Transaction;

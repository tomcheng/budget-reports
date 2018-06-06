import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import moment from "moment";
import { SecondaryText, MinorText } from "./typeComponents";
import ListItem from "./ListItem";
import Amount from "./Amount";

const Date = styled(MinorText)`
  margin-top: -4px;
`;

const Transaction = ({ payee, date, amount }) => (
  <ListItem>
    <div>
      <SecondaryText>{payee.name}</SecondaryText>
      <Date>{moment(date).format("dddd, MMM D")}</Date>
    </div>
    <SecondaryText>
      <Amount amount={amount} />
    </SecondaryText>
  </ListItem>
);

Transaction.propTypes = {
  amount: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  payee: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default Transaction;

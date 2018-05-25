import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import moment from "moment";
import { SecondaryText, MinorText } from "./typeComponents";
import Amount from "./Amount";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;

  & + & {
    border-top: 1px dotted #ddd;
  }
`;

const Date = styled(MinorText)`
  margin-top: -4px;
`;

const Transaction = ({ payee, date, amount }) => (
  <Container>
    <div>
      <SecondaryText>{payee.name}</SecondaryText>
      <Date>{moment(date).format("dddd, MMM D")}</Date>
    </div>
    <SecondaryText>
      <Amount amount={amount} />
    </SecondaryText>
  </Container>
);

Transaction.propTypes = {
  amount: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  payee: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default Transaction;

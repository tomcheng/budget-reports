import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import moment from "moment";
import { Link } from "react-router-dom";
import { getPayeeLink } from "../utils";
import { SecondaryText, MinorText } from "./typeComponents";
import ListItem from "./ListItem";
import Amount from "./Amount";

const Date = styled(MinorText)`
  margin-top: -4px;
`;

const Transaction = ({ payee, date, amount, budgetId, linkToPayee }) => (
  <ListItem>
    <div>
      <SecondaryText>
        {linkToPayee ? (
          <Link to={getPayeeLink({ budgetId, payeeId: payee.id })}>
            {payee.name}
          </Link>
        ) : (
          payee.name
        )}
      </SecondaryText>
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
  }).isRequired,
  budgetId: PropTypes.string,
  linkToPayee: PropTypes.bool
};

export default Transaction;

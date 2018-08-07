import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import moment from "moment";
import { Link } from "react-router-dom";
import pages, { makeLink } from "../pages";
import { SecondaryText, MinorText } from "./typeComponents";
import ListItem from "./ListItem";
import Amount from "./Amount";

const Date = styled(MinorText)`
  margin-top: -4px;
`;

const Transaction = ({ payee, date, amount, budgetId, linkToPayee, isContinuing }) => (
  <ListItem isContinuing={isContinuing}>
    <div>
      <SecondaryText>
        {linkToPayee && payee ? (
          <Link
            to={makeLink(pages.payee.path, { budgetId, payeeId: payee.id })}
          >
            {payee.name}
          </Link>
        ) : payee ? (
          payee.name
        ) : (
          "(no payee)"
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
  isContinuing: PropTypes.bool,
  linkToPayee: PropTypes.bool
};

export default Transaction;

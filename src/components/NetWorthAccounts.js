import React from "react";
import PropTypes from "prop-types";
import Section from "./Section";
import { StrongText } from "./typeComponents";

const NetWorthAccounts = ({ accounts }) => (
  <Section>
    <StrongText>Accounts</StrongText>
    {accounts.map(({ balance, id, name }) => (
      <div key={id}>
        {name}: {balance.toFixed(2)}
      </div>
    ))}
  </Section>
);

NetWorthAccounts.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      balance: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired
};

export default NetWorthAccounts;

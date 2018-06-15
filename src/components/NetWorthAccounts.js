import React, { Fragment } from "react";
import PropTypes from "prop-types";
import filter from "lodash/fp/filter";
import includes from "lodash/fp/includes";
import Section from "./Section";
import { StrongText, SecondaryText } from "./typeComponents";
import ListItem from "./ListItem";
import Amount from "./Amount";

const GROUPS = [
  { name: "Mortgage and Assets", types: ["mortgage", "otherAsset"] },
  { name: "Investment Accounts", types: ["investmentAccount"] },
  { name: "Savings Accounts", types: ["savings"] },
  { name: "Checking Accounts and Cash", types: ["checking", "cash"] },
  { name: "Credit Cards", types: ["creditCard"] },
  { name: "Other", types: ["payPal"] }
];

const NetWorthAccounts = ({ accounts, onToggleAccount }) => {
  return GROUPS.map(({ name, types }) => {
    const groupAccounts = filter(account => includes(account.type)(types))(
      accounts
    );

    return (
      <Section key={name}>
        <StrongText>{name}</StrongText>
        {groupAccounts.map(({ balance, id, name }) => (
          <ListItem key={id} onClick={() => onToggleAccount(id)}>
            <SecondaryText>{name}</SecondaryText>
            <Amount amount={balance} />
          </ListItem>
        ))}
      </Section>
    );
  });
};

NetWorthAccounts.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      balance: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  onToggleAccount: PropTypes.func.isRequired
};

export default NetWorthAccounts;

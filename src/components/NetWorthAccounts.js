import React, { Fragment } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import filter from "lodash/fp/filter";
import includes from "lodash/fp/includes";
import map from "lodash/fp/map";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import Section from "./Section";
import { StrongText } from "./typeComponents";
import Breakdown from "./Breakdown";

const GROUPS = [
  { name: "Mortgage and Assets", types: ["mortgage", "otherAsset"] },
  { name: "Investment Accounts", types: ["investmentAccount"] },
  { name: "Savings Accounts", types: ["savings"] },
  { name: "Checking Accounts and Cash", types: ["checking", "cash"] },
  { name: "Credit Cards and Other", types: ["creditCard", "payPal"] }
];

const NetWorthAccounts = ({ accounts }) => {
  const nodes = GROUPS.map(({ name, types }) => {
    const groupAccounts = filter(account => includes(account.type)(types))(
      accounts
    );
    return {
      amount: sumBy("balance")(groupAccounts),
      name,
      id: name,
      nodes: compose([
        sortBy("balance"),
        map(({ id, name, balance }) => ({
          amount: balance,
          id,
          name
        }))
      ])(groupAccounts)
    };
  });

  return (
    <Section>
      <StrongText>Accounts</StrongText>
      <Breakdown nodes={nodes} total={0} />
    </Section>
  );
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

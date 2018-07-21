import React from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import every from "lodash/fp/every";
import find from "lodash/fp/find";
import groupBy from "lodash/fp/groupBy";
import includes from "lodash/fp/includes";
import keyBy from "lodash/fp/keyBy";
import mapRaw from "lodash/fp/map";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import Section from "./Section";
import { StrongText } from "./typeComponents";
import Breakdown from "./Breakdown";
import Icon from "./Icon";

const map = mapRaw.convert({ cap: false });

const GROUP_ORDER = [
  "Checking Accounts and Cash",
  "Savings Accounts",
  "Credit Cards",
  "Investment Accounts",
  "Mortgage Accounts",
  "Other"
];

const GROUPS = [
  { name: "Savings Accounts", types: ["savings"] },
  { name: "Checking Accounts and Cash", types: ["checking", "cash"] },
  { name: "Credit Cards", types: ["creditCard"] }
];

const NetWorthAccounts = ({
  accounts,
  hiddenAccounts,
  onToggleAccounts,
  investmentAccounts,
  mortgageAccounts
}) => {
  const accountsByGroup = groupBy(account => {
    if (investmentAccounts[account.id]) {
      return "Investment Accounts";
    }

    if (mortgageAccounts[account.id]) {
      return "Mortgage Accounts";
    }

    const group = find(group => includes(account.type)(group.types))(GROUPS);

    return group ? group.name : "Other";
  })(accounts);
  const accountsById = keyBy("id")(accounts);

  const nodes = compose([
    sortBy(group => GROUP_ORDER.indexOf(group.name)),
    map((accounts, name) => ({
      amount: sumBy("balance")(accounts),
      name,
      id: name,
      nodes: compose([
        sortBy("balance"),
        map(({ id, name, balance }) => ({
          amount: balance,
          id,
          name
        }))
      ])(accounts)
    }))
  ])(accountsByGroup);

  return (
    <Section>
      <StrongText>Accounts</StrongText>
      <Breakdown
        nodes={nodes}
        infoRenderer={({ id }) => {
          const accounts = accountsByGroup[id] || [accountsById[id]];
          return (
            <div
              style={{ width: 36, textAlign: "center" }}
              onClick={evt => {
                evt.stopPropagation();
                onToggleAccounts({ ids: map("id", accounts) });
              }}
            >
              {every(account => hiddenAccounts[account.id])(accounts) ? (
                <Icon icon="eye-slash" />
              ) : (
                <Icon icon="eye" />
              )}
            </div>
          );
        }}
      />
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
  hiddenAccounts: PropTypes.objectOf(PropTypes.bool).isRequired,
  investmentAccounts: PropTypes.objectOf(PropTypes.bool).isRequired,
  mortgageAccounts: PropTypes.objectOf(PropTypes.bool).isRequired,
  onToggleAccounts: PropTypes.func.isRequired
};

export default NetWorthAccounts;

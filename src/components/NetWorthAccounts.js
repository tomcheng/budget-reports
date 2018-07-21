import React, { Fragment } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import every from "lodash/fp/every";
import filter from "lodash/fp/filter";
import find from "lodash/fp/find";
import groupBy from "lodash/fp/groupBy";
import includes from "lodash/fp/includes";
import keyBy from "lodash/fp/keyBy";
import mapRaw from "lodash/fp/map";
import propEq from "lodash/fp/propEq";
import reject from "lodash/fp/reject";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import values from "lodash/fp/values";
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

const getNodes = ({ accounts, investmentAccounts, mortgageAccounts }) => {
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

  return compose([
    sortBy(group => GROUP_ORDER.indexOf(group.name)),
    map((accounts, name) => ({
      name,
      accounts,
      amount: sumBy("balance")(accounts),
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
};

const NetWorthAccounts = ({
  accounts,
  hiddenAccounts,
  onToggleAccounts,
  investmentAccounts,
  mortgageAccounts
}) => {
  const accountsById = keyBy("id")(accounts);
  const visibleNodes = getNodes({
    accounts: reject(account => hiddenAccounts[account.id])(accounts),
    investmentAccounts,
    mortgageAccounts
  });
  const hiddenNodes = getNodes({
    accounts: filter(account => hiddenAccounts[account.id])(accounts),
    investmentAccounts,
    mortgageAccounts
  });

  return (
    <Fragment>
      <Section>
        <StrongText>Accounts</StrongText>
        <AccountBreakdown
          accountsById={accountsById}
          hiddenAccounts={hiddenAccounts}
          nodes={visibleNodes}
          onToggleAccounts={onToggleAccounts}
        />
      </Section>

      {values(hiddenNodes).length > 0 && (
        <Section>
          <StrongText>Hidden</StrongText>
          <AccountBreakdown
            accountsById={accountsById}
            hiddenAccounts={hiddenAccounts}
            nodes={hiddenNodes}
            onToggleAccounts={onToggleAccounts}
          />
        </Section>
      )}
    </Fragment>
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

const AccountBreakdown = ({
  accountsById,
  hiddenAccounts,
  nodes,
  onToggleAccounts
}) => (
  <Breakdown
    nodes={nodes}
    infoRenderer={({ id }) => {
      const node = nodes.find(propEq("id", id));
      const accounts = node ? node.accounts : [accountsById[id]];

      return (
        <div
          style={{ width: 36, textAlign: "center" }}
          onClick={evt => {
            evt.stopPropagation();
            onToggleAccounts({ ids: map("id")(accounts) });
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
);

export default NetWorthAccounts;

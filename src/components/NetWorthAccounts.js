import React, { Fragment } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import every from "lodash/fp/every";
import filter from "lodash/fp/filter";
import groupBy from "lodash/fp/groupBy";
import keyBy from "lodash/fp/keyBy";
import mapRaw from "lodash/fp/map";
import propEq from "lodash/fp/propEq";
import reject from "lodash/fp/reject";
import sortBy from "lodash/fp/sortBy";
import startCase from "lodash/fp/startCase";
import sumBy from "lodash/fp/sumBy";
import values from "lodash/fp/values";
import CollapsibleSection from "./CollapsibleSection";
import Breakdown from "./Breakdown";
import { SecondaryText } from "./typeComponents";
import Amount from "./Amount";
import Icon from "./Icon";

const map = mapRaw.convert({ cap: false });

const getNodes = ({ accounts, investmentAccounts, mortgageAccounts }) => {
  const accountsByGroup = groupBy(account => {
    if (investmentAccounts[account.id]) {
      return "Investments";
    }

    if (mortgageAccounts[account.id]) {
      return "Mortgages";
    }

    return startCase(account.type);
  })(accounts);

  return compose([
    accounts => accounts.reverse(),
    sortBy("amount"),
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
      <CollapsibleSection title="Accounts">
        <AccountBreakdown
          accountsById={accountsById}
          hiddenAccounts={hiddenAccounts}
          nodes={visibleNodes}
          onToggleAccounts={onToggleAccounts}
        />
      </CollapsibleSection>

      {values(hiddenNodes).length > 0 && (
        <CollapsibleSection title="Hidden Accounts">
          <AccountBreakdown
            accountsById={accountsById}
            hiddenAccounts={hiddenAccounts}
            nodes={hiddenNodes}
            onToggleAccounts={onToggleAccounts}
          />
        </CollapsibleSection>
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
    valueRenderer={({ id, amount }) => {
      const node = nodes.find(propEq("id", id));
      const accounts = node ? node.accounts : [accountsById[id]];

      return (
        <SecondaryText style={{ display: "flex", alignItems: "center" }}>
          <Amount amount={amount} />
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
        </SecondaryText>
      );
    }}
  />
);

export default NetWorthAccounts;

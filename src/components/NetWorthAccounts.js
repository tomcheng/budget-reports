import React from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import every from "lodash/fp/every";
import find from "lodash/fp/find";
import groupBy from "lodash/fp/groupBy";
import includes from "lodash/fp/includes";
import keyBy from "lodash/fp/keyBy";
import map from "lodash/fp/map";
import prop from "lodash/fp/prop";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import Section from "./Section";
import { StrongText } from "./typeComponents";
import Breakdown from "./Breakdown";
import Icon from "./Icon";

const GROUPS = [
  { name: "Mortgage and Assets", types: ["mortgage", "otherAsset"] },
  { name: "Investment Accounts", types: ["investmentAccount"] },
  { name: "Savings Accounts", types: ["savings"] },
  { name: "Checking Accounts and Cash", types: ["checking", "cash"] },
  { name: "Credit Cards and Other", types: ["creditCard", "payPal"] }
];

const NetWorthAccounts = ({ accounts, hiddenAccounts, onToggleAccounts }) => {
  const accountsByGroup = groupBy(account =>
    compose([prop("name"), find(group => includes(account.type)(group.types))])(
      GROUPS
    )
  )(accounts);
  const accountsById = keyBy("id")(accounts);

  const nodes = GROUPS.map(({ name }) => {
    const groupAccounts = accountsByGroup[name];
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
  onToggleAccounts: PropTypes.func.isRequired
};

export default NetWorthAccounts;

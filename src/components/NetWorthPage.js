import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import constant from "lodash/fp/constant";
import eq from "lodash/fp/eq";
import filter from "lodash/fp/filter";
import findIndex from "lodash/fp/findIndex";
import groupBy from "lodash/fp/groupBy";
import identity from "lodash/fp/identity";
import keyBy from "lodash/fp/keyBy";
import keys from "lodash/fp/keys";
import last from "lodash/fp/last";
import map from "lodash/fp/map";
import mapValues from "lodash/fp/mapValues";
import omitBy from "lodash/fp/omitBy";
import sortBy from "lodash/fp/sortBy";
import sum from "lodash/fp/sum";
import sumBy from "lodash/fp/sumBy";
import values from "lodash/fp/values";
import { simpleMemoize } from "../dataUtils";
import { useSelectedMonth } from "../commonHooks";
import { getSetting, setSetting } from "../uiRepo";
import PageLayout from "./PageLayout";
import CollapsibleSection from "./CollapsibleSection";
import ChartNumbers from "./ChartNumbers";
import NetWorthChart from "./NetWorthChart";
import NetWorthAccounts from "./NetWorthAccounts";

const useHiddenAccounts = budget => {
  const [hiddenAccounts, setHiddenAccounts] = useState(
    getSetting("netWorthHiddenAccounts", budget.id)
  );

  const onToggleHiddenAccounts = ({ ids }) => {
    const shouldHide = ids.some(id => !hiddenAccounts[id]);
    const newHiddenAccounts = ids.reduce(
      (acc, id) => ({ ...acc, [id]: shouldHide }),
      hiddenAccounts
    );

    setHiddenAccounts(newHiddenAccounts);
    setSetting("netWorthHiddenAccounts", budget.id, newHiddenAccounts);
  };

  return { hiddenAccounts, onToggleHiddenAccounts };
};

const cumulative = arr =>
  arr.reduce(
    (acc, curr) => (acc.length === 0 ? [curr] : acc.concat(last(acc) + curr)),
    []
  );

const groupByMonthAndAccount = simpleMemoize(
  compose([
    mapValues(groupBy("account_id")),
    groupBy(({ date }) => date.slice(0, 7))
  ])
);

const getMonths = simpleMemoize(budget =>
  compose([sortBy(identity), keys, groupByMonthAndAccount])(budget.transactions)
);

const getSummaryByAccount = simpleMemoize(budget => {
  const groupedTransactions = groupByMonthAndAccount(budget.transactions);
  const months = getMonths(budget);
  return map(({ id }) => ({
    id,
    data: compose([
      cumulative,
      map(month => sumBy("amount")(groupedTransactions[month][id]))
    ])(months)
  }))(budget.accounts);
});

const getSelectedBalances = simpleMemoize((selectedMonth, budget) => {
  const months = getMonths(budget);
  const selectedMonthIndex = findIndex(eq(selectedMonth))(months);
  const accountSummaries = getSummaryByAccount(budget);

  return compose([
    mapValues(
      ({ data }) =>
        selectedMonthIndex > -1 ? data[selectedMonthIndex] : last(data)
    ),
    keyBy("id")
  ])(accountSummaries);
});

const NetWorthPage = ({
  budget,
  historyAction,
  investmentAccounts,
  location,
  mortgageAccounts,
  sidebarTrigger,
  title
}) => {
  const [selectedMonth, onSelectMonth] = useSelectedMonth();
  const { hiddenAccounts, onToggleHiddenAccounts } = useHiddenAccounts(budget);
  const months = getMonths(budget);
  const accountSummaries = getSummaryByAccount(budget);
  const selectedBalances = getSelectedBalances(selectedMonth, budget);
  const filterHidden = omitBy((_, id) => hiddenAccounts[id]);
  const selectedLiabilities = compose([
    sum,
    filter(b => b < 0),
    values,
    filterHidden
  ])(selectedBalances);
  const selectedAssets = compose([
    sum,
    filter(b => b > 0),
    values,
    filterHidden
  ])(selectedBalances);

  return (
    <PageLayout
      historyAction={historyAction}
      location={location}
      sidebarTrigger={sidebarTrigger}
      title={title}
      content={
        <Fragment>
          <CollapsibleSection title="Monthly Trend">
            <ChartNumbers
              numbers={[
                {
                  amount: -(selectedAssets + selectedLiabilities),
                  label: "Net Worth"
                },
                { amount: -selectedAssets, label: "Assets" },
                { amount: selectedLiabilities, label: "Liabilities" }
              ]}
              alwaysRound
            />
            <NetWorthChart
              data={map(({ id, data }) => ({
                data: hiddenAccounts[id] ? data.map(constant(0)) : data,
                type: budget.accountsById[id].type,
                id
              }))(accountSummaries)}
              months={months}
              mortgageAccounts={mortgageAccounts}
              selectedMonth={selectedMonth}
              onSelectMonth={onSelectMonth}
            />
          </CollapsibleSection>
          <NetWorthAccounts
            accounts={map(account => ({
              ...account,
              balance: selectedBalances[account.id]
            }))(budget.accounts)}
            hiddenAccounts={hiddenAccounts}
            investmentAccounts={investmentAccounts}
            mortgageAccounts={mortgageAccounts}
            onToggleAccounts={onToggleHiddenAccounts}
          />
        </Fragment>
      }
    />
  );
};

NetWorthPage.propTypes = {
  budget: PropTypes.shape({
    accounts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
      })
    ).isRequired,
    accountsById: PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
      })
    ).isRequired,
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        account_id: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired,
  historyAction: PropTypes.string.isRequired,
  investmentAccounts: PropTypes.objectOf(PropTypes.bool).isRequired,
  location: PropTypes.string.isRequired,
  mortgageAccounts: PropTypes.objectOf(PropTypes.bool).isRequired,
  sidebarTrigger: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
};

export default NetWorthPage;

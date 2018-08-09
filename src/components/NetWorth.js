import React, { PureComponent, Fragment } from "react";
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
import { simpleMemoize } from "../utils";
import { getSetting, setSetting, NET_WORTH_HIDDEN_ACCOUNTS } from "../uiRepo";
import { TopSection } from "./Section";
import CollapsibleSection from "./CollapsibleSection";
import NetWorthSummary from "./NetWorthSummary";
import NetWorthChart from "./NetWorthChart";
import NetWorthAccounts from "./NetWorthAccounts";

const cumulative = arr =>
  arr.reduce(
    (acc, curr) => (acc.length === 0 ? [curr] : acc.concat(last(acc) + curr)),
    []
  );

class NetWorth extends PureComponent {
  static propTypes = {
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
          accountId: PropTypes.string.isRequired,
          amount: PropTypes.number.isRequired,
          date: PropTypes.string.isRequired
        })
      ).isRequired
    }).isRequired,
    investmentAccounts: PropTypes.objectOf(PropTypes.bool).isRequired,
    mortgageAccounts: PropTypes.objectOf(PropTypes.bool).isRequired
  };

  constructor(props) {
    super();

    this.state = {
      hiddenAccounts: getSetting(NET_WORTH_HIDDEN_ACCOUNTS, props.budget.id),
      selectedMonth: null
    };
  }

  groupByMonthAndAccount = simpleMemoize(
    compose([
      mapValues(groupBy("account_id")),
      groupBy(({ date }) => date.slice(0, 7))
    ])
  );

  getMonths = simpleMemoize(budget =>
    compose([sortBy(identity), keys, this.groupByMonthAndAccount])(
      budget.transactions
    )
  );

  getSummaryByAccount = simpleMemoize(budget => {
    const groupedTransactions = this.groupByMonthAndAccount(
      budget.transactions
    );
    const months = this.getMonths(budget);
    return map(({ id }) => ({
      id,
      data: compose([
        cumulative,
        map(month => sumBy("amount")(groupedTransactions[month][id]))
      ])(months)
    }))(budget.accounts);
  });

  getSelectedBalances = simpleMemoize((selectedMonth, budget) => {
    const months = this.getMonths(budget);
    const selectedMonthIndex = findIndex(eq(selectedMonth))(months);
    const accountSummaries = this.getSummaryByAccount(budget);

    return compose([
      mapValues(
        ({ data }) =>
          selectedMonthIndex > -1 ? data[selectedMonthIndex] : last(data)
      ),
      keyBy("id")
    ])(accountSummaries);
  });

  handleSelectMonth = month => {
    this.setState(state => ({
      ...state,
      selectedMonth: state.selectedMonth === month ? null : month
    }));
  };

  handleToggleAccounts = ({ ids }) => {
    const { budget } = this.props;
    const { hiddenAccounts } = this.state;
    const shouldHide = ids.some(id => !hiddenAccounts[id]);
    const newHiddenAccounts = ids.reduce(
      (acc, id) => ({ ...acc, [id]: shouldHide }),
      hiddenAccounts
    );

    this.setState({ hiddenAccounts: newHiddenAccounts });
    setSetting(NET_WORTH_HIDDEN_ACCOUNTS, budget.id, newHiddenAccounts);
  };

  render() {
    const { budget, investmentAccounts, mortgageAccounts } = this.props;
    const { hiddenAccounts, selectedMonth } = this.state;

    const months = this.getMonths(budget);
    const accountSummaries = this.getSummaryByAccount(budget);
    const selectedBalances = this.getSelectedBalances(selectedMonth, budget);
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
      <Fragment>
        <TopSection>
          <NetWorthSummary
            liabilities={selectedLiabilities}
            assets={selectedAssets}
            netWorth={selectedAssets + selectedLiabilities}
          />
        </TopSection>
        <CollapsibleSection title="Monthly Trend">
          <NetWorthChart
            data={map(({ id, data }) => ({
              data: hiddenAccounts[id] ? data.map(constant(0)) : data,
              type: budget.accountsById[id].type,
              id
            }))(accountSummaries)}
            months={months}
            mortgageAccounts={mortgageAccounts}
            selectedMonth={selectedMonth}
            onSelectMonth={this.handleSelectMonth}
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
          onToggleAccounts={this.handleToggleAccounts}
        />
      </Fragment>
    );
  }
}

export default NetWorth;

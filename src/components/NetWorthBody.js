import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import compose from "lodash/fp/compose";
import constant from "lodash/fp/constant";
import groupBy from "lodash/fp/groupBy";
import identity from "lodash/fp/identity";
import keys from "lodash/fp/keys";
import last from "lodash/fp/last";
import map from "lodash/fp/map";
import mapValues from "lodash/fp/mapValues";
import pick from "lodash/fp/pick";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import NetWorthChart from "./NetWorthChart";
import NetWorthAccounts from "./NetWorthAccounts";

const CREDIT_ACCOUNTS = ["mortgage", "creditCard"];

const cumulative = arr =>
  arr.reduce(
    (acc, curr) => (acc.length === 0 ? [curr] : acc.concat(last(acc) + curr)),
    []
  );

class NetWorthBody extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          accountId: PropTypes.string.isRequired,
          amount: PropTypes.number.isRequired,
          date: PropTypes.string.isRequired
        })
      ).isRequired
    }).isRequired
  };

  state = {
    hiddenAccounts: {}
  };

  handleToggleAccounts = ({ ids }) => {
    const { hiddenAccounts } = this.state;
    const shouldHide = ids.some(id => !hiddenAccounts[id]);
    const newHiddenAccounts = ids.reduce(
      (acc, id) => ({ ...acc, [id]: shouldHide }),
      hiddenAccounts
    );

    this.setState({ hiddenAccounts: newHiddenAccounts });
  };

  render() {
    const { budget } = this.props;
    const { hiddenAccounts } = this.state;

    const summary = compose([
      mapValues(groupBy("accountId")),
      groupBy(({ date }) => date.slice(0, 7))
    ])(budget.transactions);
    const months = compose([sortBy(identity), keys])(summary);
    const accountSummaries = map(({ name, id, type }) => {
      const byMonth = compose([
        cumulative,
        map(month => sumBy("amount")(summary[month][id]))
      ])(months);
      const hidden = !!hiddenAccounts[id];

      return {
        id,
        name,
        type,
        hidden,
        data: hidden ? map(constant(0))(months) : byMonth,
        balance: last(byMonth),
        stack: CREDIT_ACCOUNTS.includes(type) ? "liability" : "asset"
      };
    })(budget.accounts);

    return (
      <Fragment>
        <NetWorthChart
          series={map(pick(["name", "data", "stack"]))(accountSummaries)}
          categories={months.map(month => moment(month).format("MMM"))}
        />
        <NetWorthAccounts
          accounts={map(pick(["name", "id", "type", "balance"]))(
            accountSummaries
          )}
          onToggleAccounts={this.handleToggleAccounts}
        />
      </Fragment>
    );
  }
}

export default NetWorthBody;

import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import keys from "lodash/fp/keys";
import get from "lodash/fp/get";
import EmptyText from "./EmptyText";
import { Link } from "react-router-dom";
import pages, { makeLink } from "../pages";
import MonthByMonthSection from "./MonthByMonthSection";
import MonthExclusions from "./MonthExclusions";
import { getTransactionMonth } from "../budgetUtils";
import GenericEntitiesSection from "./GenericEntitiesSection";

const isContribution = investmentAccounts => transaction =>
  !!investmentAccounts[transaction.account_id] &&
  !!transaction.transfer_account_id &&
  !investmentAccounts[transaction.transfer_account_id];

const isCapitalGainOrLoss = (investmentAccounts, payeesById) => transaction =>
  !!investmentAccounts[transaction.account_id] &&
  !transaction.transfer_account_id &&
  get([transaction.payee_id, "name"])(payeesById) !== "Starting Balance";

const isInvestmentTransaction = (
  investmentAccounts,
  payeesById
) => transaction =>
  isContribution(investmentAccounts)(transaction) ||
  isCapitalGainOrLoss(investmentAccounts, payeesById)(transaction);

class Investments extends PureComponent {
  static propTypes = {
    budget: PropTypes.object.isRequired,
    investmentAccounts: PropTypes.object.isRequired
  };

  state = { selectedMonth: null, selectedBreakdown: null };

  handleSelectMonth = month => {
    this.setState(state => ({
      ...state,
      selectedMonth: state.selectedMonth === month ? null : month
    }));
  };

  handleClickBreakdown = breakdown => {
    this.setState(state => ({
      ...state,
      selectedBreakdown:
        state.selectedBreakdown === breakdown ? null : breakdown
    }));
  };

  render() {
    const { budget, investmentAccounts } = this.props;
    const { selectedMonth, selectedBreakdown } = this.state;
    const { payeesById } = budget;

    if (keys(investmentAccounts).length === 0) {
      return (
        <EmptyText>
          You don't have any accounts marked as investment accounts.{" "}
          <Link to={makeLink(pages.settings.path, { budgetId: budget.id })}>
            Go to Settings
          </Link>
        </EmptyText>
      );
    }

    const investmentTransactions = budget.transactions
      .filter(isInvestmentTransaction(investmentAccounts, payeesById))
      .map(transaction => ({ ...transaction, amount: -transaction.amount }));
    const transactionsInMonth =
      selectedMonth &&
      investmentTransactions.filter(
        transaction => getTransactionMonth(transaction) === selectedMonth
      );

    return (
      <Fragment>
        <MonthExclusions budget={budget}>
          {({
            excludeFirstMonth,
            excludeLastMonth,
            months,
            onSetExclusion
          }) => (
            <MonthByMonthSection
              excludeFirstMonth={excludeFirstMonth}
              excludeLastMonth={excludeLastMonth}
              highlightFunction={
                selectedBreakdown &&
                (transaction =>
                  selectedBreakdown === "contribution"
                    ? isContribution(investmentAccounts)(transaction)
                    : isCapitalGainOrLoss(investmentAccounts, payeesById)(
                        transaction
                      ))
              }
              months={months}
              selectedMonth={selectedMonth}
              transactions={investmentTransactions}
              onSelectMonth={this.handleSelectMonth}
              onSetExclusion={onSetExclusion}
            />
          )}
        </MonthExclusions>
        <GenericEntitiesSection
          transactions={transactionsInMonth || investmentTransactions}
          entitiesById={{
            contribution: { name: "Contributions" },
            capitalGain: { name: "Capital Gains/Losses" }
          }}
          title="Growth Breakdown"
          onClickEntity={this.handleClickBreakdown}
          selectedEntityId={selectedBreakdown}
          entityFunction={transaction =>
            isContribution(investmentAccounts)(transaction)
              ? "contribution"
              : "capitalGain"
          }
        />
      </Fragment>
    );
  }
}

export default Investments;

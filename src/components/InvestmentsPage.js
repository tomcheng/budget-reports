import React from "react";
import PropTypes from "prop-types";
import keys from "lodash/fp/keys";
import get from "lodash/fp/get";
import EmptyText from "./EmptyText";
import { Link } from "react-router-dom";
import pages, { makeLink } from "../pages";
import PageLayout from "./PageLayout";
import MonthByMonthSection from "./MonthByMonthSection";
import { getTransactionMonth } from "../budgetUtils";
import GenericEntitiesSection from "./GenericEntitiesSection";
import {
  useMonthExclusions,
  useSelectedEntityId,
  useSelectedMonth
} from "../commonHooks";

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

const InvestmentsPage = ({ budget, investmentAccounts, title, wrapperProps }) => {
  const {
    excludeFirstMonth,
    excludeLastMonth,
    months,
    onSetExclusion
  } = useMonthExclusions(budget);
  const [selectedMonth, onSelectMonth] = useSelectedMonth();
  const [selectedBreakdown, onSelectBreakdown] = useSelectedEntityId();

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
    <PageLayout
      {...wrapperProps}
      title={title}
      fixedContent={
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
          onSelectMonth={onSelectMonth}
          onSetExclusion={onSetExclusion}
        />
      }
      content={
        <GenericEntitiesSection
          transactions={transactionsInMonth || investmentTransactions}
          entitiesById={{
            contribution: { name: "Contributions" },
            capitalGain: { name: "Capital Gains/Losses" }
          }}
          title="Growth Breakdown"
          onClickEntity={onSelectBreakdown}
          selectedEntityId={selectedBreakdown}
          entityFunction={transaction =>
            isContribution(investmentAccounts)(transaction)
              ? "contribution"
              : "capitalGain"
          }
          positiveIsRed
        />
      }
    />
  );
};

InvestmentsPage.propTypes = {
  budget: PropTypes.object.isRequired,
  investmentAccounts: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  wrapperProps: PropTypes.object.isRequired
};

export default InvestmentsPage;

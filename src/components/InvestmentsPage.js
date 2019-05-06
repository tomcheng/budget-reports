import React, { Fragment } from "react";
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

const InvestmentsPage = ({
  budget,
  historyAction,
  investmentAccounts,
  location,
  sidebarTrigger,
  title
}) => {
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

  const investmentTransactions = budget.transactions.filter(
    isInvestmentTransaction(investmentAccounts, payeesById)
  );
  const transactionsInMonth =
    selectedMonth &&
    investmentTransactions.filter(
      transaction => getTransactionMonth(transaction) === selectedMonth
    );

  return (
    <PageLayout
      historyAction={historyAction}
      location={location}
      sidebarTrigger={sidebarTrigger}
      title={title}
      content={
        <Fragment>
          <MonthByMonthSection
            excludeFirstMonth={excludeFirstMonth}
            excludeLastMonth={excludeLastMonth}
            expectPositive
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
          <GenericEntitiesSection
            transactions={transactionsInMonth || investmentTransactions}
            entitiesById={{
              contribution: { name: "Contributions" },
              capitalGain: { name: "Capital Gains/Losses" }
            }}
            expectPositive
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
        </Fragment>
      }
    />
  );
};

InvestmentsPage.propTypes = {
  budget: PropTypes.object.isRequired,
  historyAction: PropTypes.string.isRequired,
  investmentAccounts: PropTypes.object.isRequired,
  location: PropTypes.string.isRequired,
  sidebarTrigger: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
};

export default InvestmentsPage;

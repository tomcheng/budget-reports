import React, { Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getTransactionMonth, sanitizeName } from "../budgetUtils";
import pages, { makeLink } from "../pages";
import PageLayout from "./PageLayout";
import MonthByMonthSection from "./MonthByMonthSection";
import GenericEntitiesSection from "./GenericEntitiesSection";
import TransactionsByMonthSection from "./TransactionsByMonthSection";

const CategoryPage = ({
  categoryId,
  budget,
  excludeFirstMonth,
  excludeLastMonth,
  months,
  selectedMonth,
  selectedPayeeId,
  title,
  transactions,
  wrapperProps,
  onSelectMonth,
  onSelectPayee,
  onSetExclusion
}) => {
  const { categoriesById, payeesById, id: budgetId } = budget;
  const category = categoriesById[categoryId];
  const selectedPayee = selectedPayeeId && payeesById[selectedPayeeId];
  const transactionsForCategory = transactions.filter(
    transaction => transaction.category_id === categoryId
  );
  const transactionsForMonth =
    selectedMonth &&
    transactionsForCategory.filter(
      transaction => getTransactionMonth(transaction) === selectedMonth
    );

  return (
    <PageLayout
      {...wrapperProps}
      budget={budget}
      title={title}
      fixedContent={
        <MonthByMonthSection
          excludeFirstMonth={excludeFirstMonth}
          excludeLastMonth={excludeLastMonth}
          months={months}
          onSetExclusion={onSetExclusion}
          highlightFunction={
            selectedPayeeId &&
            (transaction => transaction.payee_id === selectedPayeeId)
          }
          selectedMonth={selectedMonth}
          title={
            selectedPayee
              ? `Month by Month: ${sanitizeName(selectedPayee.name)}`
              : "Month by Month"
          }
          transactions={transactionsForCategory}
          onSelectMonth={onSelectMonth}
        />
      }
      content={
        <Fragment>
          <GenericEntitiesSection
            key={`payees-${selectedMonth || "all"}`}
            emptyName="(no payee)"
            entitiesById={payeesById}
            entityKey="payee_id"
            linkFunction={payeeId =>
              makeLink(pages.categoryPayee.path, {
                budgetId,
                categoryGroupId: category.category_group_id,
                categoryId: categoryId,
                payeeId
              })
            }
            title={
              selectedMonth
                ? `Payees: ${moment(selectedMonth).format("MMMM")}`
                : "Payees"
            }
            transactions={transactionsForMonth || transactionsForCategory}
            selectedEntityId={selectedPayeeId}
            onClickEntity={onSelectPayee}
            limitShowing
          />
          {selectedMonth &&
            transactionsForMonth.length > 0 && (
              <TransactionsByMonthSection
                key={`transactions-${selectedMonth ||
                  "all"}-${selectedPayeeId || "all"}`}
                categoriesById={categoriesById}
                payeesById={payeesById}
                transactions={transactionsForMonth}
                selectedMonth={selectedMonth}
                selectedPayeeId={selectedPayeeId}
              />
            )}
        </Fragment>
      }
    />
  );
};

CategoryPage.propTypes = {
  budget: PropTypes.shape({
    categoriesById: PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ).isRequired,
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        payee_id: PropTypes.string
      })
    ).isRequired,
    payeesById: PropTypes.object.isRequired
  }).isRequired,
  categoryId: PropTypes.string.isRequired,
  excludeFirstMonth: PropTypes.bool.isRequired,
  excludeLastMonth: PropTypes.bool.isRequired,
  months: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  wrapperProps: PropTypes.object.isRequired,
  onSelectMonth: PropTypes.func.isRequired,
  onSelectPayee: PropTypes.func.isRequired,
  onSetExclusion: PropTypes.func.isRequired,
  selectedMonth: PropTypes.string,
  selectedPayeeId: PropTypes.string
};

export default CategoryPage;

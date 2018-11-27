import React, { Fragment } from "react";
import PropTypes from "prop-types";
import PageLayout from "./PageLayout";
import MonthByMonthSection from "./MonthByMonthSection";
import TransactionsByMonthSection from "./TransactionsByMonthSection";

const CategoryPayeePage = ({
  budget,
  categoryId,
  excludeFirstMonth,
  excludeLastMonth,
  historyAction,
  location,
  months,
  payeeId,
  selectedMonth,
  sidebarTrigger,
  title,
  transactions,
  onSelectMonth,
  onSetExclusion
}) => {
  const { categoriesById, payeesById } = budget;
  const transactionsForCategoryAndPayee = transactions.filter(
    transaction =>
      transaction.category_id === categoryId && transaction.payee_id === payeeId
  );

  return (
    <PageLayout
      historyAction={historyAction}
      location={location}
      sidebarTrigger={sidebarTrigger}
      budget={budget}
      title={title}
      content={
        <Fragment>
          <MonthByMonthSection
            excludeFirstMonth={excludeFirstMonth}
            excludeLastMonth={excludeLastMonth}
            months={months}
            selectedMonth={selectedMonth}
            transactions={transactionsForCategoryAndPayee}
            onSelectMonth={onSelectMonth}
            onSetExclusion={onSetExclusion}
          />
          {selectedMonth && (
            <TransactionsByMonthSection
              categoriesById={categoriesById}
              payeesById={payeesById}
              selectedMonth={selectedMonth}
              transactions={transactionsForCategoryAndPayee}
              limitShowing={false}
            />
          )}
        </Fragment>
      }
    />
  );
};

CategoryPayeePage.propTypes = {
  budget: PropTypes.shape({
    payeesById: PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ).isRequired,
    categoriesById: PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired,
  categoryId: PropTypes.string.isRequired,
  excludeFirstMonth: PropTypes.bool.isRequired,
  excludeLastMonth: PropTypes.bool.isRequired,
  historyAction: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  months: PropTypes.arrayOf(PropTypes.string).isRequired,
  payeeId: PropTypes.string.isRequired,
  sidebarTrigger: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      payee_id: PropTypes.string.isRequired
    })
  ).isRequired,
  onSelectMonth: PropTypes.func.isRequired,
  onSetExclusion: PropTypes.func.isRequired,
  selectedMonth: PropTypes.string
};

export default CategoryPayeePage;

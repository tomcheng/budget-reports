import React from "react";
import PropTypes from "prop-types";
import PageLayout from "./PageLayout";
import MonthByMonthSection from "./MonthByMonthSection";
import TransactionsByMonthSection from "./TransactionsByMonthSection";

const CategoryPayeePage = ({
  budget,
  categoryId,
  excludeFirstMonth,
  excludeLastMonth,
  months,
  payeeId,
  selectedMonth,
  title,
  transactions,
  wrapperProps,
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
      {...wrapperProps}
      budget={budget}
      title={title}
      fixedContent={
        <MonthByMonthSection
          excludeFirstMonth={excludeFirstMonth}
          excludeLastMonth={excludeLastMonth}
          months={months}
          selectedMonth={selectedMonth}
          transactions={transactionsForCategoryAndPayee}
          onSelectMonth={onSelectMonth}
          onSetExclusion={onSetExclusion}
        />
      }
      content={
        selectedMonth && (
          <TransactionsByMonthSection
            categoriesById={categoriesById}
            payeesById={payeesById}
            selectedMonth={selectedMonth}
            transactions={transactionsForCategoryAndPayee}
            limitShowing={false}
          />
        )
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
  months: PropTypes.arrayOf(PropTypes.string).isRequired,
  payeeId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      payee_id: PropTypes.string.isRequired
    })
  ).isRequired,
  wrapperProps: PropTypes.object.isRequired,
  onSelectMonth: PropTypes.func.isRequired,
  onSetExclusion: PropTypes.func.isRequired,
  selectedMonth: PropTypes.string
};

export default CategoryPayeePage;

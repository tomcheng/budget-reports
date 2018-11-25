import React, { Fragment } from "react";
import PropTypes from "prop-types";
import MonthByMonthSection from "./MonthByMonthSection";
import TransactionsByMonthSection from "./TransactionsByMonthSection";

const CategoryPayee = ({
  budget,
  categoryId,
  excludeFirstMonth,
  excludeLastMonth,
  months,
  payeeId,
  selectedMonth,
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
  );
};

CategoryPayee.propTypes = {
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
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      payee_id: PropTypes.string.isRequired
    })
  ).isRequired,
  onSelectMonth: PropTypes.func.isRequired,
  onSetExclusion: PropTypes.func.isRequired,
  selectedMonth: PropTypes.string
};

export default CategoryPayee;

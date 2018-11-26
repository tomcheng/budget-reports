import React from "react";
import PropTypes from "prop-types";
import { getTransactionMonth } from "../budgetUtils";
import PageLayout from "./PageLayout";
import DayByDaySection from "./DayByDaySection";
import TransactionsSection from "./TransactionsSection";

const CurrentMonthCategoryPage = ({
  budget,
  currentMonth,
  categoryId,
  title,
  wrapperProps
}) => {
  const {
    id: budgetId,
    payeesById,
    categoriesById,
    transactions: allTransactions
  } = budget;

  const category = categoriesById[categoryId];
  const transactionsInCategory = allTransactions.filter(
    transaction => transaction.category_id === categoryId
  );
  const transactionsInCategoryForMonth = transactionsInCategory.filter(
    transaction => getTransactionMonth(transaction) === currentMonth
  );

  const spent = -category.activity;
  const available = category.balance;

  return (
    <PageLayout
      {...wrapperProps}
      budget={budget}
      title={title}
      fixedContent={
        <DayByDaySection
          key={category ? category.name : "day-by-day"}
          budgetId={budgetId}
          currentMonth={currentMonth}
          title="Day by Day"
          transactions={transactionsInCategory}
          total={spent + available}
        />
      }
      content={
        <TransactionsSection
          categoriesById={categoriesById}
          payeesById={payeesById}
          transactions={transactionsInCategoryForMonth}
        />
      }
    />
  );
};

CurrentMonthCategoryPage.propTypes = {
  budget: PropTypes.shape({
    categories: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
    payeesById: PropTypes.object.isRequired,
    transactions: PropTypes.array.isRequired
  }).isRequired,
  categoryGroupId: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  currentMonth: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  wrapperProps: PropTypes.object.isRequired
};

export default CurrentMonthCategoryPage;

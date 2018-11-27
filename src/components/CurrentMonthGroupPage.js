import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { getTransactionMonth, sanitizeName } from "../budgetUtils";
import { sumByProp } from "../dataUtils";
import pages, { makeLink } from "../pages";
import PageLayout from "./PageLayout";
import DayByDaySection from "./DayByDaySection";
import GenericEntitiesSection from "./GenericEntitiesSection";
import TransactionsSection from "./TransactionsSection";
import { useSelectedEntityId } from "../commonHooks";

const CurrentMonthGroupPage = ({
  budget,
  categoryGroupId,
  currentMonth,
  historyAction,
  location,
  sidebarTrigger,
  title
}) => {
  const [selectedCategoryId, onSelectCategoryId] = useSelectedEntityId();
  const {
    id: budgetId,
    payeesById,
    categories: allCategories,
    categoriesById,
    transactions: allTransactions
  } = budget;

  const selectedCategory =
    selectedCategoryId && categoriesById[selectedCategoryId];
  const categories = allCategories.filter(
    category => category.category_group_id === categoryGroupId
  );
  const categoryIds = categories.map(category => category.id);
  const transactionsInGroup = allTransactions.filter(transaction =>
    categoryIds.includes(transaction.category_id)
  );
  const transactionsInGroupForMonth = transactionsInGroup.filter(
    transaction => getTransactionMonth(transaction) === currentMonth
  );
  const highlightedTransactions =
    selectedCategoryId &&
    transactionsInGroupForMonth.filter(
      transaction => transaction.category_id === selectedCategoryId
    );

  const spent = -sumByProp("activity")(categories);
  const available = sumByProp("balance")(categories);

  return (
    <PageLayout
      location={location}
      historyAction={historyAction}
      sidebarTrigger={sidebarTrigger}
      budget={budget}
      title={title}
      content={
        <Fragment>
          <DayByDaySection
            budgetId={budgetId}
            currentMonth={currentMonth}
            highlightFunction={
              selectedCategoryId &&
              (transaction => transaction.category_id === selectedCategoryId)
            }
            title={
              selectedCategory
                ? `Day by Day: ${sanitizeName(selectedCategory.name)}`
                : "Day by Day"
            }
            transactions={transactionsInGroup}
            total={spent + available}
          />
          <GenericEntitiesSection
            entityKey="category_id"
            entitiesById={categoriesById}
            linkFunction={categoryId =>
              makeLink(pages.currentMonthCategory.path, {
                budgetId,
                categoryGroupId,
                categoryId
              })
            }
            selectedEntityId={selectedCategoryId}
            title="Categories"
            transactions={transactionsInGroupForMonth}
            showTransactionCount
            onClickEntity={onSelectCategoryId}
          />
          <TransactionsSection
            categoriesById={categoriesById}
            payeesById={payeesById}
            transactions={
              highlightedTransactions || transactionsInGroupForMonth
            }
            title={
              selectedCategory
                ? `Transactions: ${sanitizeName(selectedCategory.name)}`
                : "Transactions"
            }
          />
        </Fragment>
      }
    />
  );
};

CurrentMonthGroupPage.propTypes = {
  budget: PropTypes.shape({
    categories: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
    payeesById: PropTypes.object.isRequired,
    transactions: PropTypes.array.isRequired
  }).isRequired,
  categoryGroupId: PropTypes.string.isRequired,
  currentMonth: PropTypes.string.isRequired,
  historyAction: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  sidebarTrigger: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
};

export default CurrentMonthGroupPage;

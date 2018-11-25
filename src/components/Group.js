import React, { Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import compose from "lodash/fp/compose";
import sortBy from "lodash/fp/sortBy";
import { getTransactionMonth, sanitizeName } from "../budgetUtils";
import pages, { makeLink } from "../pages";
import { useTrendsShowAverage } from "../commonHooks";
import MonthByMonthSection from "./MonthByMonthSection";
import TransactionsByMonthSection from "./TransactionsByMonthSection";
import GenericEntitiesSection from "./GenericEntitiesSection";

const Group = ({
  budget,
  categoryGroup,
  excludeFirstMonth,
  excludeLastMonth,
  months,
  selectedMonth,
  selectedCategoryId,
  transactions,
  onSelectMonth,
  onSelectCategory,
  onSetExclusion
}) => {
  const [showAverage, onToggleShowAverage] = useTrendsShowAverage(budget.id);

  const { categories, categoriesById, payeesById, id: budgetId } = budget;

  const selectedCategory =
    selectedCategoryId && categoriesById[selectedCategoryId];

  const categoriesInGroup = categories.filter(
    category => category.category_group_id === categoryGroup.id
  );
  const categoryIds = categoriesInGroup.map(category => category.id);
  const transactionsInGroup = transactions.filter(transaction =>
    categoryIds.includes(transaction.category_id)
  );
  const transactionsInSelectedMonth =
    selectedMonth &&
    compose([
      sortBy("amount"),
      transactions =>
        transactions.filter(
          transaction => getTransactionMonth(transaction) === selectedMonth
        )
    ])(transactionsInGroup);

  return (
    <Fragment>
      <MonthByMonthSection
        excludeFirstMonth={excludeFirstMonth}
        excludeLastMonth={excludeLastMonth}
        months={months}
        highlightFunction={
          selectedCategoryId &&
          (transaction => transaction.category_id === selectedCategoryId)
        }
        selectedMonth={selectedMonth}
        title={
          selectedCategory
            ? `Month by Month: ${sanitizeName(selectedCategory.name)}`
            : "Month by Month"
        }
        transactions={transactionsInGroup}
        onSelectMonth={onSelectMonth}
        onSetExclusion={onSetExclusion}
      />
      <GenericEntitiesSection
        key={`categories-${selectedMonth || "all"}`}
        entityKey="category_id"
        entitiesById={categoriesById}
        linkFunction={categoryId =>
          makeLink(pages.category.path, {
            budgetId,
            categoryGroupId: categoryGroup.id,
            categoryId
          })
        }
        title={
          selectedMonth
            ? `Categories: ${moment(selectedMonth).format("MMMM")}`
            : "Categories"
        }
        transactions={transactionsInSelectedMonth || transactionsInGroup}
        selectedEntityId={selectedCategoryId}
        onClickEntity={onSelectCategory}
        showAverageToggle={!selectedMonth}
        showAverage={showAverage && !selectedMonth}
        numMonths={months.length}
        onToggleAverage={onToggleShowAverage}
        limitShowing
      />
      {selectedMonth &&
        transactionsInSelectedMonth.length > 0 && (
          <TransactionsByMonthSection
            key={`transactions-${selectedMonth || "all"}-${selectedCategoryId ||
              "all"}`}
            categoriesById={categoriesById}
            payeesById={payeesById}
            selectedMonth={selectedMonth}
            selectedCategoryId={selectedCategoryId}
            transactions={transactionsInSelectedMonth}
          />
        )}
    </Fragment>
  );
};

Group.propTypes = {
  budget: PropTypes.shape({
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        categoryId: PropTypes.string
      })
    ).isRequired,
    payeesById: PropTypes.object.isRequired
  }).isRequired,
  categoryGroup: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  excludeFirstMonth: PropTypes.bool.isRequired,
  excludeLastMonth: PropTypes.bool.isRequired,
  months: PropTypes.arrayOf(PropTypes.string).isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectCategory: PropTypes.func.isRequired,
  onSelectMonth: PropTypes.func.isRequired,
  onSetExclusion: PropTypes.func.isRequired,
  selectedCategoryId: PropTypes.string,
  selectedMonth: PropTypes.string
};

export default Group;

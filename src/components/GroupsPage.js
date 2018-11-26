import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getTransactionMonth, sanitizeName } from "../budgetUtils";
import pages, { makeLink } from "../pages";
import { useTrendsShowAverage } from "../commonHooks";
import PageLayout from "./PageLayout";
import MonthByMonthSection from "./MonthByMonthSection";
import GenericEntitiesSection from "./GenericEntitiesSection";

const GroupsPage = ({
  budget,
  excludeFirstMonth,
  excludeLastMonth,
  months,
  title,
  transactions,
  selectedMonth,
  selectedGroupId,
  wrapperProps,
  onSelectGroup,
  onSelectMonth,
  onSetExclusion
}) => {
  const [showAverage, onToggleShowAverage] = useTrendsShowAverage(budget.id);

  const { categoryGroupsById, categoriesById, id: budgetId } = budget;
  const selectedGroup = selectedGroupId && categoryGroupsById[selectedGroupId];

  const transactionsForMonth =
    selectedMonth &&
    transactions.filter(
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
            selectedGroupId &&
            (transaction =>
              categoriesById[transaction.category_id].category_group_id ===
              selectedGroupId)
          }
          months={months}
          selectedMonth={selectedMonth}
          title={
            selectedGroup
              ? `Month by Month: ${sanitizeName(selectedGroup.name)}`
              : "Month by Month"
          }
          transactions={transactions}
          onSelectMonth={onSelectMonth}
          onSetExclusion={onSetExclusion}
        />
      }
      content={
        <GenericEntitiesSection
          key={selectedMonth || "all"}
          entityFunction={transaction =>
            categoriesById[transaction.category_id].category_group_id
          }
          entityKey="category_group_id"
          entitiesById={categoryGroupsById}
          linkFunction={categoryGroupId =>
            makeLink(pages.group.path, { budgetId, categoryGroupId })
          }
          selectedEntityId={selectedGroupId}
          title={
            selectedMonth
              ? `Category Groups: ${moment(selectedMonth).format("MMMM")}`
              : "Category Groups"
          }
          transactions={transactionsForMonth || transactions}
          onClickEntity={onSelectGroup}
          numMonths={months.length}
          showAverageToggle={!selectedMonth}
          showAverage={showAverage && !selectedMonth}
          onToggleAverage={onToggleShowAverage}
          limitShowing
        />
      }
    />
  );
};

GroupsPage.propTypes = {
  budget: PropTypes.object.isRequired,
  excludeFirstMonth: PropTypes.bool.isRequired,
  excludeLastMonth: PropTypes.bool.isRequired,
  months: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  wrapperProps: PropTypes.object.isRequired,
  onSelectGroup: PropTypes.func.isRequired,
  onSelectMonth: PropTypes.func.isRequired,
  onSetExclusion: PropTypes.func.isRequired,
  selectedGroupId: PropTypes.string,
  selectedMonth: PropTypes.string
};

export default GroupsPage;

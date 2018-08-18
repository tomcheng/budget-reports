import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import compose from "lodash/fp/compose";
import sortBy from "lodash/fp/sortBy";
import { getSetting, setSetting } from "../uiRepo";
import { getTransactionMonth, sanitizeName } from "../budgetUtils";
import pages, { makeLink } from "../pages";
import MonthByMonthSection from "./MonthByMonthSection";
import TransactionsByMonthSection from "./TransactionsByMonthSection";
import GenericEntitiesSection from "./GenericEntitiesSection";

class Group extends PureComponent {
  static propTypes = {
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
    firstMonth: PropTypes.string.isRequired,
    numMonths: PropTypes.number.isRequired,
    transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSelectCategory: PropTypes.func.isRequired,
    onSelectMonth: PropTypes.func.isRequired,
    onSetExclusion: PropTypes.func.isRequired,
    selectedCategoryId: PropTypes.string,
    selectedMonth: PropTypes.string
  };

  constructor(props) {
    super();

    this.state = {
      showAverage: getSetting("trendsShowAverage", props.budget.id)
    };
  }

  handleToggleAverage = () => {
    this.setState(
      state => ({ ...state, showAverage: !state.showAverage }),
      () => {
        setSetting(
          "trendsShowAverage",
          this.props.budget.id,
          this.state.showAverage
        );
      }
    );
  };

  render() {
    const {
      budget,
      categoryGroup,
      excludeFirstMonth,
      excludeLastMonth,
      firstMonth,
      numMonths,
      selectedMonth,
      selectedCategoryId,
      transactions,
      onSelectMonth,
      onSelectCategory,
      onSetExclusion
    } = this.props;
    const { showAverage } = this.state;
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
          firstMonth={firstMonth}
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
          numMonths={numMonths}
          onToggleAverage={this.handleToggleAverage}
          limitShowing
        />
        {selectedMonth &&
          transactionsInSelectedMonth.length > 0 && (
            <TransactionsByMonthSection
              key={`transactions-${selectedMonth ||
                "all"}-${selectedCategoryId || "all"}`}
              categoriesById={categoriesById}
              payeesById={payeesById}
              selectedMonth={selectedMonth}
              selectedCategoryId={selectedCategoryId}
              transactions={transactionsInSelectedMonth}
            />
          )}
      </Fragment>
    );
  }
}

export default Group;

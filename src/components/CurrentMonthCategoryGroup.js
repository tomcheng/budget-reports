import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import sortBy from "lodash/fp/sortBy";
import takeWhile from "lodash/fp/takeWhile";
import { sumByProp } from "../optimized";
import { getTransactionMonth } from "../utils";
import PageWrapper from "./PageWrapper";
import { SecondaryText } from "./typeComponents";
import CategoryGroupTitle from "./CategoryGroupTitle";
import CurrentMonthCategoryGroupBody from "./CurrentMonthCategoryGroupBody";
import LabelWithTransactionCount from "./LabelWithTransactionCount";
import AmountWithPercentage from "./AmountWithPercentage";

class CurrentMonthCategoryGroup extends Component {
  static propTypes = {
    authorized: PropTypes.bool.isRequired,
    budgetId: PropTypes.string.isRequired,
    categoryGroupId: PropTypes.string.isRequired,
    currentMonth: PropTypes.string.isRequired,
    onAuthorize: PropTypes.func.isRequired,
    onRequestBudget: PropTypes.func.isRequired,
    budget: PropTypes.shape({
      categoryGroups: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired
        })
      ).isRequired
    })
  };

  state = { selectedCategoryId: null, menuExpanded: false };

  handleSelectCategory = id => {
    this.setState(state => ({
      ...state,
      selectedCategoryId: id === state.selectedCategoryId ? null : id,
      menuExpanded: false
    }));
  };

  handleClearCategory = () => {
    this.setState({ selectedCategoryId: null, menuExpanded: false });
  };

  handleToggleMenu = () => {
    this.setState(state => ({ ...state, menuExpanded: !state.menuExpanded }));
  };

  render() {
    const { budget, categoryGroupId, currentMonth, ...other } = this.props;
    const { selectedCategoryId, menuExpanded } = this.state;
    let headerMenuOptions;
    let categoryStats;
    let amountForGroup;

    if (budget) {
      const { categories, transactions } = budget;

      const categoriesInGroup = categories.filter(
        category => category.categoryGroupId === categoryGroupId
      );

      const transactionsThisMonth = takeWhile(
        transaction => getTransactionMonth(transaction) === currentMonth
      )(transactions);

      amountForGroup = 0;

      categoryStats = categoriesInGroup.reduce((stats, category) => {
        const transactionsInCategory = transactionsThisMonth.filter(
          transaction => transaction.categoryId === category.id
        );
        const amountForCategory = sumByProp("amount")(transactionsInCategory);

        amountForGroup += amountForCategory;

        return {
          ...stats,
          [category.id]: {
            transactions: transactionsInCategory.length,
            amount: amountForCategory
          }
        };
      }, {});

      headerMenuOptions = compose([
        sortBy(category => categoryStats[category.id].amount),
        sortBy("name"),
        categories =>
          categories.filter(
            category => categoryStats[category.id].transactions > 0
          )
      ])(categoriesInGroup);
    }

    return (
      <PageWrapper
        {...other}
        budgetLoaded={!!budget}
        backLink
        bodyStyle={{
          overflowY: "hidden",
          display: "flex",
          flexDirection: "column"
        }}
        title={
          budget ? (
            <CategoryGroupTitle
              budget={budget}
              categoryGroupId={categoryGroupId}
              categoryId={selectedCategoryId}
              onClearCategory={this.handleClearCategory}
            />
          ) : (
            ""
          )
        }
        headerMenu={{
          options: headerMenuOptions,
          renderer: category => (
            <Fragment key={category.id}>
              <SecondaryText>
                <LabelWithTransactionCount
                  count={categoryStats[category.id].transactions}
                  label={category.name}
                />
              </SecondaryText>
              <SecondaryText>
                <AmountWithPercentage
                  amount={categoryStats[category.id].amount}
                  total={amountForGroup}
                />
              </SecondaryText>
            </Fragment>
          ),
          selected: selectedCategoryId,
          onSelect: this.handleSelectCategory,
          onToggle: this.handleToggleMenu,
          expanded: menuExpanded,
          expandedLabel: "hide categories",
          collapsedLabel: "show categories"
        }}
        content={() => (
          <CurrentMonthCategoryGroupBody
            budget={budget}
            categoryGroupId={categoryGroupId}
            currentMonth={currentMonth}
            selectedCategoryId={selectedCategoryId}
          />
        )}
      />
    );
  }
}

export default CurrentMonthCategoryGroup;

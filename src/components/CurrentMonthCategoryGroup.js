import React, { Component } from "react";
import PropTypes from "prop-types";
import PageWrapper from "./PageWrapper";
import CategoryGroupTitle from "./CategoryGroupTitle";
import CurrentMonthCategoryGroupBody from "./CurrentMonthCategoryGroupBody";

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

  state = { selectedCategoryId: null };

  handleSelectCategory = id => {
    this.setState(state => ({
      ...state,
      selectedCategoryId: id === state.selectedCategoryId ? null : id
    }));
  };

  handleClearCategory = () => {
    this.setState({ selectedCategoryId: null });
  };

  render() {
    const { budget, categoryGroupId, currentMonth, ...other } = this.props;
    const { selectedCategoryId } = this.state;

    return (
      <PageWrapper
        {...other}
        budgetLoaded={!!budget}
        backLink
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
        content={() => (
          <CurrentMonthCategoryGroupBody
            budget={budget}
            categoryGroupId={categoryGroupId}
            currentMonth={currentMonth}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={this.handleSelectCategory}
          />
        )}
      />
    );
  }
}

export default CurrentMonthCategoryGroup;

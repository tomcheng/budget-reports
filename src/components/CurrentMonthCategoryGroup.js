import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/fp/get";
import PageWrapper from "./PageWrapper";
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

  render() {
    const { budget, categoryGroupId, currentMonth, ...other } = this.props;
    const { selectedCategoryId } = this.state;

    return (
      <PageWrapper
        {...other}
        budgetLoaded={!!budget}
        backLink
        title={
          get(["categoryGroupsById", categoryGroupId, "name"])(budget) || ""
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

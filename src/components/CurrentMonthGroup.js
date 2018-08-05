import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { getCurrentMonthLink } from "../linkUtils";
import PageWrapper from "./PageWrapper";
import CategoryGroupTitle from "./CategoryGroupTitle";
import CurrentMonthGroupBody from "./CurrentMonthGroupBody";

class CurrentMonthGroup extends Component {
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
    }),
    categoryId: PropTypes.string
  };

  constructor(props) {
    super();
    this.state = {
      selectedCategoryId: props.categoryId || null,
      menuExpanded: false
    };
  }

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
    const { budget, budgetId, categoryGroupId, currentMonth, ...other } = this.props;
    const { selectedCategoryId } = this.state;

    return (
      <PageWrapper
        {...other}
        budgetId={budgetId}
        budgetLoaded={!!budget}
        backLink
        bodyStyle={{
          overflowY: "hidden",
          display: "flex",
          flexDirection: "column"
        }}
        parentLink={{
          label: "Current Month Spending",
          to: getCurrentMonthLink({ budgetId })
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
        content={() => (
          <CurrentMonthGroupBody
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

export default CurrentMonthGroup;

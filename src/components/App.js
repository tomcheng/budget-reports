import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import keyBy from "lodash/keyBy";
import { getBudgets, getBudget, AUTHORIZE_URL } from "../ynabRepo";
import Unauthorized from "./Unauthorized";
import Loading from "./Loading";
import Budgets from "./Budgets";
import Budget from "./Budget";
import Category from "./Category";

class App extends Component {
  static propTypes = {
    isAuthorized: PropTypes.bool.isRequired
  };

  state = {
    budgetsLoaded: false,
    budgetIds: [],
    budgets: {},
    selectedBudgetId: null,
    selectedCategoryId: null
  };

  componentDidMount() {
    if (!this.props.isAuthorized) {
      return;
    }

    getBudgets().then(({ budgets }) => {
      this.setState(
        {
          budgetsLoaded: true,
          budgetIds: budgets.map(b => b.id),
          budgets: keyBy(budgets, "id"),
          selectedBudgetId:
            budgets.length === 1 ? get(budgets, [0, "id"]) : null
        },
        () => {
          budgets.forEach(({ id }) => {
            getBudget(id).then(({ budget }) => {
              this.setState(state => ({
                ...state,
                budgets: {
                  ...state.budgets,
                  [id]: {
                    ...state.budgets[id],
                    details: budget
                  }
                }
              }));
            });
          });
        }
      );
    });
  }

  handleAuthorize = () => {
    window.location.replace(AUTHORIZE_URL);
  };

  handleSelectBudget = id => {
    this.setState({ selectedBudgetId: id });
  };

  handleSelectCategory = id => {
    this.setState({ selectedCategoryId: id });
  };

  render() {
    const { isAuthorized } = this.props;
    const {
      budgetsLoaded,
      budgetIds,
      budgets,
      selectedBudgetId,
      selectedCategoryId
    } = this.state;

    if (!isAuthorized) {
      return <Unauthorized onAuthorize={this.handleAuthorize} />;
    }

    if (!budgetsLoaded) {
      return <Loading />;
    }

    if (!selectedBudgetId) {
      return (
        <Budgets
          budgets={budgetIds.map(id => budgets[id])}
          onSelectBudget={this.handleSelectBudget}
        />
      );
    }

    if (!selectedCategoryId) {
      return (
        <Budget
          budget={budgets[selectedBudgetId]}
          onSelectCategory={this.handleSelectCategory}
        />
      );
    }

    return <Category />;
  }
}

export default App;

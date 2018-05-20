import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
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
    selectedCategoryId: null,
    currentMonth: moment().format("YYYY-MM")
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
                    ...budget,
                    payees: keyBy(budget.payees, "id")
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
      selectedCategoryId,
      currentMonth
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

    const selectedBudget = budgets[selectedBudgetId];

    if (!selectedCategoryId) {
      return (
        <Budget
          budget={selectedBudget}
          onSelectCategory={this.handleSelectCategory}
        />
      );
    }

    const category = selectedBudget.categories.find(
      c => c.id === selectedCategoryId
    );
    const transactions = selectedBudget.transactions.filter(
      t => t.categoryId === category.id && t.date.slice(0, 7) === currentMonth
    );

    return (
      <Category
        category={category}
        transactions={transactions}
        payees={selectedBudget.payees}
        onClearCategory={() => {
          this.handleSelectCategory(null);
        }}
      />
    );
  }
}

export default App;

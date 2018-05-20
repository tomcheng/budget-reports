import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import keyBy from "lodash/keyBy";
import { clientId, redirectUri } from "../ynabConfig";
import { getBudgets, getBudget } from "../ynabRepo";
import Budgets from "./Budgets";
import Unauthorized from "./Unauthorized";
import Loading from "./Loading";
import CategoryGroup from "./CategoryGroup";

const AUTHORIZE_URL =
  "https://app.youneedabudget.com/oauth/authorize?client_id=" +
  clientId +
  "&redirect_uri=" +
  redirectUri +
  "&response_type=token";

class App extends Component {
  static propTypes = {
    isAuthorized: PropTypes.bool.isRequired
  };

  state = {
    budgetIds: [],
    budgets: {},
    selected: null,
    selectedBudgetId: null
  };

  componentDidMount() {
    if (!this.props.isAuthorized) {
      return;
    }

    getBudgets().then(({ budgets }) => {
      this.setState(
        {
          budgetIds: budgets.map(b => b.id),
          budgets: keyBy(budgets, "id"),
          selected:
            budgets.length === 1
              ? {
                  type: "budget",
                  id: get(budgets, [0, "id"])
                }
              : null
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
    this.setState({ selected: { type: "budget", id } });
  };

  handleSelectCategory = id => {
    this.setState({ selected: { type: "category", id } });
  };

  render() {
    const { isAuthorized } = this.props;
    const { budgetIds, budgets, selected } = this.state;

    if (!isAuthorized) {
      return <Unauthorized onAuthorize={this.handleAuthorize} />;
    }

    if (!selected) {
      return <Loading />;
    }

    if (selected.type === "category") {
      return <div>Show category here.</div>;
    }

    const selectedCategoryGroups = get(budgets, [
      selected.id,
      "details",
      "categoryGroups"
    ]);
    const selectedCategories = get(budgets, [
      selected.id,
      "details",
      "categories"
    ]);

    return (
      <div>
        {budgetIds.length > 1 && (
          <Budgets
            budgets={budgetIds.map(id => budgets[id])}
            onSelectBudget={this.handleSelectBudget}
          />
        )}
        {selectedCategoryGroups &&
          selectedCategoryGroups.map(categoryGroup => (
            <CategoryGroup
              key={categoryGroup.id}
              categoryGroup={categoryGroup}
              categories={selectedCategories.filter(
                c => c.categoryGroupId === categoryGroup.id
              )}
              onSelectCategory={this.handleSelectCategory}
            />
          ))}
      </div>
    );
  }
}

export default App;

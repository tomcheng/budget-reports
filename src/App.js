import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import keyBy from "lodash/keyBy";
import values from "lodash/values";
import { clientId, redirectUri } from "./ynabConfig";
import { getBudgets, getBudget, getCategories } from "./ynabRepo";
import CategoryGroup from "./components/CategoryGroup";

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
    budgets: {},
    selectedBudgetId: null
  };

  componentDidMount() {
    if (this.props.isAuthorized) {
      getBudgets().then(({ budgets }) => {
        this.setState(
          {
            budgets: keyBy(budgets, "id"),
            selectedBudgetId: get(budgets, [0, "id"])
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
  }

  handleClickAuthorize = () => {
    window.location.replace(AUTHORIZE_URL);
  };

  handleClickBudget = id => {
    getCategories(id).then();
  };

  render() {
    const { isAuthorized } = this.props;
    const { budgets, selectedBudgetId } = this.state;

    if (!isAuthorized) {
      return (
        <button onClick={this.handleClickAuthorize}>Authorize YNAB</button>
      );
    }

    const selectedCategoryGroups = get(budgets, [
      selectedBudgetId,
      "details",
      "categoryGroups"
    ]);
    const selectedCategories = get(budgets, [
      selectedBudgetId,
      "details",
      "categories"
    ]);

    return (
      <div>
        {values(budgets).map(({ id, name }) => (
          <div
            key={id}
            onClick={() => {
              this.handleClickBudget(id);
            }}
          >
            {name}
          </div>
        ))}
        {selectedCategoryGroups &&
          selectedCategoryGroups.map(categoryGroup => (
            <CategoryGroup
              key={categoryGroup.id}
              categoryGroup={categoryGroup}
              categories={selectedCategories.filter(
                c => c.categoryGroupId === categoryGroup.id
              )}
            />
          ))}
      </div>
    );
  }
}

export default App;

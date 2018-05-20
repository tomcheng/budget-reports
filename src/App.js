import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import keyBy from "lodash/keyBy";
import values from "lodash/values";
import { clientId, redirectUri } from "./ynabConfig";
import { getBudgets, getBudget } from "./ynabRepo";
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
          budgets: keyBy(budgets, "id"),
          selected: {
            type: "budget",
            id: get(budgets, [0, "id"])
          }
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

  handleClickAuthorize = () => {
    window.location.replace(AUTHORIZE_URL);
  };

  handleClickBudget = id => {
    this.setState({ selected: { type: "budget", id } });
  };

  handleSelectCategory = id => {
    this.setState({ selected: { type: "category", id } });
  };

  render() {
    const { isAuthorized } = this.props;
    const { budgets, selected } = this.state;

    if (!isAuthorized) {
      return (
        <button onClick={this.handleClickAuthorize}>Authorize YNAB</button>
      );
    }

    if (!selected) {
      return <div>Loading...</div>;
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
              onSelectCategory={this.handleSelectCategory}
            />
          ))}
      </div>
    );
  }
}

export default App;

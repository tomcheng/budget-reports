import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
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
    budgets: [],
    categoryGroups: {},
    selectedBudgetId: null
  };

  componentDidMount() {
    if (this.props.isAuthorized) {
      getBudgets().then(({ budgets }) => {
        this.setState(
          { budgets, selectedBudgetId: get(budgets, [0, "id"]) },
          () => {
            this.state.budgets.forEach(({ id }) => {
              getBudget(id).then(args => console.log(args))
              getCategories(id).then(({ categoryGroups }) => {
                this.setState(state => ({
                  ...state,
                  categoryGroups: {
                    ...state.categoryGroups,
                    [id]: categoryGroups
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
    const { budgets, selectedBudgetId, categoryGroups } = this.state;

    if (!isAuthorized) {
      return (
        <button onClick={this.handleClickAuthorize}>Authorize YNAB</button>
      );
    }

    return (
      <div>
        {budgets.map(({ id, name }) => (
          <div
            key={id}
            onClick={() => {
              this.handleClickBudget(id);
            }}
          >
            {name}
          </div>
        ))}
        {categoryGroups[selectedBudgetId] &&
          categoryGroups[selectedBudgetId].map(categoryGroup => (
            <CategoryGroup
              key={categoryGroup.id}
              categoryGroup={categoryGroup}
            />
          ))}
      </div>
    );
  }
}

export default App;

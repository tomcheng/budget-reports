import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import { clientId, redirectUri } from "./ynabConfig";
import { getBudgets, getCategories } from "./ynabRepo";

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
    category_groups: {},
    selectedBudgetId: null
  };

  componentDidMount() {
    if (this.props.isAuthorized) {
      getBudgets().then(({ budgets }) => {
        this.setState(
          { budgets, selectedBudgetId: get(budgets, [0, "id"]) },
          () => {
            this.state.budgets.forEach(({ id }) => {
              getCategories(id).then(({ category_groups }) => {
                this.setState(state => ({
                  ...state,
                  category_groups: {
                    ...state.category_groups,
                    [id]: category_groups
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
    const { budgets, selectedBudgetId, category_groups } = this.state;

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
        {category_groups[selectedBudgetId] &&
          category_groups[selectedBudgetId].map(group => (
            <div key={group.id}>{group.name}</div>
          ))}
      </div>
    );
  }
}

export default App;

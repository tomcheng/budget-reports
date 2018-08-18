import React from "react";
import PropTypes from "prop-types";
import pages, { makeLink } from "../pages";
import { Switch, Route, Link } from "react-router-dom";
import { SecondaryText } from "./typeComponents";

const PageActions = ({ settings, onChangeSetting }) => (
  <Switch>
    <Route
      path={pages.currentMonth.path}
      exact
      render={({ match }) => (
        <SecondaryText>
          <Link to={makeLink(pages.groups.path, match.params)}>
            Past Months
          </Link>
        </SecondaryText>
      )}
    />
    <Route
      path={pages.currentMonthGroup.path}
      exact
      render={({ match }) => (
        <SecondaryText>
          <Link to={makeLink(pages.group.path, match.params)}>Past Months</Link>
        </SecondaryText>
      )}
    />
    <Route
      path={pages.currentMonthCategory.path}
      exact
      render={({ match }) => (
        <SecondaryText>
          <Link to={makeLink(pages.category.path, match.params)}>
            Past Months
          </Link>
        </SecondaryText>
      )}
    />
    <Route
      path={pages.groups.path}
      exact
      render={({ match }) => (
        <SecondaryText>
          <Link to={makeLink(pages.currentMonth.path, match.params)}>
            Current Month
          </Link>
        </SecondaryText>
      )}
    />
    <Route
      path={pages.group.path}
      exact
      render={({ match }) => (
        <SecondaryText>
          <Link to={makeLink(pages.currentMonthGroup.path, match.params)}>
            Current Month
          </Link>
        </SecondaryText>
      )}
    />
    <Route
      path={pages.category.path}
      exact
      render={({ match }) => (
        <SecondaryText>
          <Link to={makeLink(pages.currentMonthCategory.path, match.params)}>
            Current Month
          </Link>
        </SecondaryText>
      )}
    />
    <Route
      path={pages.incomeVsExpenses.path}
      exact
      render={() => (
        <SecondaryText
          onClick={() => {
            onChangeSetting({
              setting: "incomeVsExpensesShowing",
              value:
                settings.incomeVsExpensesShowing === "average"
                  ? "total"
                  : "average"
            });
          }}
          style={{ userSelect: "none" }}
        >
          {settings.incomeVsExpensesShowing}
        </SecondaryText>
      )}
    />
  </Switch>
);

PageActions.propTypes = {
  settings: PropTypes.object.isRequired,
  onChangeSetting: PropTypes.func.isRequired
};

export default PageActions;

import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
import values from "lodash/fp/values";
import pages, { makeLink } from "../pages";

const PageContent = props =>
  props.budget && (
    <Switch>
      {values(pages).map(({ path, props: propsFunction, Component }) => (
        <Route
          key={path}
          path={path}
          exact
          render={({ match }) => (
            <Component {...propsFunction(props, match.params)} />
          )}
        />
      ))}
      <Route
        render={() => (
          <div style={{ padding: 20 }}>
            <Link
              to={makeLink(pages.currentMonth.path, {
                budgetId: props.budget.id
              })}
            >
              Return to {pages.currentMonth.title}
            </Link>
          </div>
        )}
      />
    </Switch>
  );

PageContent.propTypes = {
  currentMonth: PropTypes.string.isRequired,
  investmentAccounts: PropTypes.object.isRequired,
  mortgageAccounts: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  onUpdateAccounts: PropTypes.func.isRequired,
  budget: PropTypes.object
};

export default PageContent;

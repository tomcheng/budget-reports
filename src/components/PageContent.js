import React from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import values from "lodash/fp/values";
import pages from "../pages";

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

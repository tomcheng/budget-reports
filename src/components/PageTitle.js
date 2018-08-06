import React from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import values from "lodash/fp/values";
import pages from "../pages";

const PageTitle = ({ budget }) =>
  budget && (
    <Switch>
      {values(pages).map(({ path, title }) => (
        <Route
          key={path}
          path={path}
          exact
          render={props =>
            typeof title === "function"
              ? title(props.match.params, budget)
              : title
          }
        />
      ))}
    </Switch>
  );

PageTitle.propTypes = {
  budget: PropTypes.object
};

export default PageTitle;

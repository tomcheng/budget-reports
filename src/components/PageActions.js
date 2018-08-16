import React from "react";
import PropTypes from "prop-types";
import pages from "../pages";
import { Switch, Route } from "react-router-dom";
import { SecondaryText } from "./typeComponents";

const PageActions = ({ settings, onChangeSetting }) => (
  <Switch>
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

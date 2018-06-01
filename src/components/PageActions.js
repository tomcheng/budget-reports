import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getLastUpdated } from "../uiRepo";
import { MinorText } from "./typeComponents";

const PageActions = ({ budgetId, onRefreshBudget }) => (
  <div style={{ textAlign: "right" }}>
    <button
      onClick={() => {
        onRefreshBudget(budgetId);
      }}
    >
      Refresh
    </button>
    <MinorText>
      Updated {moment(getLastUpdated(budgetId) || undefined).fromNow()}
    </MinorText>
  </div>
);

PageActions.propTypes = {
  budgetId: PropTypes.string.isRequired,
  onRefreshBudget: PropTypes.func.isRequired
};

export default PageActions;

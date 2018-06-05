import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getLastUpdated } from "../uiRepo";
import { MinorText } from "./typeComponents";
import Icon from "./Icon";
import Dropdown from "./Dropdown";

const PageActions = ({ budgetId, onRefreshBudget }) => (
  <Dropdown
    align="right"
    links={[
      {
        to: `/budgets/${budgetId}/expenses-vs-income`,
        label: "Expenses vs Income"
      }
    ]}
    dropdownContent={
      <Dropdown.ContentWrapper>
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
      </Dropdown.ContentWrapper>
    }
  >
    {({ ref, triggerStyle, onClick }) => (
      <div
        style={{
          ...triggerStyle,
          width: 50,
          display: "flex",
          alignSelf: "stretch",
          justifyContent: "center",
          alignItems: "center"
        }}
        onClick={onClick}
        ref={ref}
      >
        <Icon icon="ellipsis-v" />
      </div>
    )}
  </Dropdown>
);

PageActions.propTypes = {
  budgetId: PropTypes.string.isRequired,
  onRefreshBudget: PropTypes.func.isRequired
};

export default PageActions;

import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getLastUpdated } from "../../uiRepo";
import { MinorText } from "../common/typeComponents";
import Icon from "../common/Icon";
import Dropdown from "../common/Dropdown";

const PageActions = ({ budgetId, onRefreshBudget }) => (
  <Dropdown
    align="right"
    links={[
      {
        to: `/budgets/${budgetId}/income-vs-expenses`,
        label: "Income vs Expenses"
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

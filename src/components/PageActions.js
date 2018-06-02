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
      {({ onClick, ref }) => (
        <span onClick={onClick} ref={ref}>
          <Icon icon="ellipsis-v" />
        </span>
      )}
    </Dropdown>
);

PageActions.propTypes = {
  budgetId: PropTypes.string.isRequired,
  onRefreshBudget: PropTypes.func.isRequired
};

export default PageActions;

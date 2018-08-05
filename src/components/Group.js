import React from "react";
import PropTypes from "prop-types";
import get from "lodash/fp/get";
import { getCategoryGroupsLink } from "../linkUtils";
import PageWrapper from "./PageWrapper";
import GroupBody from "./GroupBody";

const Group = ({ budget, budgetId, categoryGroupId, ...other }) => {
  const group = get(["categoryGroupsById", categoryGroupId])(budget);
  return (
    <PageWrapper
      {...other}
      budgetId={budgetId}
      budgetLoaded={!!budget}
      title={group ? group.name : ""}
      parentLink={{
        label: "Categories",
        to: getCategoryGroupsLink({ budgetId })
      }}
      content={() => (
        <GroupBody budget={budget} categoryGroup={group} />
      )}
      backLink
    />
  );
};

Group.propTypes = {
  authorized: PropTypes.bool.isRequired,
  budgetId: PropTypes.string.isRequired,
  categoryGroupId: PropTypes.string.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  budget: PropTypes.object
};

export default Group;

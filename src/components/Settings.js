import React from "react";
import PropTypes from "prop-types";
import PageWrapper from "./PageWrapper";
import SettingsBody from "./SettingsBody";

const Settings = ({
  budget,
  investmentAccounts,
  mortgageAccounts,
  onUpdateAccounts,
  ...other
}) => (
  <PageWrapper
    {...other}
    budgetLoaded={!!budget}
    title="Budget Settings"
    content={() => (
      <SettingsBody
        budget={budget}
        investmentAccounts={investmentAccounts}
        mortgageAccounts={mortgageAccounts}
        onUpdateAccounts={onUpdateAccounts}
      />
    )}
  />
);

Settings.propTypes = {
  authorized: PropTypes.bool.isRequired,
  budgetId: PropTypes.string.isRequired,
  investmentAccounts: PropTypes.object.isRequired,
  mortgageAccounts: PropTypes.object.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  onUpdateAccounts: PropTypes.func.isRequired,
  budget: PropTypes.object
};

export default Settings;

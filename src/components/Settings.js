import React from "react";
import PropTypes from "prop-types";
import PageWrapper from "./PageWrapper";
import SettingsBody from "./SettingsBody";

const Settings = ({
  authorized,
  budgetId,
  budget,
  investmentAccounts,
  mortgageAccounts,
  onAuthorize,
  onRequestBudget
}) => (
  <PageWrapper
    authorized={authorized}
    budgetId={budgetId}
    budgetLoaded={!!budget}
    onAuthorize={onAuthorize}
    onRequestBudget={onRequestBudget}
    title="Budget Settings"
    content={() => (
      <SettingsBody
        budget={budget}
        investmentAccounts={investmentAccounts}
        mortgageAccounts={mortgageAccounts}
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
  budget: PropTypes.object
};

export default Settings;

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Section from "./Section";
import PageLayout from "./PageLayout";
import SettingsInvestmentAccounts from "./SettingsInvestmentAccounts";
import SettingsMortgageAccounts from "./SettingsMortgageAccounts";

const Space = styled.div`
  height: 20px;
`;

const SettingsPage = ({
  budget,
  historyAction,
  investmentAccounts,
  location,
  mortgageAccounts,
  sidebarTrigger,
  title,
  onUpdateAccounts
}) => {
  return (
    <PageLayout
      historyAction={historyAction}
      location={location}
      sidebarTrigger={sidebarTrigger}
      title={title}
      content={
        <Fragment>
          <Section>
            <SettingsInvestmentAccounts
              budget={budget}
              investmentAccounts={investmentAccounts}
              onUpdateAccounts={onUpdateAccounts}
            />
            <Space />
            <SettingsMortgageAccounts
              budget={budget}
              mortgageAccounts={mortgageAccounts}
              onUpdateAccounts={onUpdateAccounts}
            />
          </Section>
        </Fragment>
      }
    />
  );
};

SettingsPage.propTypes = {
  budget: PropTypes.shape({
    accounts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired,
  historyAction: PropTypes.string.isRequired,
  investmentAccounts: PropTypes.objectOf(PropTypes.bool).isRequired,
  location: PropTypes.string.isRequired,
  mortgageAccounts: PropTypes.objectOf(PropTypes.bool).isRequired,
  sidebarTrigger: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  onUpdateAccounts: PropTypes.func.isRequired
};

export default SettingsPage;

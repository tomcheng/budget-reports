import React from "react";
import PropTypes from "prop-types";
import Section from "./Section";
import { PageTitle, StrongText, SecondaryText } from "./typeComponents";
import { PrimaryButton } from "./Button";

const Unauthorized = ({ onAuthorize }) => (
  <Section>
    <PageTitle>Budget Reports</PageTitle>
    <div style={{ marginBottom: 10 }}>Get various insights from your YNAB account.</div>
    <PrimaryButton onClick={onAuthorize}>
      Authorize YNAB
    </PrimaryButton>
    <StrongText style={{ marginTop: 30 }}>Privacy Policy</StrongText>
    <SecondaryText>
      This website does not store any information from you or your YNAB account
      on it's server. All data retrieved from the YNAB API is stored only in
      your browser's local storage and is never transmitted to any other location or
      third-party.
    </SecondaryText>
  </Section>
);

Unauthorized.propTypes = {
  onAuthorize: PropTypes.func.isRequired
};

export default Unauthorized;

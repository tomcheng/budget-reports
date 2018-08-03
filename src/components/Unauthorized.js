import React from "react";
import PropTypes from "prop-types";
import Section from "./Section";
import { PageTitle } from "./typeComponents";
import { PrimaryButton } from "./Button";

const Unauthorized = ({ onAuthorize }) => (
  <Section>
    <PageTitle>Budget Reports</PageTitle>
    <div style={{ marginBottom: 15 }}>Get various insights from your YNAB account.</div>
    <PrimaryButton onClick={onAuthorize}>
      Authorize YNAB
    </PrimaryButton>
  </Section>
);

Unauthorized.propTypes = {
  onAuthorize: PropTypes.func.isRequired
};

export default Unauthorized;

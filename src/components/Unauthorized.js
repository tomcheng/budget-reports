import React from "react";
import PropTypes from "prop-types";
import Section from "./Section";
import { PageTitle } from "./typeComponents";
import { PrimaryButton } from "./Button";

const Unauthorized = ({ onAuthorize }) => (
  <Section>
    <PageTitle>Budget Reports</PageTitle>
    <p>Get various insights from your YNAB account.</p>
    <PrimaryButton onClick={onAuthorize}>
      Authorize YNAB
    </PrimaryButton>
  </Section>
);

Unauthorized.propTypes = {
  onAuthorize: PropTypes.func.isRequired
};

export default Unauthorized;

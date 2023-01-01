import React, { Fragment } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { MinorText, SecondaryText, StrongText } from "./typeComponents";
import Icon from "./Icon";
import EmptyText from "./EmptyText";
import Modal from "./Modal";
import AccountsSelectionForm from "./AccountsSelectionForm";
import { useFlagState } from "../commonHooks";

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SettingsMortgageAccounts = ({
  budget,
  mortgageAccounts,
  onUpdateAccounts
}) => {
  const [
    mortgageModalOpen,
    closeMortgageModal,
    openMortgageModal
  ] = useFlagState(false);

  const potentialMortageAccounts = budget.accounts.filter(
    account => (account.type === "otherLiability" || "mortgage") && !account.on_budget
  );
  const mortgageAccountList = budget.accounts.filter(
    ({ id }) => mortgageAccounts[id]
  );

  return (
    <Fragment>
      <SectionHeader>
        <StrongText>Mortgage Accounts</StrongText>
        <span onClick={openMortgageModal}>
          <Icon icon="pencil" />
        </span>
      </SectionHeader>
      {mortgageAccountList.length ? (
        mortgageAccountList.map(({ id, name }) => (
          <SecondaryText key={id}>{name}</SecondaryText>
        ))
      ) : (
        <EmptyText>No accounts marked as mortgage</EmptyText>
      )}
      <MinorText style={{ marginTop: 10 }}>
        Mortgage accounts are used in the retirement calculator since it's a
        significant expense you won't have in your retirement presumably.
      </MinorText>
      <Modal
        open={mortgageModalOpen}
        onClose={closeMortgageModal}
        title="Mortgage Account"
      >
        <AccountsSelectionForm
          accounts={potentialMortageAccounts}
          value={mortgageAccounts}
          onChange={accountsObject => {
            onUpdateAccounts({
              type: "mortgage",
              value: accountsObject
            });
          }}
        />
      </Modal>
    </Fragment>
  );
};

SettingsMortgageAccounts.propTypes = {
  budget: PropTypes.shape({
    accounts: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        on_budget: PropTypes.bool.isRequired,
        id: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired,
  mortgageAccounts: PropTypes.objectOf(PropTypes.bool).isRequired,
  onUpdateAccounts: PropTypes.func.isRequired
};

export default SettingsMortgageAccounts;

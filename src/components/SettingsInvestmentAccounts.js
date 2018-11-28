import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
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

const SettingsInvestmentAccounts = ({ budget, investmentAccounts, onUpdateAccounts }) => {
  const [
    investmentModalOpen,
    closeInvestmentModal,
    openInvestmentModal
  ] = useFlagState(false);

  const potentialInvestmentAccounts = budget.accounts.filter(
    account => account.type === "otherAsset" && !account.on_budget
  );
  const investmentAccountsList = budget.accounts.filter(
    ({ id }) => investmentAccounts[id]
  );

  return (
    <Fragment>
      <SectionHeader>
        <StrongText>Investment Accounts</StrongText>
        <span onClick={openInvestmentModal}>
          <Icon icon="pencil" />
        </span>
      </SectionHeader>
      {investmentAccountsList.length ? (
        investmentAccountsList.map(({ id, name }) => (
          <SecondaryText key={id}>{name}</SecondaryText>
        ))
      ) : (
        <EmptyText>No accounts marked as investment</EmptyText>
      )}
      <MinorText style={{ marginTop: 10 }}>
        Transfers to investment accounts are not counted as spending since it's
        assumed it's for retirement or some other savings goal.
      </MinorText>
      <Modal
        open={investmentModalOpen}
        onClose={closeInvestmentModal}
        title="Investment Accounts"
      >
        <AccountsSelectionForm
          accounts={potentialInvestmentAccounts}
          value={investmentAccounts}
          onChange={accountsObject => {
            onUpdateAccounts({
              type: "investment",
              value: accountsObject
            });
          }}
        />
      </Modal>
    </Fragment>
  );
};

SettingsInvestmentAccounts.propTypes = {
  budget: PropTypes.shape({
    accounts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        on_budget: PropTypes.bool.isRequired
      })
    ).isRequired
  }).isRequired,
  investmentAccounts: PropTypes.objectOf(PropTypes.bool).isRequired,
  onUpdateAccounts: PropTypes.func.isRequired,
};

export default SettingsInvestmentAccounts;

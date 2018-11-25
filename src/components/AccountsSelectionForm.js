import React from "react";
import PropTypes from "prop-types";
import omit from "lodash/fp/omit";
import ToggleWithLabel from "./ToggleWithLabel";

const AccountsSelectionForm = ({ accounts, value, onChange }) =>
  accounts.map(({ id, name }) => (
    <ToggleWithLabel
      key={id}
      checked={!!value[id]}
      name={id}
      onChange={evt => {
        const { name, checked } = evt.target;

        onChange(
          checked
            ? {
                ...value,
                [name]: true
              }
            : omit(name)(value)
        );
      }}
      label={name}
    />
  ));

AccountsSelectionForm.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  value: PropTypes.objectOf(PropTypes.bool).isRequired,
  onChange: PropTypes.func.isRequired
};

export default AccountsSelectionForm;

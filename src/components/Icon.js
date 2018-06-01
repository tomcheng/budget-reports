import React from "react";
import PropTypes from "prop-types";
import keys from "lodash/keys";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faCaretDown from "@fortawesome/fontawesome-free-solid/faCaretDown";
import faChevronRight from "@fortawesome/fontawesome-free-solid/faChevronRight";

const ICONS = {
  "caret-down": faCaretDown,
  "chevron-right": faChevronRight
};

const Icon = ({ icon, ...other }) => (
  <FontAwesomeIcon {...other} icon={ICONS[icon]} />
);

Icon.propTypes = {
  icon: PropTypes.oneOf(keys(ICONS)).isRequired
};

export default Icon;

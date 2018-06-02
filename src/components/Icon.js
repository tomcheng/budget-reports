import React from "react";
import PropTypes from "prop-types";
import keys from "lodash/keys";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faArrowLeft from "@fortawesome/fontawesome-free-solid/faArrowLeft";
import faCaretDown from "@fortawesome/fontawesome-free-solid/faCaretDown";
import faChevronRight from "@fortawesome/fontawesome-free-solid/faChevronRight";
import faEllipsisV from "@fortawesome/fontawesome-free-solid/faEllipsisV";

const ICONS = {
  "arrow-left": faArrowLeft,
  "caret-down": faCaretDown,
  "chevron-right": faChevronRight,
  "ellipsis-v": faEllipsisV
};

const Icon = ({ icon, ...other }) => (
  <FontAwesomeIcon {...other} icon={ICONS[icon]} />
);

Icon.propTypes = {
  icon: PropTypes.oneOf(keys(ICONS)).isRequired
};

export default Icon;

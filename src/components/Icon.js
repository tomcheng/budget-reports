import React from "react";
import PropTypes from "prop-types";
import keys from "lodash/fp/keys";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faArrowLeft from "@fortawesome/fontawesome-free-solid/faArrowLeft";
import faBars from "@fortawesome/fontawesome-free-solid/faBars";
import faCaretDown from "@fortawesome/fontawesome-free-solid/faCaretDown";
import faChevronRight from "@fortawesome/fontawesome-free-solid/faChevronRight";
import faEllipsisV from "@fortawesome/fontawesome-free-solid/faEllipsisV";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";

const ICONS = {
  "arrow-left": faArrowLeft,
  bars: faBars,
  "caret-down": faCaretDown,
  "chevron-right": faChevronRight,
  "ellipsis-v": faEllipsisV,
  times: faTimes
};

const Icon = ({ icon, ...other }) => (
  <FontAwesomeIcon {...other} icon={ICONS[icon]} />
);

Icon.propTypes = {
  icon: PropTypes.oneOf(keys(ICONS)).isRequired
};

export default Icon;

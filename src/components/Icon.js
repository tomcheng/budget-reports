import React from "react";
import PropTypes from "prop-types";
import keys from "lodash/fp/keys";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons/faEyeSlash";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons/faPencilAlt";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(
  faArrowLeft,
  faBars,
  faCaretDown,
  faChevronRight,
  faCog,
  faEllipsisV,
  faEye,
  faEyeSlash,
  faPencilAlt,
  faTimes
);

const ICONS = {
  "arrow-left": faArrowLeft,
  bars: faBars,
  "caret-down": faCaretDown,
  "chevron-right": faChevronRight,
  cog: faCog,
  pencil: faPencilAlt,
  "ellipsis-v": faEllipsisV,
  eye: faEye,
  "eye-slash": faEyeSlash,
  times: faTimes
};

const PRESET_STYLES = {
  faded: {
    fontWeight: 400,
    color: "#aaa",
    fontSize: 10
  }
};

const Icon = ({ icon, style, faded, ...other }) => (
  <FontAwesomeIcon
    {...other}
    icon={ICONS[icon]}
    style={{ ...style, ...(faded && PRESET_STYLES.faded) }}
  />
);

Icon.propTypes = {
  icon: PropTypes.oneOf(keys(ICONS)).isRequired,
  faded: PropTypes.bool
};

export default Icon;

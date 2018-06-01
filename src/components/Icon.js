import React from "react";
import PropTypes from "prop-types";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faChevronRight from "@fortawesome/fontawesome-free-solid/faChevronRight";

const ICONS = {
  "chevron-right": faChevronRight
};

const Icon = ({ icon, ...other }) => (
  <FontAwesomeIcon {...other} icon={ICONS[icon]} />
);

Icon.propTypes = {
  icon: PropTypes.oneOf(["chevron-right"]).isRequired
};

export default Icon;

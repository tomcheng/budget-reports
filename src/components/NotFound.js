import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <Fragment>
    <div>
      Not Found
    </div>
    <div>
      <Link to="/">Home</Link>
    </div>
  </Fragment>
);

export default NotFound;

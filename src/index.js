import React from "react";
import ReactDOM from "react-dom";
import { getAuthorizeToken, initializeYnabApi } from "./ynabRepo";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

const token = getAuthorizeToken();

if (token) {
  initializeYnabApi(token);
}

ReactDOM.render(
  <App isAuthorized={!!token} />,
  document.getElementById("root")
);

registerServiceWorker();

import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { getAuthorizeToken, initializeYnabApi } from "./ynabRepo";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";

const token = getAuthorizeToken();

if (token) {
  initializeYnabApi(token);
}

ReactDOM.render(
  <HashRouter>
    <App hasToken={!!token} />
  </HashRouter>,
  document.getElementById("root")
);

registerServiceWorker();

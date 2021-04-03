import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { getAuthorizeToken, initializeYnabApi } from "./ynabRepo";
import App from "./components/App";

const token = getAuthorizeToken();

if (token) {
  initializeYnabApi(token);
}

/***
 * You play the game to get points, but the point of the game is not
 * the points, it's the joy you get getting those points. Whether you
 * end up with a lot of points or very few points, you get the most
 * value by having played the game to the best of your ability and
 * getting maximal enjoyment from your time playing.
 ***/

ReactDOM.render(
  <HashRouter>
    <App hasToken={!!token} />
  </HashRouter>,
  document.getElementById("root")
);

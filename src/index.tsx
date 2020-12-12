import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import thunk, { ThunkDispatch } from "redux-thunk";
import { Provider } from "react-redux";
import { Amplify } from "@aws-amplify/core";

import reducer from "./redux/reducers";
import { McAction, McState } from "./info/types";

import App from "./App";
import "./index.css";

import * as serviceWorker from "./serviceWorker";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

const store = createStore(
  reducer,
  applyMiddleware<ThunkDispatch<McState, {}, McAction>, McState>(thunk)
);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

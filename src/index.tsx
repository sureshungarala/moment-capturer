import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import thunk, { ThunkDispatch } from "redux-thunk";
import { Provider } from "react-redux";
import { Amplify, Hub } from "@aws-amplify/core";

import { McAction } from "./redux/actions";
import reducer, { McState } from "./redux/reducers";

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

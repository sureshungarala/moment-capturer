import React from "react";
import ReactDOM from "react-dom";
import { Amplify } from "@aws-amplify/core";

import App from "./App";
import "./index.css";

import * as serviceWorker from "./serviceWorker";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

ReactDOM.render(<App />, document.getElementById("root"));

// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

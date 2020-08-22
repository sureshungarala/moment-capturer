import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk, { ThunkDispatch } from "redux-thunk";
import reducer, { McState } from "./reducers";
import { McAction } from "./actions";
import Header from "./components/Header";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Upload from "./components/Upload";
import "./App.scss";

const store = createStore(
  reducer,
  applyMiddleware<ThunkDispatch<McState, {}, McAction>, McState>(thunk)
);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="MC-App">
          <Header />
          <div className="mcBody">
            <Switch>
              <Route path="/upload" component={Upload} exact></Route>
              <Route path="/:categoryTag" component={Home}></Route>
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import CategoryHome from "./components/CategoryHome";
import Footer from "./components/Footer";
import Upload from "./components/Upload";
import "./App.scss";
import SignInForm from "./components/SignInForm";

function App() {
  return (
    <Router>
      <div className="MC-App">
        <Header />
        <div className="mcBody">
          <Switch>
            <Route path="/upload" component={Upload} exact></Route>
            <Route
              path="/signin"
              component={() => <SignInForm redirectToCategory />}
              exact
            ></Route>
            <Route path="/:categoryTag" component={CategoryHome}></Route>
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

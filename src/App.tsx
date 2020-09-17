import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Upload from "./components/Upload";
import SignInForm from "./components/SignInForm";
import UploadForm from "./components/UploadForm";
import "./App.scss";

function App() {
  return (
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
  );
}

export default App;

import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Loader from "./components/Loader";
import Footer from "./components/Footer";
import McErrorBoundary from "./components/ErrorBoundary";
import "./App.scss";

const Home = lazy(() => import("./components/Home"));
const Upload = lazy(() => import("./components/Upload"));
const SignIn = lazy(() => import("./components/SignInForm"));
const CategoryHome = lazy(() => import("./components/CategoryHome"));

const App: React.FunctionComponent = () => (
  <Router>
    <div className="MC-App">
      <Header />
      <div className="mcBody">
        <McErrorBoundary>
          <Suspense fallback={<Loader />}>
            <Switch>
              <Route path="/" component={Home} exact></Route>
              <Route path="/upload" component={Upload} exact></Route>
              <Route
                path="/signin"
                component={() => <SignIn redirectToCategory />}
                exact
              ></Route>
              <Route
                path="/:categoryTag"
                component={() => <CategoryHome />}
              ></Route>
            </Switch>
          </Suspense>
        </McErrorBoundary>
      </div>
      <Footer />
    </div>
  </Router>
);

export default App;

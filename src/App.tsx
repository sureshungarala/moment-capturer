import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Loader from "./components/Utils/Loader";
import Footer from "./components/Footer/Footer";
import McErrorBoundary from "./components/Utils/ErrorBoundary";
import ServiceWorkerStatus from "./components/Utils/ServiceWorkerStatus";
import McModal from "./components/Utils/McModal";
import "./App.scss";

import { watchAndScrollHeader } from "./utils/scrollHeader";

const importAmplifyOnNeed = async () => {
  const { Amplify } = await import("@aws-amplify/core");
  const { default: awsconfig } = await import("./aws-exports");
  Amplify.configure(awsconfig);
};

const AboutMe = lazy(() => import("./components/AboutMe"));
const Home = lazy(() => import("./components/Home"));
const Upload = lazy(async () => {
  await importAmplifyOnNeed();
  return import("./components/Upload");
});
const SignIn = lazy(async () => {
  await importAmplifyOnNeed();
  return import("./components/SignIn/SignInForm");
});
const CategoryHome = lazy(async () => {
  await importAmplifyOnNeed();
  return import("./components/CategoryHome");
});

const App: React.FunctionComponent = () => {
  useEffect(() => {
    watchAndScrollHeader();
  });

  return (
    <Router>
      <div className="MC-App">
        <Header />
        <div className="mcBody">
          <McErrorBoundary>
            <Suspense fallback={<Loader />}>
              <Switch>
                <Route path="/" component={Home} exact></Route>
                <Route path="/about" component={AboutMe}></Route>
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
        <McModal />
        <ServiceWorkerStatus />
        <Footer />
      </div>
    </Router>
  );
};

export default App;

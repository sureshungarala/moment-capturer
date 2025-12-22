import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header/Header";
import Loader from "./components/Utils/Loader";
import Footer from "./components/Footer/Footer";
import McErrorBoundary from "./components/Utils/ErrorBoundary";
import ServiceWorkerStatus from "./components/Utils/ServiceWorkerStatus";
import McModal from "./components/Utils/McModal";
import "./App.scss";

import { InitializeGA } from "./components/Utils/GA-Tracker";
import { watchAndScrollHeader } from "./utils/scrollHeader";
import { ThemeProvider } from "./context/ThemeContext";

const importAmplifyOnNeed = async () => {
  const { Amplify } = await import("aws-amplify");
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
  InitializeGA();
  const location = useLocation();

  useEffect(() => {
    watchAndScrollHeader();
  });

  return (
    <ThemeProvider>
      <div className="MC-App">
        <Header />
        <div className="mcBody">
          <McErrorBoundary>
            <Suspense fallback={<Loader />}>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Home />} />
                  <Route path="about" element={<AboutMe />} />
                  <Route path="upload" element={<Upload />} />
                  <Route
                    path="signin"
                    element={<SignIn redirectToCategory />}
                  />
                  <Route path=":categoryTag" element={<CategoryHome />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </McErrorBoundary>
        </div>
        <McModal />
        <ServiceWorkerStatus />
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;

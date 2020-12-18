import React, { useState, useEffect } from "react";

import Loader from "./Loader";
import SignInForm from "./SignInForm";
import UploadForm from "./UploadForm";
import { checkIfUserSignedIn } from "../utils/apis";

const Upload: React.FunctionComponent = () => {
  const [uploadState, setUploadState] = useState({
    checkingIfUserSignedIn: false,
    userSignedIn: false,
  });

  useEffect(() => {
    setUploadState({
      ...uploadState,
      checkingIfUserSignedIn: true,
    });

    checkIfUserSignedIn().then((userSignedIn) => {
      setUploadState({
        checkingIfUserSignedIn: false,
        userSignedIn,
      });
    });
  }, []);

  const { checkingIfUserSignedIn, userSignedIn } = uploadState;

  const renderTemplate = () => {
    if (checkingIfUserSignedIn) {
      return <Loader />;
    } else if (userSignedIn) {
      return <UploadForm />;
    }
    return <SignInForm />;
  };

  return renderTemplate();
};

export default Upload;

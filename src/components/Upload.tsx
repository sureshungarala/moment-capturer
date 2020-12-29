import React, { useState, useEffect } from "react";

import Loader from "./Utils/Loader";
import SignInForm from "./SignIn/SignInForm";
import UploadForm from "./ImageActions/UploadForm";
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
    return (
      <SignInForm
        onSuccessfulSignIn={() => {
          setUploadState({ ...uploadState, userSignedIn: true });
        }}
      />
    );
  };

  return renderTemplate();
};

export default Upload;

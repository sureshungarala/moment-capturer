import React, { useEffect, useState } from "react";
import { Auth } from "@aws-amplify/auth";

import SignInForm from "./SignInForm";
import UploadForm from "./UploadForm";

interface uploadState {
  fetchingCurrentUserDetails: boolean;
  userPresent: boolean;
}

const Upload: React.FunctionComponent = () => {
  const [templateState, setTemplateState] = useState<uploadState>({
    fetchingCurrentUserDetails: true,
    userPresent: false,
  });

  useEffect(() => {
    Auth.currentAuthenticatedUser().then(
      () => {
        allowUpload();
      },
      (error) => {
        console.error(
          "Failed to fetch current user details with error: ",
          error
        );
        setTemplateState({
          fetchingCurrentUserDetails: false,
          userPresent: false,
        });
      }
    );
  }, []);

  const allowUpload = () => {
    setTemplateState({
      fetchingCurrentUserDetails: false,
      userPresent: true,
    });
  };

  const renderTemplate = () => {
    if (templateState.fetchingCurrentUserDetails) {
      return (
        <div className="fetchingCurrentUserDetails">
          <div className="spinner"></div>
        </div>
      );
    } else if (templateState.userPresent) {
      return <UploadForm />;
    }
    return <SignInForm onUserFound={allowUpload} />;
  };

  return <div className="uploadOrSignInContainer">{renderTemplate()}</div>;
};

export default Upload;

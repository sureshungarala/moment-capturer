import React, { useState, useEffect } from 'react';
import { Auth } from '@aws-amplify/auth';

import Loader from './Utils/Loader';
import SignInForm from './SignIn/SignInForm';
import UploadForm from './ImageActions/UploadForm';
import { checkIfUserSignedIn } from '../utils/apis';
import { dispachSignedInEvent } from '../utils/helpers';

import '../styles/templates/sign_in_or_upload_form.scss';

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

    checkIfUserSignedIn(Auth).then((userSignedIn) => {
      setUploadState({
        checkingIfUserSignedIn: false,
        userSignedIn,
      });
      if (userSignedIn) dispachSignedInEvent();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

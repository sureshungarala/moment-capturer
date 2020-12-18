import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import {
  signIn as CognitoSignIn,
  changePassword as CognitoChangePassword,
} from "../utils/apis";
import { getFirstCategory } from "../utils/helpers";
import { signIncustomEventName } from "../utils/constants";

interface signInFormRouterProps {
  //contains history object and ...
}

interface signInFormState {
  processing: boolean;
  failed: boolean;
  succeeded: boolean;
}

interface credentialsState {
  username: string;
  password: string;
}

interface signInFormProps extends RouteComponentProps<signInFormRouterProps> {
  redirectToCategory?: boolean;
}

interface processingState {
  processing: string;
  succeeded: string;
  failed: string;
}

interface currentUser {
  user: Object;
}

const SignInForm: React.FunctionComponent<signInFormProps> = (
  props: signInFormProps
) => {
  // --------------------------- state -----------------------------

  const firstCategoryTag = getFirstCategory().tag;

  const [currentUser, setCurrentUser] = useState<currentUser>({
    user: {},
  });

  const [formState, setFormState] = useState<signInFormState>({
    processing: false,
    failed: false,
    succeeded: false,
  });

  const [credentials, setCredentials] = useState<credentialsState>({
    username: "",
    password: "",
  });

  const [changingPwd, shouldChangePwd] = useState(false);

  const [newPassword, setNewPassword] = useState("");

  const [processingState, setProcessingState] = useState<processingState>({
    processing: "Logging in...",
    succeeded: "Logged In",
    failed: "Failed to login.",
  });
  // --------------------------- end state -----------------------------

  useEffect(() => {
    setProcessingState({
      processing: changingPwd ? "Setting password..." : "Logging in...",
      succeeded: changingPwd ? "Password set." : "Logged In.",
      failed: changingPwd ? "Failed to set password." : "Failed to login.",
    });
  }, [changingPwd]);

  // --------------------------- end effects -----------------------------

  const dispatchSignInStatus = () => {
    document.dispatchEvent(
      new CustomEvent(signIncustomEventName, { detail: true })
    );
  };

  const signIn = () => {
    setFormState({
      processing: true,
      failed: false,
      succeeded: false,
    });

    CognitoSignIn(credentials.username, credentials.password).then(
      (data) => {
        setCurrentUser(data);
        setFormState({
          processing: false,
          failed: false,
          succeeded: false, // to use the same state in changePwd component
        });
        if (data.challengeName === "NEW_PASSWORD_REQUIRED") {
          shouldChangePwd(true);
        } else {
          setFormState({
            processing: false,
            succeeded: true,
            failed: false,
          });
          if (props.redirectToCategory) {
            props.history.push(`/${firstCategoryTag}`);
          }
          dispatchSignInStatus();
        }
      },
      (error) => {
        console.error("Failed to sign with error: ", error);
        setFormState({
          processing: false,
          succeeded: false,
          failed: true,
        });
      }
    );
  };

  const updatePassword = () => {
    setFormState({
      processing: true,
      failed: false,
      succeeded: false,
    });

    CognitoChangePassword(currentUser, newPassword).then(
      () => {
        setFormState({
          processing: false,
          failed: false,
          succeeded: true,
        });
        if (props.redirectToCategory) {
          props.history.push(`/${firstCategoryTag}`);
        }
        dispatchSignInStatus();
      },
      (error) => {
        console.error("Failed to update password with error: ", error);
        setFormState({
          processing: false,
          succeeded: false,
          failed: true,
        });
      }
    );
  };

  // --------------------------- actual rendering -----------------------------

  const renderProcessingState = () => {
    let template = <></>;
    if (formState.processing) {
      template = (
        <div>
          <span className="processing"></span>
          &nbsp;&nbsp;
          <span>{processingState.processing}</span>
        </div>
      );
    } else if (formState.failed) {
      template = <div className="error">{processingState.failed}</div>;
    } else if (formState.succeeded) {
      template = <div className="success">{processingState.succeeded}</div>;
    }
    return <div className="loginStatus">{template}</div>;
  };

  const changePwd = () => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        updatePassword();
      }}
    >
      <label>You need to change password to confirm user account</label>
      <div className="newPassword">
        <label htmlFor="newPassword">New Password</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />
      </div>
      <div className="changePwd">
        {renderProcessingState()}
        <input
          type="submit"
          value="Change Password"
          className={!newPassword ? "disabled" : ""}
        />
      </div>
    </form>
  );

  const logIn = () => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        signIn();
      }}
    >
      <label>Sign in to upload or edit images</label>
      <div className="username">
        <label htmlFor="username">Username</label>
        <input
          type="email"
          id="username"
          value={credentials.username}
          onChange={(event) =>
            setCredentials({ ...credentials, username: event.target.value })
          }
        />
      </div>
      <div className="password">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={credentials.password}
          onChange={(event) =>
            setCredentials({ ...credentials, password: event.target.value })
          }
        />
      </div>
      <div className="signin">
        {renderProcessingState()}
        <input
          type="submit"
          value="Sign In"
          className={
            !credentials.username || !credentials.password ? "disabled" : ""
          }
        />
      </div>
      <div className="loginStatus"></div>
    </form>
  );

  return (
    <div className="uploadOrSignInContainer">
      <section className="signin-form">
        {changingPwd ? changePwd() : logIn()}
      </section>
    </div>
  );
};

export default withRouter(SignInForm);

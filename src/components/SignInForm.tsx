import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Auth } from "@aws-amplify/auth";

import { McState } from "../info/types";

import { SET_IF_USER_SIGNED_IN } from "../redux/actions";
import { getFirstCategory } from "../utils/helpers";

interface MapStateToProps {
  categoryTag: string;
}

interface MapDispatchToProps {
  userSignedIn: () => void;
}

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

interface signInFormProps
  extends MapStateToProps,
    MapDispatchToProps,
    RouteComponentProps<signInFormRouterProps> {
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

  const signIn = () => {
    setFormState({
      processing: true,
      failed: false,
      succeeded: false,
    });

    Auth.signIn(credentials.username, credentials.password).then(
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
            props.history.push(`/${props.categoryTag}`);
          }
          props.userSignedIn();
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

    Auth.completeNewPassword(currentUser, newPassword).then(
      () => {
        setFormState({
          processing: false,
          failed: false,
          succeeded: true,
        });
        if (props.redirectToCategory) {
          props.history.push(`/${props.categoryTag}`);
        }
        props.userSignedIn();
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

const mapStateToProps = (state: McState) => ({
  categoryTag: state.categoryTag || getFirstCategory().tag,
});

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    userSignedIn: () => {
      dispatch({
        type: SET_IF_USER_SIGNED_IN,
        userSignedIn: true,
      });
    },
  };
};

export default withRouter(
  connect<MapStateToProps, MapDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps
  )(SignInForm)
);

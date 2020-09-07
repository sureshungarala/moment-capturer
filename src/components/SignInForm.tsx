import React, { useState } from "react";
import { Auth } from "@aws-amplify/auth";

interface signInFormState {
  signingIn: boolean;
  signInFailed: boolean;
  signedIn: boolean;
}

interface credentialsState {
  username: string;
  password: string;
}

interface signInFormProps {
  onUserFound: () => void;
}

const SignInForm: React.FunctionComponent<signInFormProps> = (
  props: signInFormProps
) => {
  const [signInState, setSignInState] = useState<signInFormState>({
    signingIn: false,
    signInFailed: false,
    signedIn: false,
  });

  const [credentials, setCredentials] = useState<credentialsState>({
    username: "",
    password: "",
  });

  const signIn = () => {
    setSignInState({
      signingIn: true,
      signInFailed: false,
      signedIn: false,
    });
    Auth.signIn(credentials.username, credentials.password).then(
      (data) => {
        console.log("user data ", data);
        setSignInState({
          signingIn: false,
          signInFailed: false,
          signedIn: true,
        });
        props.onUserFound();
      },
      (error) => {
        console.log("erorrr ", error);
        setSignInState({
          signingIn: false,
          signedIn: false,
          signInFailed: true,
        });
      }
    );
  };

  const renderLoginState = () => {
    let template = <></>;
    if (signInState.signingIn) {
      template = (
        <div>
          <span className="processing"></span>
          &nbsp;&nbsp;
          <span>Logging in...</span>
        </div>
      );
    } else if (signInState.signInFailed) {
      template = <div className="error">Failed to login.</div>;
    } else if (signInState.signedIn) {
      template = <div className="success">Logged In</div>;
    }
    return <div className="loginStatus">{template}</div>;
  };

  return (
    <section className="signin-form">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          signIn();
        }}
      >
        <label>Sign in to upload images</label>
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
          {renderLoginState()}
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
    </section>
  );
};

export default SignInForm;

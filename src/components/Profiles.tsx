import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";

import { McState, McAction } from "../info/types";
import { getFirstCategory } from "../utils/helpers";
import { signOutUser } from "../redux/actions";

interface MapStateToProps {
  categoryTag: string;
  userSignedIn: boolean;
}

interface MapDispatchToProps {
  signOutUser: () => Promise<void>;
}

interface profileProps extends MapStateToProps, MapDispatchToProps {}

const Profiles: React.FunctionComponent<profileProps> = (props) => {
  const signInOrSignOut = () => {
    if (props.userSignedIn) {
      return (
        <NavLink
          to={`/${props.categoryTag}`}
          onClick={() => {
            props.signOutUser();
          }}
        >
          Sign out
        </NavLink>
      );
    }
    return <NavLink to="/signin">Sign in</NavLink>;
  };

  return (
    <div className="profiles">
      <div className="profileMenu"></div>
      <ul>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.instagram.com/i_am_the_moment_capturer/"
          >
            <span></span>
            <span>Instagram</span>
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.facebook.com/momentcapturer77"
          >
            <span></span>
            <span>Facebook</span>
          </a>
        </li>
        <li>
          <NavLink to="/upload">Add Captures</NavLink>
        </li>
        <li>{signInOrSignOut()}</li>
      </ul>
    </div>
  );
};

const mapStateToProps = (state: McState) => ({
  categoryTag: state.categoryTag || getFirstCategory().tag,
  userSignedIn: state.userSignedIn || false,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<McState, {}, McAction>
): MapDispatchToProps => {
  return {
    signOutUser: async () => {
      await dispatch(signOutUser());
    },
  };
};

export default connect<MapStateToProps, MapDispatchToProps>(
  mapStateToProps,
  mapDispatchToProps
)(Profiles);

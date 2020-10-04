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
  let [className, setClassName] = useState("");

  const hideProfileSectionOnLiClick = () => {
    setClassName("hide");
    window.setTimeout(() => {
      setClassName("");
    }, 300);
  };

  const signInOrSignOut = () => {
    if (props.userSignedIn) {
      return (
        <NavLink
          to={`/${props.categoryTag}`}
          onClick={() => {
            props.signOutUser();
            hideProfileSectionOnLiClick();
          }}
        >
          Sign out
        </NavLink>
      );
    }
    return (
      <NavLink to="/signin" onClick={hideProfileSectionOnLiClick}>
        Sign in
      </NavLink>
    );
  };

  return (
    <div className="profiles">
      <div className="profileMenu"></div>
      <ul className={className}>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.facebook.com/momentcapturer77"
            onClick={hideProfileSectionOnLiClick}
          >
            <span></span>
            <span>Instagram</span>
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.instagram.com/i_am_the_moment_capturer/"
            onClick={hideProfileSectionOnLiClick}
          >
            <span></span>
            <span>Facebook</span>
          </a>
        </li>
        <li>
          <NavLink to="/upload" onClick={hideProfileSectionOnLiClick}>
            Add Captures
          </NavLink>
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

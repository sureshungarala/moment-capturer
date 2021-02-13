import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import { getFirstCategory } from "../../utils/helpers";
import { checkIfUserSignedIn, signOutUser } from "../../utils/apis";
import { signIncustomEventName } from "../../utils/constants";

interface profileProps {}

const Profiles: React.FunctionComponent<profileProps> = (props) => {
  const [isUserSignedIn, userSignedIn] = useState(false);

  const profilesRef = useRef(null);

  // workaround for redux cleanup ---
  const customEventDetail = (event: Event): event is CustomEvent =>
    "detail" in event;

  document.addEventListener(signIncustomEventName, (event: Event) => {
    userSignedIn(customEventDetail(event));
  });
  // --------------------------------
  useEffect(() => {
    checkIfUserSignedIn().then((userDidSignIn) => {
      userSignedIn(userDidSignIn);
    });
  }, []);

  const signInOrSignOut = () => {
    if (isUserSignedIn) {
      return (
        <NavLink
          to={`/${getFirstCategory().tag}`}
          onClick={() => {
            signOutUser().then((userSignedOut: Boolean) => {
              userSignedIn(!userSignedOut);
            });
          }}
        >
          Sign out
        </NavLink>
      );
    }
    return <NavLink to="/signin">Sign in</NavLink>;
  };

  return (
    <div className="profiles" tabIndex={0} ref={profilesRef}>
      <div
        className="profileMenu"
        role="menuitem"
        aria-haspopup="menu"
        aria-label="Menu"
      ></div>
      <ul role="menu">
        <li role="menuitem">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.instagram.com/i_am_the_moment_capturer/"
          >
            <span></span>
            <span>Instagram</span>
          </a>
        </li>
        <li role="menuitem">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.facebook.com/momentcapturer77"
          >
            <span></span>
            <span>Facebook</span>
          </a>
        </li>
        <li role="menuitem">
          <NavLink to="/upload">Add Captures</NavLink>
        </li>
        <li role="menuitem">{signInOrSignOut()}</li>
      </ul>
    </div>
  );
};

export default Profiles;

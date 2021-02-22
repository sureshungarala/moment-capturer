import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import { getFirstCategory } from "../../utils/helpers";
import { checkIfUserSignedIn, signOutUser } from "../../utils/apis";
import { signIncustomEventName } from "../../utils/constants";

interface profileProps {}

const Profiles: React.FunctionComponent<profileProps> = (props) => {
  const [isUserSignedIn, userSignedIn] = useState(false);
  const [isFocussed, setIfFocussed] = useState(false);

  let stopFocusUseEffect = false;

  const focusRef = useRef(isFocussed);
  const profilesRef = useRef<HTMLDivElement>(null);
  let listItems:
    | NodeListOf<HTMLLIElement>
    | undefined = profilesRef.current?.querySelectorAll("ul > li");
  let focussedElem: HTMLLIElement | null | undefined = null;

  /* --------------------------- Event handlers start(a11y) ------------------------------ */
  const updateFocus = (focussed: boolean) => {
    focusRef.current = focussed;
    setIfFocussed(focussed);
  };

  const focus = () => {
    focussedElem?.querySelector("a")?.focus({ preventScroll: true });
  };
  const focusHandler = () => {
    updateFocus(true);
  };

  const mouseoverHandler = (elem: HTMLLIElement) => {
    focussedElem = elem;
    focus();
  };

  const clickHandler = () => {
    updateFocus(false);
  };

  const keydownHandler = (event: KeyboardEvent) => {
    const { key } = event;
    if (focusRef.current) {
      if (key === "ArrowDown") {
        focussedElem =
          (focussedElem?.nextElementSibling as HTMLLIElement) ||
          profilesRef.current?.querySelector("ul > li:first-child");
        event.preventDefault();
        focus();
      } else if (key === "ArrowUp") {
        focussedElem =
          (focussedElem?.previousElementSibling as HTMLLIElement) ||
          profilesRef.current?.querySelector("ul > li:last-child");
        event.preventDefault();
        focus();
      } else if (key === "Escape") {
        updateFocus(false);
      }
    }
  };

  // workaround for redux cleanup ---
  const customEventDetail = (event: Event): event is CustomEvent =>
    "detail" in event;

  const signInWatchHandler = (event: Event) => {
    userSignedIn(customEventDetail(event));
  };
  /* --------------------------- Event handlers end ------------------------------ */

  useEffect(() => {
    checkIfUserSignedIn().then((userDidSignIn) => {
      userSignedIn(userDidSignIn);
    });
    /* ------------------------------- A11y ---------------------------------- */
    const { current } = profilesRef;
    current?.addEventListener("focus", focusHandler);
    current?.addEventListener("mouseover", focusHandler);
    current?.addEventListener("keydown", keydownHandler);
    document.addEventListener(signIncustomEventName, signInWatchHandler);

    return () => {
      updateFocus(false);
      current?.removeEventListener("keydown", keydownHandler);
      current?.removeEventListener("focus", focusHandler);
      current?.removeEventListener("mouseover", focusHandler);
      listItems?.forEach((elem: HTMLLIElement) => {
        elem.removeEventListener("mouseover", () => mouseoverHandler(elem));
        elem.removeEventListener("click", clickHandler);
      });
      document.removeEventListener(signIncustomEventName, signInWatchHandler);
    };
  }, []);

  useEffect(() => {
    if (isFocussed && !stopFocusUseEffect) {
      stopFocusUseEffect = true;
      listItems = profilesRef.current?.querySelectorAll("ul > li");
      listItems?.forEach((elem: HTMLLIElement) => {
        elem.addEventListener("mouseover", () => mouseoverHandler(elem));
        elem.addEventListener("click", clickHandler);
      });
    }
  }, [isFocussed]);

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
      {isFocussed && (
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
      )}
    </div>
  );
};

export default Profiles;

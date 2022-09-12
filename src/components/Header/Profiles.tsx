import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { getFirstCategory } from '../../utils/helpers';
import { signOutUser } from '../../utils/apis';
import { signIncustomEventName } from '../../utils/constants';

interface profileProps {}

const Profiles: React.FunctionComponent<profileProps> = (_props) => {
  const [isUserSignedIn, userSignedIn] = useState(false);
  const [isFocussed, setIfFocussed] = useState(false);

  let stopFocusUseEffectRef = useRef(false);
  const focusRef = useRef(isFocussed);
  const profilesRef = useRef<HTMLDivElement>(null);
  let listItems = useRef<NodeListOf<HTMLLIElement> | undefined>(
    profilesRef.current?.querySelectorAll('ul > li')
  );
  let focussedElem: HTMLLIElement | null | undefined = null;

  /* --------------------------- Event handlers start(a11y) ------------------------------ */
  const updateFocus = (focussed: boolean) => {
    focusRef.current = focussed;
    setIfFocussed(focussed);
  };

  const focus = () => {
    focussedElem?.querySelector('a')?.focus({ preventScroll: true });
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
      if (key === 'ArrowDown') {
        focussedElem =
          (focussedElem?.nextElementSibling as HTMLLIElement) ||
          profilesRef.current?.querySelector('ul > li:first-child');
        event.preventDefault();
        focus();
      } else if (key === 'ArrowUp') {
        focussedElem =
          (focussedElem?.previousElementSibling as HTMLLIElement) ||
          profilesRef.current?.querySelector('ul > li:last-child');
        event.preventDefault();
        focus();
      } else if (key === 'Escape') {
        updateFocus(false);
      }
    }
  };

  const signInWatchHandler = (event: CustomEvent) => {
    userSignedIn(event.detail);
  };
  /* --------------------------- Event handlers end ------------------------------ */

  useEffect(() => {
    /* ------------------------------- A11y ---------------------------------- */
    const { current } = profilesRef;
    current?.addEventListener('focus', focusHandler);
    current?.addEventListener('mouseover', focusHandler);
    current?.addEventListener('keydown', keydownHandler);
    document.addEventListener(
      signIncustomEventName,
      signInWatchHandler as EventListener
    );

    return () => {
      updateFocus(false);
      current?.removeEventListener('keydown', keydownHandler);
      current?.removeEventListener('focus', focusHandler);
      current?.removeEventListener('mouseover', focusHandler);
      listItems.current?.forEach((elem: HTMLLIElement) => {
        elem.removeEventListener('mouseover', () => mouseoverHandler(elem));
        elem.removeEventListener('click', clickHandler);
      });
      document.removeEventListener(
        signIncustomEventName,
        signInWatchHandler as EventListener
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFocussed && !stopFocusUseEffectRef.current) {
      stopFocusUseEffectRef.current = true;
      listItems.current = profilesRef.current?.querySelectorAll('ul > li');
      listItems.current?.forEach((elem: HTMLLIElement) => {
        elem.addEventListener('mouseover', () => mouseoverHandler(elem));
        elem.addEventListener('click', clickHandler);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocussed]);

  const signInOrSignOut = () => (
    <NavLink
      to={`/${getFirstCategory().tag}`}
      onClick={async () => {
        const { Auth } = await import('@aws-amplify/auth');
        signOutUser(Auth).then((userSignedOut: Boolean) => {
          userSignedIn(!userSignedOut);
        });
      }}
    >
      Sign out
    </NavLink>
  );

  return (
    <div className='profiles' tabIndex={0} ref={profilesRef}>
      <div className='profileMenu' aria-haspopup='menu' aria-label='Menu'></div>
      {isFocussed && (
        <ul role='menu'>
          <li role='menuitem'>
            <NavLink to='/upload'>Add Captures</NavLink>
          </li>
          <li role='menuitem'>
            <NavLink to='/about'>About me</NavLink>
          </li>
          {isUserSignedIn && <li role='menuitem'>{signInOrSignOut()}</li>}
        </ul>
      )}
    </div>
  );
};

export default Profiles;

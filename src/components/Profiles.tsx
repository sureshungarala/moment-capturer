import React from "react";
import { NavLink } from "react-router-dom";

const Profiles: React.FunctionComponent = () => {
  return (
    <div className="profiles">
      <div className="profileMenu"></div>
      <ul>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.facebook.com/momentcapturer77"
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
          >
            <span></span>
            <span>Facebook</span>
          </a>
        </li>
        <li>
          <NavLink to="/upload">Add Captures</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Profiles;

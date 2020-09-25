import React from "react";
import { NavLink } from "react-router-dom";

const Profiles: React.FunctionComponent = () => {
  return (
    <div className="profiles">
      <div className="profilePic"></div>
      <ul>
        <li>
          <a target="_blank" rel="noopener noreferrer" href="">
            <span></span>
            <span>Instagram</span>
          </a>
        </li>
        <li>
          <a target="_blank" rel="noopener noreferrer" href="">
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
